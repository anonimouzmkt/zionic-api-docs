const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const router = express.Router();

// Configurar multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

// ✅ HELPER: Extrair número de telefone limpo
function extractPhoneNumber(externalId) {
  if (!externalId) return '';
  
  // Extrair número do formato "5511999999999@s.whatsapp.net"
  const match = externalId.match(/^(\d+)@/);
  return match ? match[1] : '';
}

// ✅ HELPER: Fallback para configurações Evolution usando env vars
function getEvolutionConfigFallback(instanceName = 'default') {
  return {
    id: 'env-fallback',
    name: instanceName,
    phone_number: '',
    server_url: process.env.EVOLUTION_API_URL || 'https://evowise.anonimouz.com',
    api_key: process.env.EVOLUTION_API_KEY || 'GfwncPVPb2ou4i1DMI9IEAVVR3p0fI7W',
    status: 'connected'
  };
}

// ✅ HELPER: Buscar dados completos da conversa (USA INSTANCE REAL + ENV VARS)
async function getConversationData(conversationId, companyId, supabase) {
  try {
    console.log('🔍 Buscando conversa com instance real + env vars para configuração');
    
    // Buscar conversa + contato + instance_id
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select(`
        id, company_id, contact_id, external_id, title, status, whatsapp_instance_id,
        contacts!inner(
          id, first_name, last_name, full_name, phone, email, company_name
        )
      `)
      .eq('id', conversationId)
      .eq('company_id', companyId)
      .single();

    if (convError || !conversation) {
      return {
        success: false,
        error: 'Conversa não encontrada ou sem acesso',
        details: convError?.message
      };
    }

    // Buscar dados básicos da instância (só ID e nome)
    const { data: instance, error: instanceError } = await supabase
      .from('whatsapp_instances')
      .select('id, name, phone_number')
      .eq('id', conversation.whatsapp_instance_id)
      .single();

    if (instanceError || !instance) {
      return {
        success: false,
        error: 'Instância WhatsApp não encontrada',
        details: instanceError?.message
      };
    }

    // Extrair dados estruturados
    const contact = conversation.contacts;
    const externalId = conversation.external_id;
    const phoneNumber = extractPhoneNumber(externalId);

    // USA ENV VARS para configuração + dados reais da instância
    const instanceData = {
      id: instance.id,
      name: instance.name,
      phone_number: instance.phone_number || '',
      server_url: process.env.EVOLUTION_API_URL || 'https://evowise.anonimouz.com',
      api_key: process.env.EVOLUTION_API_KEY || 'GfwncPVPb2ou4i1DMI9IEAVVR3p0fI7W',
      status: 'connected'
    };

    return {
      success: true,
      data: {
        conversation: {
          id: conversation.id,
          company_id: conversation.company_id,
          contact_id: conversation.contact_id,
          external_id: conversation.external_id,
          title: conversation.title,
          status: conversation.status
        },
        contact: {
          id: contact.id,
          name: contact.full_name || `${contact.first_name} ${contact.last_name}`.trim(),
          phone: contact.phone || phoneNumber,
          email: contact.email,
          company: contact.company_name,
          whatsapp_phone: phoneNumber
        },
        instance: instanceData
      }
    };

  } catch (error) {
    console.error('❌ Erro em getConversationData:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ✅ HELPER: Salvar mensagem no banco
async function saveMessageToDatabase(conversationId, direction, messageType, content, attachment, sentByAi, externalId, supabase, sentViaAgent = false) {
  try {
    const messageData = {
      conversation_id: conversationId,
      direction,
      message_type: messageType,
      content,
      sent_by_ai: sentByAi || false,
      status: 'sent',
      sent_at: new Date().toISOString(),
      external_id: externalId,
      metadata: attachment ? { attachment } : { sent_via: 'conversation_api' }
    };

    if (sentViaAgent) {
      messageData.metadata.sent_via_agent = true;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select('id')
      .single();

    if (error) throw error;

    // Atualizar timestamp da conversa
    await supabase
      .from('conversations')
      .update({ 
        last_message_at: new Date().toISOString()
      })
      .eq('id', conversationId);

    return {
      success: true,
      messageId: data.id
    };

  } catch (error) {
    console.error('❌ Erro ao salvar mensagem:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ===== ROTAS BASEADAS EM CONVERSATION_ID =====

// ✅ ROTA: Enviar mensagem de texto via conversation_id
router.post('/send-text', async (req, res) => {
  try {
    const { conversation_id, message, delay = 1000, sent_via_agent = false } = req.body;
    const companyId = req.company.id;
    const apiKeyData = req.apiKey;

    // Validações
    if (!conversation_id || !message) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: conversation_id, message',
        example: {
          conversation_id: "uuid-da-conversa",
          message: "Sua mensagem aqui",
          delay: 1000,
          sent_via_agent: false // ✅ NOVO: indica se foi enviado via agent custom
        }
      });
    }

    console.log(`📤 [CONVERSATION] Enviando mensagem de texto:`, {
      company: req.company.name,
      apiKey: apiKeyData.name,
      conversationId: conversation_id,
      messageLength: message.length,
      sentViaAgent: sent_via_agent // ✅ NOVO: Log do flag
    });

    // 1. Buscar dados da conversa
    const conversationResult = await getConversationData(conversation_id, companyId, req.supabase);
    if (!conversationResult.success) {
      return res.status(404).json({
        success: false,
        error: conversationResult.error,
        details: conversationResult.details
      });
    }

    const { conversation, contact, instance } = conversationResult.data;

    // 2. Enviar via Evolution API
    const evolutionResponse = await fetch(`${instance.server_url}/message/sendText/${instance.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instance.api_key
      },
      body: JSON.stringify({
        number: contact.whatsapp_phone,
        text: message,
        options: {
          delay: delay,
          presence: 'composing'
        }
      })
    });

    const evolutionResult = await evolutionResponse.json();

    if (!evolutionResponse.ok) {
      throw new Error(evolutionResult.error?.message || 'Erro na Evolution API');
    }

    // 3. Salvar mensagem no banco
    const saveResult = await saveMessageToDatabase(
      conversation_id,
      'outbound',
      'text',
      message,
      null,
      sent_via_agent, // ✅ CORREÇÃO: sent_via_agent = true marca como IA para trigger follow-up
      evolutionResult.key?.id,
      req.supabase,
      sent_via_agent // ✅ NOVO: Passar flag para salvar no metadata
    );

    console.log(`✅ [CONVERSATION] Mensagem de texto enviada:`, {
      conversationId: conversation_id,
      messageId: saveResult.messageId,
      evolutionId: evolutionResult.key?.id,
      sentViaAgent: sent_via_agent // ✅ NOVO: Log confirmação
    });

    res.json({
      success: true,
      message: 'Mensagem de texto enviada com sucesso',
      data: {
        messageId: saveResult.messageId,
        conversationId: conversation_id,
        contactName: contact.name,
        instanceName: instance.name,
        evolutionId: evolutionResult.key?.id,
        content: message,
        sentAt: new Date().toISOString(),
        type: 'text',
        sentViaAgent: sent_via_agent // ✅ NOVO: Retornar flag na resposta
      }
    });

  } catch (error) {
    console.error('❌ [CONVERSATION] Erro no envio de texto:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ ROTA: Enviar imagem via conversation_id
router.post('/send-image', async (req, res) => {
  try {
    const { conversation_id, image_url, caption, delay = 1200, sent_via_agent = false } = req.body;
    const companyId = req.company.id;
    const apiKeyData = req.apiKey;

    // Validações
    if (!conversation_id || !image_url) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: conversation_id, image_url',
        example: {
          conversation_id: "uuid-da-conversa",
          image_url: "https://exemplo.com/imagem.jpg",
          caption: "Legenda opcional",
          delay: 1200,
          sent_via_agent: false
        }
      });
    }

    console.log(`📸 [CONVERSATION] Enviando imagem:`, {
      company: req.company.name,
      apiKey: apiKeyData.name,
      conversationId: conversation_id,
      imageUrl: image_url.substring(0, 50) + '...',
      sentViaAgent: sent_via_agent
    });

    // 1. Buscar dados da conversa
    const conversationResult = await getConversationData(conversation_id, companyId, req.supabase);
    if (!conversationResult.success) {
      return res.status(404).json({
        success: false,
        error: conversationResult.error
      });
    }

    const { conversation, contact, instance } = conversationResult.data;

    // 2. Enviar via Evolution API
    const evolutionResponse = await fetch(`${instance.server_url}/message/sendMedia/${instance.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instance.api_key
      },
      body: JSON.stringify({
        number: contact.whatsapp_phone,
        media: image_url,
        caption: caption || '',
        options: {
          delay: delay,
          presence: 'composing'
        }
      })
    });

    const evolutionResult = await evolutionResponse.json();

    if (!evolutionResponse.ok) {
      throw new Error(evolutionResult.error?.message || 'Erro ao enviar imagem');
    }

    // 3. Preparar dados do attachment
    const attachmentData = {
      name: 'image.jpg',
      url: image_url,
      type: 'image',
      caption: caption || null
    };

    // 4. Salvar mensagem no banco
    const saveResult = await saveMessageToDatabase(
      conversation_id,
      'outbound',
      'image',
      caption || 'Imagem enviada',
      attachmentData,
      sent_via_agent,
      evolutionResult.key?.id,
      req.supabase,
      sent_via_agent
    );

    console.log(`✅ [CONVERSATION] Imagem enviada:`, {
      conversationId: conversation_id,
      messageId: saveResult.messageId,
      caption: caption,
      sentViaAgent: sent_via_agent
    });

    res.json({
      success: true,
      message: 'Imagem enviada com sucesso',
      data: {
        messageId: saveResult.messageId,
        conversationId: conversation_id,
        contactName: contact.name,
        instanceName: instance.name,
        evolutionId: evolutionResult.key?.id,
        imageUrl: image_url,
        caption: caption,
        sentAt: new Date().toISOString(),
        type: 'image',
        sentViaAgent: sent_via_agent
      }
    });

  } catch (error) {
    console.error('❌ [CONVERSATION] Erro no envio de imagem:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ ROTA: Enviar imagem via base64 direto via conversation_id
router.post('/send-image-base64', async (req, res) => {
  try {
    const { conversation_id, image_base64, caption, filename = 'image.jpg', delay = 1200, sent_via_agent = false } = req.body;
    const companyId = req.company.id;
    const apiKeyData = req.apiKey;

    // Validações
    if (!conversation_id || !image_base64) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: conversation_id, image_base64',
        example: {
          conversation_id: "uuid-da-conversa",
          image_base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
          caption: "Legenda opcional",
          filename: "imagem.jpg",
          delay: 1200,
          sent_via_agent: false
        }
      });
    }

    // Validar se é um base64 válido
    if (!image_base64.match(/^[A-Za-z0-9+/]+(=|==)?$/)) {
      return res.status(400).json({
        success: false,
        error: 'Base64 inválido. Envie apenas a string base64 sem prefixos como "data:image/jpeg;base64,"'
      });
    }

    console.log(`📸 [CONVERSATION] Enviando imagem via base64:`, {
      company: req.company.name,
      apiKey: apiKeyData.name,
      conversationId: conversation_id,
      filename: filename,
      base64Length: image_base64.length,
      sentViaAgent: sent_via_agent
    });

    // 1. Buscar dados da conversa
    const conversationResult = await getConversationData(conversation_id, companyId, req.supabase);
    if (!conversationResult.success) {
      return res.status(404).json({
        success: false,
        error: conversationResult.error,
        details: conversationResult.details
      });
    }

    const { conversation, contact, instance } = conversationResult.data;

    // 2. Calcular tamanho aproximado da imagem
    const imageSizeBytes = (image_base64.length * 3) / 4;
    const imageSizeKB = Math.round(imageSizeBytes / 1024);

    // 3. Enviar via Evolution API
    const evolutionResponse = await fetch(`${instance.server_url}/message/sendMedia/${instance.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instance.api_key
      },
      body: JSON.stringify({
        number: contact.whatsapp_phone,
        media: image_base64,
        caption: caption || '',
        fileName: filename,
        mediatype: 'image',
        options: {
          delay: delay,
          presence: 'composing'
        }
      })
    });

    const evolutionResult = await evolutionResponse.json();

    if (!evolutionResponse.ok) {
      throw new Error(evolutionResult.error?.message || 'Erro ao enviar imagem via base64');
    }

    // 4. Preparar dados do attachment
    const attachmentData = {
      name: filename,
      type: 'image',
      size: `${imageSizeKB} KB`,
      caption: caption || null,
      base64_sent: true,
      url: `data:image/jpeg;base64,${image_base64}` // Para visualização
    };

    // 5. Salvar mensagem no banco
    const saveResult = await saveMessageToDatabase(
      conversation_id,
      'outbound',
      'image',
      caption || 'Imagem enviada via base64',
      attachmentData,
      sent_via_agent,
      evolutionResult.key?.id,
      req.supabase,
      sent_via_agent
    );

    console.log(`✅ [CONVERSATION] Imagem base64 enviada:`, {
      conversationId: conversation_id,
      messageId: saveResult.messageId,
      filename: filename,
      size: `${imageSizeKB} KB`,
      sentViaAgent: sent_via_agent
    });

    res.json({
      success: true,
      message: 'Imagem enviada com sucesso via base64',
      data: {
        messageId: saveResult.messageId,
        conversationId: conversation_id,
        contactName: contact.name,
        instanceName: instance.name,
        evolutionId: evolutionResult.key?.id,
        filename: filename,
        fileSize: `${imageSizeKB} KB`,
        caption: caption,
        sentAt: new Date().toISOString(),
        type: 'image',
        method: 'base64',
        sentViaAgent: sent_via_agent
      }
    });

  } catch (error) {
    console.error('❌ [CONVERSATION] Erro no envio de imagem base64:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ ROTA: Enviar áudio via conversation_id
router.post('/send-audio', async (req, res) => {
  try {
    const { conversation_id, audio_url, delay = 1500, sent_via_agent = false } = req.body;
    const companyId = req.company.id;

    // Validações
    if (!conversation_id || !audio_url) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: conversation_id, audio_url',
        example: {
          conversation_id: "uuid-da-conversa",
          audio_url: "https://exemplo.com/audio.mp3",
          delay: 1500
        }
      });
    }

    console.log(`🎵 [CONVERSATION] Enviando áudio:`, {
      conversationId: conversation_id,
      audioUrl: audio_url.substring(0, 50) + '...'
    });

    // 1. Buscar dados da conversa
    const conversationResult = await getConversationData(conversation_id, companyId, req.supabase);
    if (!conversationResult.success) {
      return res.status(404).json({
        success: false,
        error: conversationResult.error
      });
    }

    const { conversation, contact, instance } = conversationResult.data;

    // 2. Baixar áudio e converter para base64
    const audioResponse = await fetch(audio_url);
    if (!audioResponse.ok) {
      throw new Error('Erro ao baixar áudio da URL fornecida');
    }

    const audioBuffer = await audioResponse.buffer();
    const audioBase64 = audioBuffer.toString('base64');

    // 3. Enviar via Evolution API
    const evolutionResponse = await fetch(`${instance.server_url}/message/sendWhatsAppAudio/${instance.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instance.api_key
      },
      body: JSON.stringify({
        number: contact.whatsapp_phone,
        audiobase64: audioBase64,
        options: {
          delay: delay,
          presence: 'recording'
        }
      })
    });

    const evolutionResult = await evolutionResponse.json();

    if (!evolutionResponse.ok) {
      throw new Error(evolutionResult.error?.message || 'Erro ao enviar áudio');
    }

    // 4. Preparar dados do attachment
    const attachmentData = {
      name: 'audio.mp3',
      url: audio_url,
      type: 'audio',
      size: Math.round(audioBuffer.length / 1024) + ' KB'
    };

    // 5. Salvar mensagem no banco
    const saveResult = await saveMessageToDatabase(
      conversation_id,
      'outbound',
      'audio',
      'Áudio enviado',
      attachmentData,
      sent_via_agent, // ✅ CORREÇÃO: sent_via_agent = true marca como IA
      evolutionResult.key?.id,
      req.supabase,
      sent_via_agent // sent_via_agent
    );

    console.log(`✅ [CONVERSATION] Áudio enviado:`, {
      conversationId: conversation_id,
      messageId: saveResult.messageId,
      audioSize: attachmentData.size
    });

    res.json({
      success: true,
      message: 'Áudio enviado com sucesso',
      data: {
        messageId: saveResult.messageId,
        conversationId: conversation_id,
        contactName: contact.name,
        instanceName: instance.name,
        evolutionId: evolutionResult.key?.id,
        audioUrl: audio_url,
        fileSize: attachmentData.size,
        sentAt: new Date().toISOString(),
        type: 'audio'
      }
    });

  } catch (error) {
    console.error('❌ [CONVERSATION] Erro no envio de áudio:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ ROTA: Enviar vídeo via conversation_id
router.post('/send-video', async (req, res) => {
  try {
    const { conversation_id, video_url, caption, delay = 2000, sent_via_agent = false } = req.body;
    const companyId = req.company.id;

    // Validações
    if (!conversation_id || !video_url) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: conversation_id, video_url',
        example: {
          conversation_id: "uuid-da-conversa",
          video_url: "https://exemplo.com/video.mp4",
          caption: "Legenda opcional",
          delay: 2000
        }
      });
    }

    console.log(`🎬 [CONVERSATION] Enviando vídeo:`, {
      conversationId: conversation_id,
      videoUrl: video_url.substring(0, 50) + '...'
    });

    // 1. Buscar dados da conversa
    const conversationResult = await getConversationData(conversation_id, companyId, req.supabase);
    if (!conversationResult.success) {
      return res.status(404).json({
        success: false,
        error: conversationResult.error
      });
    }

    const { conversation, contact, instance } = conversationResult.data;

    // 2. Enviar via Evolution API
    const evolutionResponse = await fetch(`${instance.server_url}/message/sendMedia/${instance.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instance.api_key
      },
      body: JSON.stringify({
        number: contact.whatsapp_phone,
        media: video_url,
        caption: caption || '',
        mediatype: 'video',
        options: {
          delay: delay,
          presence: 'recording'
        }
      })
    });

    const evolutionResult = await evolutionResponse.json();

    if (!evolutionResponse.ok) {
      throw new Error(evolutionResult.error?.message || 'Erro ao enviar vídeo');
    }

    // 3. Preparar dados do attachment
    const attachmentData = {
      name: 'video.mp4',
      url: video_url,
      type: 'video',
      caption: caption || null
    };

    // 4. Salvar mensagem no banco
    const saveResult = await saveMessageToDatabase(
      conversation_id,
      'outbound',
      'video',
      caption || 'Vídeo enviado',
      attachmentData,
      sent_via_agent, // ✅ CORREÇÃO: sent_via_agent = true marca como IA
      evolutionResult.key?.id,
      req.supabase,
      sent_via_agent // sent_via_agent
    );

    console.log(`✅ [CONVERSATION] Vídeo enviado:`, {
      conversationId: conversation_id,
      messageId: saveResult.messageId,
      caption: caption
    });

    res.json({
      success: true,
      message: 'Vídeo enviado com sucesso',
      data: {
        messageId: saveResult.messageId,
        conversationId: conversation_id,
        contactName: contact.name,
        instanceName: instance.name,
        evolutionId: evolutionResult.key?.id,
        videoUrl: video_url,
        caption: caption,
        sentAt: new Date().toISOString(),
        type: 'video'
      }
    });

  } catch (error) {
    console.error('❌ [CONVERSATION] Erro no envio de vídeo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ ROTA: Enviar documento via conversation_id
router.post('/send-document', async (req, res) => {
  try {
    const { conversation_id, document_url, filename, caption, delay = 1500, sent_via_agent = false } = req.body;
    const companyId = req.company.id;

    // Validações
    if (!conversation_id || !document_url) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: conversation_id, document_url',
        example: {
          conversation_id: "uuid-da-conversa",
          document_url: "https://exemplo.com/documento.pdf",
          filename: "documento.pdf",
          caption: "Legenda opcional",
          delay: 1500
        }
      });
    }

    console.log(`📄 [CONVERSATION] Enviando documento:`, {
      conversationId: conversation_id,
      documentUrl: document_url.substring(0, 50) + '...',
      filename: filename
    });

    // 1. Buscar dados da conversa
    const conversationResult = await getConversationData(conversation_id, companyId, req.supabase);
    if (!conversationResult.success) {
      return res.status(404).json({
        success: false,
        error: conversationResult.error
      });
    }

    const { conversation, contact, instance } = conversationResult.data;

    // 2. Enviar via Evolution API
    const evolutionResponse = await fetch(`${instance.server_url}/message/sendMedia/${instance.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instance.api_key
      },
      body: JSON.stringify({
        number: contact.whatsapp_phone,
        media: document_url,
        caption: caption || '',
        fileName: filename || 'documento',
        mediatype: 'document',
        options: {
          delay: delay,
          presence: 'composing'
        }
      })
    });

    const evolutionResult = await evolutionResponse.json();

    if (!evolutionResponse.ok) {
      throw new Error(evolutionResult.error?.message || 'Erro ao enviar documento');
    }

    // 3. Preparar dados do attachment
    const attachmentData = {
      name: filename || 'documento',
      url: document_url,
      type: 'document',
      caption: caption || null
    };

    // 4. Salvar mensagem no banco
    const saveResult = await saveMessageToDatabase(
      conversation_id,
      'outbound',
      'document',
      caption || `Documento: ${filename || 'arquivo'}`,
      attachmentData,
      sent_via_agent, // ✅ CORREÇÃO: sent_via_agent = true marca como IA
      evolutionResult.key?.id,
      req.supabase,
      sent_via_agent // sent_via_agent
    );

    console.log(`✅ [CONVERSATION] Documento enviado:`, {
      conversationId: conversation_id,
      messageId: saveResult.messageId,
      filename: filename
    });

    res.json({
      success: true,
      message: 'Documento enviado com sucesso',
      data: {
        messageId: saveResult.messageId,
        conversationId: conversation_id,
        contactName: contact.name,
        instanceName: instance.name,
        evolutionId: evolutionResult.key?.id,
        documentUrl: document_url,
        filename: filename,
        caption: caption,
        sentAt: new Date().toISOString(),
        type: 'document'
      }
    });

  } catch (error) {
    console.error('❌ [CONVERSATION] Erro no envio de documento:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ ROTA: Marcar mensagem como lida via conversation_id
router.post('/mark-read', async (req, res) => {
  try {
    const { conversation_id } = req.body;
    const companyId = req.company.id;

    // Validações
    if (!conversation_id) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetro obrigatório: conversation_id',
        example: {
          conversation_id: "uuid-da-conversa"
        }
      });
    }

    console.log(`👁️ [CONVERSATION] Marcando como lida:`, {
      conversationId: conversation_id
    });

    // 1. Buscar dados da conversa
    const conversationResult = await getConversationData(conversation_id, companyId, req.supabase);
    if (!conversationResult.success) {
      return res.status(404).json({
        success: false,
        error: conversationResult.error
      });
    }

    const { conversation, contact, instance } = conversationResult.data;

    // 2. Buscar última mensagem não lida do contato
    const { data: lastMessage } = await req.supabase
      .from('messages')
      .select('external_id, content')
      .eq('conversation_id', conversation_id)
      .eq('direction', 'inbound')
      .not('external_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!lastMessage || !lastMessage.external_id) {
      return res.json({
        success: true,
        message: 'Nenhuma mensagem para marcar como lida',
        conversationId: conversation_id
      });
    }

    // 3. Marcar como lida via Evolution API
    const evolutionResponse = await fetch(`${instance.server_url}/chat/markMessageAsRead/${instance.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instance.api_key
      },
      body: JSON.stringify({
        readMessages: [{
          remoteJid: conversation.external_id,
          fromMe: false,
          id: lastMessage.external_id
        }]
      })
    });

    if (!evolutionResponse.ok) {
      const errorText = await evolutionResponse.text();
      throw new Error(`Erro ao marcar como lida: ${errorText}`);
    }

    console.log(`✅ [CONVERSATION] Marcada como lida:`, {
      conversationId: conversation_id,
      messageId: lastMessage.external_id
    });

    res.json({
      success: true,
      message: 'Conversa marcada como lida',
      data: {
        conversationId: conversation_id,
        contactName: contact.name,
        instanceName: instance.name,
        lastMessageId: lastMessage.external_id,
        markedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ [CONVERSATION] Erro ao marcar como lida:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ ROTA: Obter dados da conversa
router.get('/:conversation_id', async (req, res) => {
  try {
    const { conversation_id } = req.params;
    const companyId = req.company.id;

    console.log(`📋 [CONVERSATION] Buscando dados:`, {
      conversationId: conversation_id
    });

    // Buscar dados da conversa
    const conversationResult = await getConversationData(conversation_id, companyId, req.supabase);
    if (!conversationResult.success) {
      return res.status(404).json({
        success: false,
        error: conversationResult.error
      });
    }

    const { conversation, contact, instance } = conversationResult.data;

    // Buscar últimas mensagens
    const { data: messages } = await req.supabase
      .from('messages')
      .select('id, content, direction, message_type, sent_at, sent_by_ai, metadata')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: false })
      .limit(20);

    res.json({
      success: true,
      data: {
        conversation: conversation,
        contact: contact,
        instance: {
          id: instance.id,
          name: instance.name,
          phone_number: instance.phone_number,
          status: instance.status
        },
        messages: messages?.reverse() || [],
        messageCount: messages?.length || 0
      }
    });

  } catch (error) {
    console.error('❌ [CONVERSATION] Erro ao buscar dados:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ ROTA: Upload e envio de imagem direto via conversation_id
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    const { conversation_id, caption, delay = 1200, sent_via_agent = false } = req.body;
    const companyId = req.company.id;

    // Validações
    if (!conversation_id || !req.file) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: conversation_id e arquivo de imagem',
        example: 'Use multipart/form-data com campo "image" e conversation_id no body'
      });
    }

    console.log(`📸 [CONVERSATION] Upload de imagem:`, {
      company: req.company.name,
      conversationId: conversation_id,
      filename: req.file.originalname,
      size: `${Math.round(req.file.size / 1024)} KB`,
      sentViaAgent: sent_via_agent
    });

    // 1. Buscar dados da conversa
    const conversationResult = await getConversationData(conversation_id, companyId, req.supabase);
    if (!conversationResult.success) {
      return res.status(404).json({
        success: false,
        error: conversationResult.error
      });
    }

    const { conversation, contact, instance } = conversationResult.data;

    // 2. Upload para Supabase Storage
    const fileName = `conversation_${conversation_id}_${Date.now()}_${req.file.originalname}`;
    const filePath = `conversation-media/${companyId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await req.supabase.storage
      .from('media')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    // 3. Obter URL pública
    const { data: { publicUrl } } = req.supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // 4. Enviar via Evolution API
    const evolutionResponse = await fetch(`${instance.server_url}/message/sendMedia/${instance.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instance.api_key
      },
      body: JSON.stringify({
        number: contact.whatsapp_phone,
        media: publicUrl,
        caption: caption || '',
        options: {
          delay: delay,
          presence: 'composing'
        }
      })
    });

    const evolutionResult = await evolutionResponse.json();

    if (!evolutionResponse.ok) {
      throw new Error(evolutionResult.error?.message || 'Erro ao enviar imagem');
    }

    // 5. Preparar dados do attachment
    const attachmentData = {
      name: req.file.originalname,
      url: publicUrl,
      type: 'image',
      mimetype: req.file.mimetype,
      size: `${Math.round(req.file.size / 1024)} KB`,
      caption: caption || null
    };

    // 6. Salvar mensagem no banco
    const saveResult = await saveMessageToDatabase(
      conversation_id,
      'outbound',
      'image',
      caption || 'Imagem enviada',
      attachmentData,
      sent_via_agent, // ✅ CORREÇÃO: sent_via_agent = true marca como IA
      evolutionResult.key?.id,
      req.supabase,
      sent_via_agent // sent_via_agent
    );

    console.log(`✅ [CONVERSATION] Imagem enviada via upload:`, {
      conversationId: conversation_id,
      messageId: saveResult.messageId,
      filename: req.file.originalname,
      storageUrl: publicUrl,
      sentViaAgent: sent_via_agent
    });

    res.json({
      success: true,
      message: 'Imagem enviada com sucesso via upload',
      data: {
        messageId: saveResult.messageId,
        conversationId: conversation_id,
        contactName: contact.name,
        instanceName: instance.name,
        evolutionId: evolutionResult.key?.id,
        filename: req.file.originalname,
        fileSize: attachmentData.size,
        storageUrl: publicUrl,
        caption: caption,
        sentAt: new Date().toISOString(),
        type: 'image',
        sentViaAgent: sent_via_agent
      }
    });

  } catch (error) {
    console.error('❌ [CONVERSATION] Erro no upload de imagem:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ ROTA: Upload e envio de áudio direto via conversation_id
router.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    const { conversation_id, delay = 1500, sent_via_agent = false } = req.body;
    const companyId = req.company.id;

    // Validações
    if (!conversation_id || !req.file) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: conversation_id e arquivo de áudio',
        example: 'Use multipart/form-data com campo "audio" e conversation_id no body'
      });
    }

    console.log(`🎵 [CONVERSATION] Upload de áudio:`, {
      conversationId: conversation_id,
      filename: req.file.originalname,
      size: `${Math.round(req.file.size / 1024)} KB`,
      sentViaAgent: sent_via_agent
    });

    // 1. Buscar dados da conversa
    const conversationResult = await getConversationData(conversation_id, companyId, req.supabase);
    if (!conversationResult.success) {
      return res.status(404).json({
        success: false,
        error: conversationResult.error
      });
    }

    const { conversation, contact, instance } = conversationResult.data;

    // 2. Converter arquivo para base64
    const audioBase64 = req.file.buffer.toString('base64');

    // 3. Enviar via Evolution API (como áudio do WhatsApp)
    const evolutionResponse = await fetch(`${instance.server_url}/message/sendWhatsAppAudio/${instance.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instance.api_key
      },
      body: JSON.stringify({
        number: contact.whatsapp_phone,
        audiobase64: audioBase64,
        options: {
          delay: delay,
          presence: 'recording'
        }
      })
    });

    const evolutionResult = await evolutionResponse.json();

    if (!evolutionResponse.ok) {
      throw new Error(evolutionResult.error?.message || 'Erro ao enviar áudio');
    }

    // 4. Preparar dados do attachment (salvar no storage para histórico)
    const fileName = `conversation_${conversation_id}_${Date.now()}_${req.file.originalname}`;
    const filePath = `conversation-media/${companyId}/${fileName}`;

    const { data: uploadData } = await req.supabase.storage
      .from('media')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600'
      });

    const { data: { publicUrl } } = req.supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    const attachmentData = {
      name: req.file.originalname,
      url: publicUrl,
      type: 'audio',
      mimetype: req.file.mimetype,
      size: `${Math.round(req.file.size / 1024)} KB`
    };

    // 5. Salvar mensagem no banco
    const saveResult = await saveMessageToDatabase(
      conversation_id,
      'outbound',
      'audio',
      'Áudio enviado',
      attachmentData,
      sent_via_agent,
      evolutionResult.key?.id,
      req.supabase,
      sent_via_agent
    );

    console.log(`✅ [CONVERSATION] Áudio enviado via upload:`, {
      conversationId: conversation_id,
      messageId: saveResult.messageId,
      filename: req.file.originalname,
      sentViaAgent: sent_via_agent
    });

    res.json({
      success: true,
      message: 'Áudio enviado com sucesso via upload',
      data: {
        messageId: saveResult.messageId,
        conversationId: conversation_id,
        contactName: contact.name,
        instanceName: instance.name,
        evolutionId: evolutionResult.key?.id,
        filename: req.file.originalname,
        fileSize: attachmentData.size,
        storageUrl: publicUrl,
        sentAt: new Date().toISOString(),
        type: 'audio',
        sentViaAgent: sent_via_agent
      }
    });

  } catch (error) {
    console.error('❌ [CONVERSATION] Erro no upload de áudio:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ ROTA: Upload e envio de vídeo direto via conversation_id
router.post('/upload-video', upload.single('video'), async (req, res) => {
  try {
    const { conversation_id, caption, delay = 2000, sent_via_agent = false } = req.body;
    const companyId = req.company.id;

    // Validações
    if (!conversation_id || !req.file) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: conversation_id e arquivo de vídeo',
        example: 'Use multipart/form-data com campo "video" e conversation_id no body'
      });
    }

    console.log(`🎬 [CONVERSATION] Upload de vídeo:`, {
      conversationId: conversation_id,
      filename: req.file.originalname,
      size: `${Math.round(req.file.size / 1024 / 1024)} MB`,
      sentViaAgent: sent_via_agent
    });

    // 1. Buscar dados da conversa
    const conversationResult = await getConversationData(conversation_id, companyId, req.supabase);
    if (!conversationResult.success) {
      return res.status(404).json({
        success: false,
        error: conversationResult.error
      });
    }

    const { conversation, contact, instance } = conversationResult.data;

    // 2. Upload para Supabase Storage
    const fileName = `conversation_${conversation_id}_${Date.now()}_${req.file.originalname}`;
    const filePath = `conversation-media/${companyId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await req.supabase.storage
      .from('media')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    // 3. Obter URL pública
    const { data: { publicUrl } } = req.supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // 4. Enviar via Evolution API
    const evolutionResponse = await fetch(`${instance.server_url}/message/sendMedia/${instance.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instance.api_key
      },
      body: JSON.stringify({
        number: contact.whatsapp_phone,
        media: publicUrl,
        caption: caption || '',
        mediatype: 'video',
        options: {
          delay: delay,
          presence: 'recording'
        }
      })
    });

    const evolutionResult = await evolutionResponse.json();

    if (!evolutionResponse.ok) {
      throw new Error(evolutionResult.error?.message || 'Erro ao enviar vídeo');
    }

    // 5. Preparar dados do attachment
    const attachmentData = {
      name: req.file.originalname,
      url: publicUrl,
      type: 'video',
      mimetype: req.file.mimetype,
      size: `${Math.round(req.file.size / 1024 / 1024)} MB`,
      caption: caption || null
    };

    // 6. Salvar mensagem no banco
    const saveResult = await saveMessageToDatabase(
      conversation_id,
      'outbound',
      'video',
      caption || 'Vídeo enviado',
      attachmentData,
      sent_via_agent,
      evolutionResult.key?.id,
      req.supabase,
      sent_via_agent
    );

    console.log(`✅ [CONVERSATION] Vídeo enviado via upload:`, {
      conversationId: conversation_id,
      messageId: saveResult.messageId,
      filename: req.file.originalname,
      sentViaAgent: sent_via_agent
    });

    res.json({
      success: true,
      message: 'Vídeo enviado com sucesso via upload',
      data: {
        messageId: saveResult.messageId,
        conversationId: conversation_id,
        contactName: contact.name,
        instanceName: instance.name,
        evolutionId: evolutionResult.key?.id,
        filename: req.file.originalname,
        fileSize: attachmentData.size,
        storageUrl: publicUrl,
        caption: caption,
        sentAt: new Date().toISOString(),
        type: 'video',
        sentViaAgent: sent_via_agent
      }
    });

  } catch (error) {
    console.error('❌ [CONVERSATION] Erro no upload de vídeo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ ROTA: Upload e envio de documento direto via conversation_id
router.post('/upload-document', upload.single('document'), async (req, res) => {
  try {
    const { conversation_id, caption, delay = 1500, sent_via_agent = false } = req.body;
    const companyId = req.company.id;

    // Validações
    if (!conversation_id || !req.file) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: conversation_id e arquivo do documento',
        example: 'Use multipart/form-data com campo "document" e conversation_id no body'
      });
    }

    console.log(`📄 [CONVERSATION] Upload de documento:`, {
      conversationId: conversation_id,
      filename: req.file.originalname,
      size: `${Math.round(req.file.size / 1024)} KB`,
      sentViaAgent: sent_via_agent
    });

    // 1. Buscar dados da conversa
    const conversationResult = await getConversationData(conversation_id, companyId, req.supabase);
    if (!conversationResult.success) {
      return res.status(404).json({
        success: false,
        error: conversationResult.error
      });
    }

    const { conversation, contact, instance } = conversationResult.data;

    // 2. Upload para Supabase Storage
    const fileName = `conversation_${conversation_id}_${Date.now()}_${req.file.originalname}`;
    const filePath = `conversation-media/${companyId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await req.supabase.storage
      .from('media')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    // 3. Obter URL pública
    const { data: { publicUrl } } = req.supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // 4. Enviar via Evolution API
    const evolutionResponse = await fetch(`${instance.server_url}/message/sendMedia/${instance.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instance.api_key
      },
      body: JSON.stringify({
        number: contact.whatsapp_phone,
        media: publicUrl,
        caption: caption || '',
        fileName: req.file.originalname,
        mediatype: 'document',
        options: {
          delay: delay,
          presence: 'composing'
        }
      })
    });

    const evolutionResult = await evolutionResponse.json();

    if (!evolutionResponse.ok) {
      throw new Error(evolutionResult.error?.message || 'Erro ao enviar documento');
    }

    // 5. Preparar dados do attachment
    const attachmentData = {
      name: req.file.originalname,
      url: publicUrl,
      type: 'document',
      mimetype: req.file.mimetype,
      size: `${Math.round(req.file.size / 1024)} KB`,
      caption: caption || null
    };

    // 6. Salvar mensagem no banco
    const saveResult = await saveMessageToDatabase(
      conversation_id,
      'outbound',
      'document',
      caption || `Documento: ${req.file.originalname}`,
      attachmentData,
      sent_via_agent, // ✅ CORREÇÃO: sent_via_agent = true marca como IA
      evolutionResult.key?.id,
      req.supabase,
      sent_via_agent // sent_via_agent
    );

    console.log(`✅ [CONVERSATION] Documento enviado via upload:`, {
      conversationId: conversation_id,
      messageId: saveResult.messageId,
      filename: req.file.originalname,
      sentViaAgent: sent_via_agent
    });

    res.json({
      success: true,
      message: 'Documento enviado com sucesso via upload',
      data: {
        messageId: saveResult.messageId,
        conversationId: conversation_id,
        contactName: contact.name,
        instanceName: instance.name,
        evolutionId: evolutionResult.key?.id,
        filename: req.file.originalname,
        fileSize: attachmentData.size,
        storageUrl: publicUrl,
        caption: caption,
        sentAt: new Date().toISOString(),
        type: 'document',
        sentViaAgent: sent_via_agent
      }
    });

  } catch (error) {
    console.error('❌ [CONVERSATION] Erro no upload de documento:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ ROTA: Pausar ou atribuir agente na conversa
router.post('/agent-control', async (req, res) => {
  try {
    const { conversation_id, action, ai_agent_id, assigned_to } = req.body;
    const companyId = req.company.id;
    const apiKeyData = req.apiKey;

    // Validações
    if (!conversation_id || !action) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: conversation_id, action',
        actions: {
          'assign_ai': 'Atribuir agente IA (requer ai_agent_id)',
          'pause_ai': 'Pausar agente IA',
          'resume_ai': 'Reativar agente IA (mantém ai_agent_id atual)',
          'assign_human': 'Atribuir agente humano (requer assigned_to)',
          'unassign_human': 'Remover atribuição humana',
          'remove_ai': 'Remover agente IA completamente'
        },
        example: {
          conversation_id: "uuid-da-conversa",
          action: "assign_ai",
          ai_agent_id: "uuid-do-agente-ia"
        }
      });
    }

    const validActions = ['assign_ai', 'pause_ai', 'resume_ai', 'assign_human', 'unassign_human', 'remove_ai'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        error: `Ação inválida. Ações válidas: ${validActions.join(', ')}`
      });
    }

    console.log(`🎛️ [AGENT-CONTROL] Ação solicitada:`, {
      company: req.company.name,
      apiKey: apiKeyData.name,
      conversationId: conversation_id,
      action: action,
      aiAgentId: ai_agent_id,
      assignedTo: assigned_to
    });

    // 1. Verificar se a conversa existe e pertence à empresa
    const { data: conversation, error: convError } = await req.supabase
      .from('conversations')
      .select(`
        id, company_id, ai_agent_id, ai_enabled, assigned_to, title,
        contacts!inner(full_name, first_name, last_name)
      `)
      .eq('id', conversation_id)
      .eq('company_id', companyId)
      .single();

    if (convError || !conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversa não encontrada ou sem acesso',
        details: convError?.message
      });
    }

    // 2. Preparar dados para atualização baseado na ação
    let updateData = {
      updated_at: new Date().toISOString()
    };
    let actionDescription = '';
    let validationError = null;

    switch (action) {
      case 'assign_ai':
        if (!ai_agent_id) {
          validationError = 'ai_agent_id é obrigatório para action "assign_ai"';
          break;
        }
        
        // Verificar se o agente existe e pertence à empresa
        const { data: aiAgent, error: agentError } = await req.supabase
          .from('ai_agents')
          .select('id, name, company_id, status')
          .eq('id', ai_agent_id)
          .eq('company_id', companyId)
          .single();

        if (agentError || !aiAgent) {
          validationError = 'Agente IA não encontrado ou sem acesso';
          break;
        }

        if (aiAgent.status !== 'active') {
          validationError = `Agente IA está inativo (status: ${aiAgent.status})`;
          break;
        }

        updateData.ai_agent_id = ai_agent_id;
        updateData.ai_enabled = true;
        updateData.assigned_at = new Date().toISOString();
        actionDescription = `Agente IA "${aiAgent.name}" atribuído e ativado`;
        break;

      case 'pause_ai':
        updateData.ai_enabled = false;
        actionDescription = 'Agente IA pausado (mantém atribuição)';
        break;

      case 'resume_ai':
        if (!conversation.ai_agent_id) {
          validationError = 'Nenhum agente IA atribuído para reativar';
          break;
        }
        updateData.ai_enabled = true;
        actionDescription = 'Agente IA reativado';
        break;

      case 'assign_human':
        if (!assigned_to) {
          validationError = 'assigned_to é obrigatório para action "assign_human"';
          break;
        }

        // Verificar se o usuário existe e pertence à empresa
        const { data: user, error: userError } = await req.supabase
          .from('users')
          .select('id, name, company_id')
          .eq('id', assigned_to)
          .eq('company_id', companyId)
          .single();

        if (userError || !user) {
          validationError = 'Usuário não encontrado ou sem acesso';
          break;
        }

        updateData.assigned_to = assigned_to;
        updateData.assigned_at = new Date().toISOString();
        updateData.ai_enabled = false; // Pausar IA quando atribuir humano
        actionDescription = `Atribuído ao agente humano "${user.name}" (IA pausada)`;
        break;

      case 'unassign_human':
        updateData.assigned_to = null;
        updateData.assigned_at = null;
        actionDescription = 'Atribuição humana removida';
        break;

      case 'remove_ai':
        updateData.ai_agent_id = null;
        updateData.ai_enabled = false;
        actionDescription = 'Agente IA removido completamente';
        break;

      default:
        validationError = `Ação "${action}" não implementada`;
    }

    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError
      });
    }

    // 3. Atualizar conversa
    const { data: updatedConversation, error: updateError } = await req.supabase
      .from('conversations')
      .update(updateData)
      .eq('id', conversation_id)
      .eq('company_id', companyId)
      .select(`
        id, ai_agent_id, ai_enabled, assigned_to, updated_at,
        ai_agents(id, name),
        users(id, name)
      `)
      .single();

    if (updateError) {
      throw new Error(`Erro ao atualizar conversa: ${updateError.message}`);
    }

    // 4. Registrar atividade (opcional - para auditoria)
    try {
      await req.supabase
        .from('ai_activities')
        .insert({
          company_id: companyId,
          contact_id: conversation.contacts?.id,
          type: 'agent_control',
          title: `Controle de Agente: ${action}`,
          description: actionDescription,
          conversation_id: conversation_id,
          ai_agent_id: action.includes('ai') ? (updateData.ai_agent_id || conversation.ai_agent_id) : null,
          metadata: {
            previous_state: {
              ai_agent_id: conversation.ai_agent_id,
              ai_enabled: conversation.ai_enabled,
              assigned_to: conversation.assigned_to
            },
            new_state: {
              ai_agent_id: updatedConversation.ai_agent_id,
              ai_enabled: updatedConversation.ai_enabled,
              assigned_to: updatedConversation.assigned_to
            },
            action: action,
            performed_via: 'api',
            api_key_used: apiKeyData.name
          }
        });
    } catch (activityError) {
      console.warn('⚠️ Falha ao registrar atividade:', activityError.message);
    }

    // 5. Preparar resposta
    const contactName = conversation.contacts?.full_name || 
                       `${conversation.contacts?.first_name} ${conversation.contacts?.last_name}`.trim() || 
                       'Cliente';

    console.log(`✅ [AGENT-CONTROL] Ação executada com sucesso:`, {
      conversationId: conversation_id,
      action: action,
      description: actionDescription,
      contactName: contactName
    });

    res.json({
      success: true,
      message: actionDescription,
      data: {
        conversation_id: conversation_id,
        contact_name: contactName,
        conversation_title: conversation.title,
        action_performed: action,
        current_state: {
          ai_agent: updatedConversation.ai_agents ? {
            id: updatedConversation.ai_agents.id,
            name: updatedConversation.ai_agents.name,
            enabled: updatedConversation.ai_enabled
          } : null,
          human_agent: updatedConversation.users ? {
            id: updatedConversation.users.id,
            name: updatedConversation.users.name
          } : null,
          ai_enabled: updatedConversation.ai_enabled
        },
        timestamp: updatedConversation.updated_at
      }
    });

  } catch (error) {
    console.error('❌ Erro no controle de agente:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

module.exports = router; 
