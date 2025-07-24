const express = require('express');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const yaml = require('js-yaml');

const app = express();
const port = process.env.PORT || 10000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do Swagger/OpenAPI
const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: '🚀 Zionic API',
      version: '3.9.1',
      description: `
# API Zionic - WhatsApp Business Integração

**Plataforma completa para automação de WhatsApp Business**

**✨ ATUALIZADO v3.9.1 - Vinculação Inteligente de Leads em Agendamentos**

**🎯 NOVO v3.9.1: Integração Inteligente Calendar + Leads:**

\`\`\`javascript
// MÉTODO 1: Vinculação automática por telefone
POST /api/calendar/schedule
{
  "title": "Reunião com cliente",
  "start_time": "2024-01-15T14:00:00",
  "end_time": "2024-01-15T15:00:00",
  "contact_phone": "11999999999",  // 🎯 BUSCA AUTOMÁTICA
  "calendar_id": "uuid-da-agenda"
}
// ✅ Sistema busca automaticamente o lead pelo telefone e vincula

// MÉTODO 2: Vinculação automática por email  
POST /api/calendar/schedule
{
  "title": "Apresentação proposta",
  "start_time": "2024-01-15T16:00:00",
  "end_time": "2024-01-15T17:00:00",
  "contact_email": "cliente@empresa.com",  // 🎯 BUSCA AUTOMÁTICA
  "calendar_id": "uuid-da-agenda"
}
// ✅ Sistema busca automaticamente o lead pelo email e vincula

// MÉTODO 3: Vinculação direta (método tradicional)
POST /api/calendar/schedule  
{
  "title": "Fechamento negócio",
  "start_time": "2024-01-15T18:00:00",
  "end_time": "2024-01-15T19:00:00", 
  "lead_id": "uuid-do-lead",  // 🎯 VINCULAÇÃO DIRETA
  "calendar_id": "uuid-da-agenda"
}
\`\`\`

**✅ FUNCIONALIDADES v3.9.1:**
- Busca automática de leads por telefone/email do contato
- Vinculação automática quando contato encontrado
- Notificações automáticas quando lead é vinculado automaticamente
- Compatibilidade total com método tradicional (lead_id direto)
- Integração automática com Google Calendar (evento criado instantaneamente)
- Informações detalhadas sobre processo de vinculação na resposta

**✨ FUNCIONALIDADES v3.9.0 - Criação e Movimentação de Leads com Pipelines Específicos**

**🎯 NOVO: Controle Total de Pipelines:**

\`\`\`javascript
// Criar lead em pipeline específico
POST /api/leads
{
  "title": "João Silva - Interessado",
  "phone": "11999999999",
  "pipeline_id": "uuid-do-pipeline",
  "column_id": "uuid-da-coluna" // opcional
}

// Mover lead entre colunas/pipelines
POST /api/leads/lead-id/move
{
  "column_id": "nova-coluna-id",
  "position": 1 // opcional
}

// Transferir lead para outro pipeline
POST /api/leads/lead-id/move-to-pipeline
{
  "pipeline_id": "outro-pipeline-id",
  "column_id": "coluna-especifica-id" // opcional
}

// Listar pipelines da empresa
GET /api/pipelines

// Obter pipeline padrão
GET /api/pipelines/default/info
\`\`\`

**✅ FUNCIONALIDADES v3.9.0:**
- Criação de leads em pipelines específicos
- Movimentação inteligente entre colunas e pipelines
- Validação automática de permissões
- Cálculo inteligente de posições
- Registro automático de atividades
- Integração completa com sistema de pipelines existente

**✨ ATUALIZADO v3.8.1 - Suporte a OpenAI Thread ID em endpoints de mensagens**

**🧵 NOVO: Parâmetro openai_thread_id:**

\`\`\`javascript
// Enviar mensagem com thread OpenAI anexada
POST /api/messages/send
{
  "number": "5511999999999",
  "message": "Olá! Como posso ajudar?",
  "openai_thread_id": "thread_abc123def456"
}

// Enviar mídia com thread OpenAI
POST /api/messages/send-media  
FormData {
  "number": "5511999999999",
  "file": arquivo,
  "caption": "Documento importante",
  "openai_thread_id": "thread_abc123def456"
}

// Responder mensagem com thread OpenAI
POST /api/messages/reply
{
  "number": "5511999999999", 
  "message": "Obrigado pelo contato!",
  "quotedMessageId": "uuid-mensagem",
  "openai_thread_id": "thread_abc123def456"
}
\`\`\`

**✅ FUNCIONALIDADES:**
- Thread ID é salva automaticamente na conversa criada
- Suporte em todos os endpoints de mensagens por número
- Validation pattern: ^thread_[a-zA-Z0-9]+$
- Campo opcional - não quebra compatibilidade
- Thread pode ser usada por agentes IA posteriormente

## 🌟 **Visão Geral**

A API Zionic oferece integração robusta com WhatsApp Business, permitindo envio de mensagens, mídia e automação completa de conversas.

## **Recursos Disponíveis**

### **Autenticação**
- Teste de API Key - \`GET /api/auth/test\`

### **Mensagens por Número**
- **✨ NOVO v3.8.1** Suporte a OpenAI Thread ID - Parâmetro \`openai_thread_id\` em todos os endpoints
- Envio de texto - \`POST /api/messages/send\`
- Envio de mídia com upload - \`POST /api/messages/send-media\` 
- Resposta com citação - \`POST /api/messages/reply\`

### **Mensagens via Conversation**
- **✨ NOVO v3.8.0** Buscar conversa por telefone - \`GET /api/conversation/find-by-phone/:phone\`
- Envio de texto - \`POST /api/conversation/send-text\`
- Envio de imagem via URL - \`POST /api/conversation/send-image\`
- **✨ NOVO v3.4.4** Envio de imagem via base64 - \`POST /api/conversation/send-image-base64\`
- Envio de áudio via URL - \`POST /api/conversation/send-audio\`
- Envio de vídeo via URL - \`POST /api/conversation/send-video\`
- Envio de documento via URL - \`POST /api/conversation/send-document\`
- Marcar como lida - \`POST /api/conversation/mark-read\`
- Obter dados da conversa - \`GET /api/conversation/:conversation_id\`

### **Upload Direto de Arquivos**
- Upload de imagem - \`POST /api/conversation/upload-image\`
- Upload de áudio - \`POST /api/conversation/upload-audio\`
- Upload de vídeo - \`POST /api/conversation/upload-video\`
- Upload de documento - \`POST /api/conversation/upload-document\`

### **Controle de Agentes** ✨ **NOVO na v3.1**
- Pausar ou atribuir agentes - \`POST /api/conversation/agent-control\`

### **Gerenciamento de Leads** 🎯 **ATUALIZADO na v3.9.0**
- Listar leads - \`GET /api/leads\`
- **✨ NOVO** Criar lead em pipeline específico - \`POST /api/leads\` (com \`pipeline_id\` e \`column_id\`)
- Buscar lead específico - \`GET /api/leads/:id\`
- Atualizar lead - \`PUT /api/leads/:id\`
- Deletar lead - \`DELETE /api/leads/:id\`
- **✨ MELHORADO** Mover lead entre colunas - \`POST /api/leads/:id/move\`
- **✨ NOVO** Transferir lead entre pipelines - \`POST /api/leads/:id/move-to-pipeline\`
- Listar leads de uma coluna - \`GET /api/leads/column/:column_id\`

### **Anexos de Leads** 📎 **NOVO na v3.3**
- Anexar documento via base64 - \`POST /api/leads/attachments/:leadId\`
- Listar anexos do lead - \`GET /api/leads/attachments/:leadId\`
- Deletar anexo - \`DELETE /api/leads/attachments/:leadId/:attachmentId\`

### **Gerenciamento de Pipelines** 🔄 **ATUALIZADO na v3.9.0**
- Listar pipelines da empresa - \`GET /api/pipelines\`
- Buscar pipeline específico - \`GET /api/pipelines/:id\`
- Obter pipeline padrão - \`GET /api/pipelines/default/info\`
- Listar colunas de um pipeline - \`GET /api/pipelines/:id/columns\`
- Listar todas as colunas - \`GET /api/pipelines/columns/all\`
- Estatísticas do pipeline - \`GET /api/pipelines/:id/stats\`

### **Gerenciamento de Colunas** 📋 **NOVO na v3.2**
- Listar colunas - \`GET /api/columns\`
- Buscar coluna específica - \`GET /api/columns/:id\`
- Listar leads de uma coluna - \`GET /api/columns/:id/leads\`

### **Gerenciamento de Agendamentos** 📅 **VINCULAÇÃO INTELIGENTE na v3.9.1**
- Verificar disponibilidade - \`GET /api/calendar/availability\` **[start_time/end_time ISO 8601]**
- Agendar horário - \`POST /api/calendar/schedule\` **[🎯 NOVO: vinculação automática de leads por contact_phone/email]**
- Listar agendamentos - \`GET /api/calendar/appointments\` **[start_time/end_time ISO ou filtros legacy]**
- Atualizar agendamento - \`PUT /api/calendar/appointments/:id\` **[calendar_id opcional para mover agenda]**
- Deletar agendamento - \`DELETE /api/calendar/appointments/:id\`
- Listar integrações Google Calendar - \`GET /api/calendar/integrations\`
- Status de múltiplas integrações - \`GET /api/calendar/integrations/status\`

### **Cálculo de Tokens OpenAI** 🧮 **NOVO na v3.7.0**
- Listar modelos suportados - \`GET /api/tokens/models\`
- Calcular tokens de entrada - \`POST /api/tokens/count\`
- Validar entrada para modelo - \`POST /api/tokens/validate\`
- Testar encoding específico - \`GET /api/tokens/encoding/:model\`
- **🎯 v3.9.1**: Vinculação inteligente de leads em agendamentos (busca automática por telefone/email)
- **🎯 v3.9.1**: Notificações automáticas quando leads são vinculados automaticamente
- **🎯 v3.9.1**: Informações detalhadas sobre processo de vinculação na resposta da API
- **🆕 v3.6.1**: Sistema completo de anexos para leads (upload base64, preview, categorização)
- **🆕 v3.6.0**: Formato ISO 8601 unificado (ex: 2025-07-07T11:30:00)
- **🆕 v3.6.0**: Simplificação de data/hora em parâmetro único
- **🆕 v3.6.0**: Timezone automático da tabela users.timezone
- **✅ v3.5.0**: Parâmetro \`calendar_id\` obrigatório para especificar qual agenda usar
- **✅ v3.5.0**: Suporte a múltiplas agendas por empresa com especificação obrigatória

**🆕 NOVO na v3.6.1 - SISTEMA DE ANEXOS PARA LEADS:**
- **📎 Upload Base64**: Anexar documentos, imagens e arquivos diretamente via API
- **📋 Categorização**: Organizar anexos por tipo (document, image, contract, proposal, other)
- **🔍 Preview Frontend**: Visualização de PDFs, imagens e textos no modal do lead
- **🗂️ Gestão Completa**: Listar, visualizar e deletar anexos via API e interface
- **☁️ Storage Supabase**: Armazenamento seguro com URLs públicas automáticas
- **🛡️ Segurança**: RLS policies e validação por empresa/usuário
- **📊 Metadados**: Informações completas sobre upload, tamanho e tipo de arquivo
- **💾 Soft Delete**: Histórico preservado com exclusão suave

**⚠️ BREAKING CHANGES v3.6.0 - FORMATO UNIFICADO:**
- **NOVO FORMATO**: Endpoints de calendário agora usam ISO 8601 unificado:
  - \`GET /api/calendar/availability?start_time=2025-07-07T09:00:00&end_time=2025-07-07T18:00:00&calendar_id=UUID\`
  - \`GET /api/calendar/appointments?start_time=2025-07-07T00:00:00&end_time=2025-07-07T23:59:59\`
- **SIMPLIFICAÇÃO**: Data e hora em parâmetro único ao invés de separados
- **COMPATIBILIDADE**: Formatos antigos ainda funcionam (LEGACY)
- **TIMEZONE**: Buscado automaticamente da tabela \`users.timezone\` da empresa
- **BENEFÍCIO**: Menos redundância e maior precisão temporal

**⚠️ BREAKING CHANGES v3.5.0 - CALENDÁRIO:**
- **OBRIGATÓRIO**: Parâmetro \`calendar_id\` agora é obrigatório nos endpoints
- **COMO OBTER**: Use \`GET /api/calendar/integrations\` para listar agendas disponíveis
- **VALIDAÇÃO**: API valida se calendar_id pertence à sua empresa

**⏰ TIMEZONE - Como Agendar no Horário Correto (v3.5.1):**
- ✅ **NOVA LÓGICA**: Horários SEMPRE interpretados como timezone da empresa
- ✅ **SEM AMBIGUIDADE**: Remove automaticamente sufixos de timezone (.000Z, +XX:XX)
- ✅ **CONVERSÃO AUTOMÁTICA**: Converte para UTC baseado no timezone da empresa
- Se não configurado, usa timezone padrão do Brasil (America/Sao_Paulo - GMT-3)
- **EXEMPLO**: Para agendar às 09h em São Paulo, envie: \`"2025-07-18T09:00:00.000Z"\`
- **RESULTADO**: API interpreta como 09h São Paulo e salva como 12h UTC no banco
- **MELHORIA**: Elimina confusão entre horário local vs UTC
- **TODOS os endpoints de calendário respeitam e retornam o timezone configurado**
- **GET /availability/:date** - Considera horários no timezone correto
- **POST /schedule** - Cria agendamentos considerando timezone da empresa
- **GET /appointments** - Filtra datas no timezone correto  
- **PUT /appointments/:id** - Atualiza considerando timezone
- **DELETE /appointments/:id** - Remove considerando timezone
- **Resposta JSON sempre inclui campo "timezone" para confirmação**

**🤖 AGENDAMENTOS VIA AGENTES IA (v3.5.1):**
- ✅ **NOVO CAMPO**: \`created_by_agent: true/false\` em todos os agendamentos
- ✅ **DIFERENCIAÇÃO VISUAL**: Badge distintivo no app para agendamentos criados por IA
- ✅ **INTEGRAÇÃO N8N**: Marque \`created_by_agent: true\` em automações
- ✅ **ANALYTICS**: Relatórios separados por tipo de criação (humano vs IA)

**📋 GUIA DE MIGRAÇÃO v3.4 → v3.5.0:**

\`\`\`javascript
// ❌ ANTES (v3.4)
GET /api/calendar/availability/2024-01-15
POST /api/calendar/schedule { "title": "Reunião" }

// ✅ AGORA (v3.5.1) 
// 1. Primeiro: Obter calendar_id
GET /api/calendar/integrations

// 2. Usar calendar_id nos endpoints
GET /api/calendar/availability/2024-01-15?calendar_id=UUID
POST /api/calendar/schedule { 
  "title": "Reunião",
  "start_time": "2025-07-18T09:00:00.000Z",  // ← Sempre timezone da empresa
  "end_time": "2025-07-18T10:00:00.000Z",
  "calendar_id": "UUID",  // ← OBRIGATÓRIO
  "created_by_agent": true  // ← NOVO: Para agendamentos via IA
}

// 3. Resultado: Evento criado AUTOMATICAMENTE no Google Calendar no horário correto!
\`\`\`

**🔄 BENEFÍCIOS DA ATUALIZAÇÃO:**
- ✅ **Integração Automática**: Eventos criados instantaneamente no Google Calendar
- ✅ **Múltiplas Agendas**: Uma empresa pode ter várias agendas simultâneas  
- ✅ **Tokens Automáticos**: Renovação automática sem intervenção manual
- ✅ **Google Meet**: Links gerados automaticamente para reuniões
- ✅ **Sincronização Real**: Alterações refletidas imediatamente no Google

**🎯 GUIA DE USO - PIPELINES E LEADS (v3.9.0):**

\`\`\`javascript
// 🔄 1. LISTAR PIPELINES DISPONÍVEIS
GET /api/pipelines
Headers: { "Authorization": "Bearer zio_sua_api_key" }
// Retorna: lista com pipelines da empresa, colunas e configurações

// 📌 2. CRIAR LEAD EM PIPELINE ESPECÍFICO
POST /api/leads
Headers: { "Authorization": "Bearer zio_sua_api_key" }
Body: {
  "title": "João Silva - Interessado em Automação",
  "phone": "11999999999",
  "email": "joao@exemplo.com",
  "pipeline_id": "abc123-def456-ghi789",  // ← Pipeline específico
  "column_id": "xyz789-uvw456-rst123",     // ← Coluna específica (opcional)
  "priority": "high",
  "source": "whatsapp"
}
// Resultado: Lead criado na coluna exata do pipeline desejado

// 🔄 3. MOVER LEAD ENTRE COLUNAS
POST /api/leads/lead-uuid/move
Headers: { "Authorization": "Bearer zio_sua_api_key" }
Body: {
  "column_id": "nova-coluna-uuid",
  "position": 2  // opcional - posição na coluna
}
// Resultado: Lead movido com registro de atividade automático

// 🎯 4. TRANSFERIR LEAD ENTRE PIPELINES
POST /api/leads/lead-uuid/move-to-pipeline
Headers: { "Authorization": "Bearer zio_sua_api_key" }
Body: {
  "pipeline_id": "outro-pipeline-uuid",
  "column_id": "coluna-destino-uuid"  // opcional - usa primeira coluna se não informado
}
// Resultado: Lead transferido completamente para outro pipeline

// 📊 5. OBTER ESTATÍSTICAS DE PIPELINE
GET /api/pipelines/pipeline-uuid/stats
Headers: { "Authorization": "Bearer zio_sua_api_key" }
// Retorna: total de leads, valores, estatísticas por coluna
\`\`\`

**✨ CASOS DE USO v3.9.0:**
- 🎯 **Criação Dirigida**: Criar leads diretamente no pipeline correto (vendas, suporte, etc.)
- 🔄 **Fluxo Automático**: Mover leads automaticamente conforme progresso
- 🎛️ **Multi-Pipeline**: Transferir leads entre departamentos (comercial → pós-venda)
- 📊 **Analytics**: Acompanhar performance de cada pipeline individualmente
- 🤖 **Automação N8N**: Integrar movimentações com automações externas

**📎 GUIA DE USO - ANEXOS DE LEADS (v3.6.1):**

\`\`\`javascript
// 📎 1. ANEXAR DOCUMENTO VIA BASE64
POST /api/leads/attachments/lead-uuid-aqui
Headers: { "Authorization": "Bearer zio_sua_api_key" }
Body: {
  "file_base64": "JVBERi0xLjQKJcOkw7zDtsO8w65jcm9iYXQKNSAwIG9iago...",
  "file_name": "proposta_comercial.pdf",
  "file_type": "application/pdf",
  "description": "Proposta comercial detalhada",
  "category": "proposal"
}

// 📋 2. LISTAR ANEXOS DO LEAD
GET /api/leads/attachments/lead-uuid-aqui
Headers: { "Authorization": "Bearer zio_sua_api_key" }

// 🗑️ 3. DELETAR ANEXO
DELETE /api/leads/attachments/lead-uuid/attachment-uuid
Headers: { "Authorization": "Bearer zio_sua_api_key" }

// 🎯 CATEGORIAS DISPONÍVEIS:
// - document: Documentos gerais
// - image: Imagens e fotos  
// - contract: Contratos assinados
// - proposal: Propostas comerciais
// - other: Outros tipos de arquivo

// ✅ TIPOS DE ARQUIVO SUPORTADOS:
// PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, JSON, XML
// JPG, PNG, GIF, WEBP, SVG, ZIP, RAR (máximo 50MB)
\`\`\`

**🔍 GUIA DE USO - BUSCA DE CONVERSAS POR TELEFONE (v3.8.0):**

\`\`\`javascript
// 🔍 1. BUSCAR CONVERSA POR TELEFONE NORMALIZADO
GET /api/conversation/find-by-phone/5511970507364
Headers: { "Authorization": "Bearer zio_sua_api_key" }

// 🔍 2. BUSCAR POR TELEFONE COM FORMATAÇÃO (SERÁ NORMALIZADO AUTOMATICAMENTE)
GET /api/conversation/find-by-phone/+55%2011%2097050-7364
Headers: { "Authorization": "Bearer zio_sua_api_key" }

// 📞 3. RESPOSTA COM DADOS COMPLETOS DA CONVERSA
{
  "success": true,
  "data": {
    "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
    "contact_id": "660e8400-e29b-41d4-a716-446655440001",
    "contact_name": "João Silva",
    "contact_phone": "5511970507364",
    "contact_email": "joao@exemplo.com",
    "external_id": "5511970507364@s.whatsapp.net",
    "title": "Conversa com João Silva",
    "status": "active",
    "search_params": {
      "original_phone": "+55 (11) 97050-7364",
      "normalized_phone": "5511970507364"
    },
    "method": "rpc_function"
  }
}

// 🎯 CASOS DE USO:
// - Integração com CRM: buscar conversa antes de enviar mensagens
// - Webhook de terceiros: localizar conversa correspondente
// - Automação de atendimento: identificar conversa de cliente
// - Relatórios e analytics: conectar dados de telefone com conversas

// 📱 NORMALIZAÇÃO AUTOMÁTICA:
// +55 (11) 97050-7364 → 5511970507364
// (11) 97050-7364     → 5511970507364
// 11 97050 7364       → 5511970507364
// 11970507364         → 5511970507364

// ⚠️ FORMATAÇÃO PARA URL:
// Use encodeURIComponent() para números com caracteres especiais
const phone = "+55 (11) 97050-7364";
const encodedPhone = encodeURIComponent(phone);
const url = \`/api/conversation/find-by-phone/\${encodedPhone}\`;

// 🔧 EXEMPLO JAVASCRIPT COMPLETO
async function findConversationByPhone(phone) {
  try {
    const encodedPhone = encodeURIComponent(phone);
    const response = await fetch(\`/api/conversation/find-by-phone/\${encodedPhone}\`, {
      headers: {
        'Authorization': 'Bearer zio_sua_api_key',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Conversa encontrada:', data.data.conversation_id);
      return data.data;
    } else if (response.status === 404) {
      console.log('Conversa não encontrada para:', phone);
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
  }
}

// 🚀 USANDO EM WEBHOOK N8N/ZAPIER
// Quando receber um telefone de sistema externo:
// 1. Buscar conversa existente pelo telefone
// 2. Se encontrar: usar conversation_id para enviar mensagem
// 3. Se não encontrar: criar novo contato/conversa
\`\`\`

**🧮 GUIA DE USO - CÁLCULO DE TOKENS OPENAI (v3.7.0):**

\`\`\`javascript
// 🧮 1. LISTAR MODELOS SUPORTADOS
GET /api/tokens/models
Headers: { "Authorization": "Bearer zio_sua_api_key" }

// 📊 2. CALCULAR TOKENS TOTAIS DO ASSISTENTE
POST /api/tokens/count
Headers: { "Authorization": "Bearer zio_sua_api_key" }
Body: {
  "user_message": "Qual é a capital do Brasil?",
  "assistant_message": "A capital do Brasil é Brasília, que foi inaugurada em 1960 e está localizada no Distrito Federal.",
  "prompt": "Você é um assistente útil que responde perguntas de forma clara e precisa.",
  "model": "gpt-3.5-turbo"
}

// 💰 3. RESPOSTA COM CÁLCULO COMPLETO
{
  "success": true,
  "data": {
    "input_tokens": 25,      // prompt + user_message
    "output_tokens": 32,     // assistant_message
    "total_tokens": 57,      // entrada + saída
    "model": "gpt-3.5-turbo",
    "calculation_details": {
      "breakdown": {
        "prompt": { "tokens": 15 },
        "user_message": { "tokens": 10 },
        "assistant_message": { "tokens": 32 }
      }
    },
    "cost_estimate": {
      "input_cost_usd": 0.000025,
      "output_cost_usd": 0.000064,
      "total_cost_usd": 0.000089
    }
  }
}

// 🔧 4. CALCULAR COM FUNÇÕES/TOOLS
POST /api/tokens/count
Headers: { "Authorization": "Bearer zio_sua_api_key" }
Body: {
  "messages": [
    { "role": "user", "content": "Qual o clima hoje?" }
  ],
  "functions": [
    {
      "name": "get_weather",
      "description": "Obter informações do clima",
      "parameters": {
        "type": "object",
        "properties": {
          "location": { "type": "string", "description": "Localização" }
        }
      }
    }
  ],
  "model": "gpt-4"
}

// ✅ 5. VALIDAR SE ENTRADA CABE NO MODELO
POST /api/tokens/validate
Headers: { "Authorization": "Bearer zio_sua_api_key" }
Body: {
  "text": "Texto muito longo...",
  "model": "gpt-3.5-turbo",
  "max_tokens": 1000
}

// 🔍 6. TESTAR ENCODING ESPECÍFICO
GET /api/tokens/encoding/gpt-4?text=Olá mundo
Headers: { "Authorization": "Bearer zio_sua_api_key" }

// 🎯 CASOS DE USO:
// - Estimar custos antes de chamadas à OpenAI
// - Otimizar prompts para economia de tokens
// - Validar limites antes de processar textos longos
// - Debug de problemas de tokenização
// - Comparar eficiência entre modelos

// 💰 PREÇOS APROXIMADOS (USD por 1K tokens):
// gpt-3.5-turbo: $0.001 entrada + $0.002 saída  
// gpt-4: $0.03 entrada + $0.06 saída
// gpt-4o: $0.005 entrada + $0.015 saída
// gpt-4o-mini: $0.00015 entrada + $0.0006 saída

// ⚠️ LIMITAÇÕES:
// - Calcula apenas tokens de ENTRADA
// - Tokens de saída são estimados via max_tokens
// - Tokens reais de saída só conhecidos após chamada à API
\`\`\`

### **Custom Agents - Mensagens e Agendamentos** 🤖 **ATUALIZADO na v3.5.1**
- **✨ NOVO:** Parâmetro \`sent_via_agent\` em **TODAS** as rotas de conversa
- **✨ NOVO:** Parâmetro \`created_by_agent\` em **TODOS** os agendamentos
- Marcação visual diferenciada para mensagens e agendamentos automáticos
- Badge roxo "Enviado via Custom Agent" no chat  
- Badge distintivo para agendamentos criados por IA no calendário
- Suporte completo para texto, imagem, áudio, vídeo e documento
- Integração otimizada com N8N, webhooks e sistemas externos
- Analytics separados por tipo de criação (humano vs IA)

## 🔑 **Autenticação**

Todas as rotas requerem autenticação via **Bearer Token**:

\`\`\`
Authorization: Bearer zio_sua_api_key_aqui
\`\`\`

## 🚀 **Base URL**

\`\`\`
https://api.zionic.app
\`\`\`

## **Suporte**

- **Website:** https://zionic.app
- **Email:** suporte@zionic.app
- **Documentação:** https://docs.zionic.app
      `,
      contact: {
        name: 'Zionic Support',
        url: 'https://zionic.app',
        email: 'suporte@zionic.app'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://api.zionic.app',
        description: 'Servidor de Produção'
      },
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira sua API Key no formato: zio_sua_key_aqui'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ],
        tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints para teste e validação de API Keys'
      },
      {
        name: '📞 Mensagens por Número',
        description: 'Envio direto de mensagens e mídia via número de telefone'
      },
      {
        name: '💬 Mensagens via Conversation',
        description: 'Envio de mensagens através de conversas existentes'
      },
      {
        name: '📤 Upload Direto de Arquivos',
        description: 'Upload e envio simultâneo de imagens, áudios, vídeos e documentos'
      },
      {
        name: '🎛️ Controle de Agentes (v3.1)',
        description: 'Pausar, ativar e controlar agentes em conversas'
      },
      {
        name: '🎯 Leads Management',
        description: 'Criação, atualização, movimentação e gestão completa de leads com pipelines'
      },
      {
        name: '📎 Lead Attachments',
        description: 'Upload e gestão de documentos anexados aos leads'
      },
      {
        name: '📊 Pipelines Management',
        description: 'Gestão de pipelines, colunas e estatísticas do CRM'
      },
      {
        name: '📅 Calendar Management (v3.6.0)',
        description: 'Integração com Google Calendar para agendamentos automáticos'
      },
      {
        name: '🧮 Token Calculation (v3.7.0)',
        description: 'Cálculo e análise de tokens para modelos de IA'
      }
    ]
  },
  apis: ['./index.js'] // Aponta para este arquivo
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// CSS customizado baseado no Design System do Zionic
const customCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    :root {
      /* Cores do Sistema Zionic (mesmo do Sidebar.tsx) */
      --scalar-color-primary: #3b82f6;
      --scalar-color-secondary: #8b5cf6;
      --scalar-color-accent: #06b6d4;
      --scalar-color-success: #10b981;
      --scalar-color-warning: #f59e0b;
      --scalar-color-error: #ef4444;
      
      /* Backgrounds com gradientes sutis */
      --scalar-background-1: #ffffff;
      --scalar-background-2: #f8fafc;
      --scalar-background-3: #f1f5f9;
      --scalar-background-sidebar: linear-gradient(to bottom, #ffffff, rgba(248, 250, 252, 0.5));
      --scalar-background-card: rgba(255, 255, 255, 0.95);
      
      /* Textos */
      --scalar-color-1: #1f2937;
      --scalar-color-2: #4b5563;
      --scalar-color-3: #6b7280;
      --scalar-color-4: #9ca3af;
      
      /* Bordas com transparência */
      --scalar-border-color: rgba(229, 231, 235, 0.6);
      --scalar-border-color-strong: rgba(209, 213, 219, 0.8);
      
      /* Sombras modernas */
      --scalar-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --scalar-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --scalar-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --scalar-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      
      /* Raios de borda */
      --scalar-radius: 0.5rem;
      --scalar-radius-lg: 0.75rem;
      --scalar-radius-xl: 1rem;
    }
    
    /* Dark mode colors */
    [data-theme="dark"] {
      --scalar-background-1: #111827;
      --scalar-background-2: #1f2937;
      --scalar-background-3: #374151;
      --scalar-background-sidebar: linear-gradient(to bottom, #111827, rgba(31, 41, 55, 0.8));
      --scalar-background-card: rgba(31, 41, 55, 0.95);
      
      --scalar-color-1: #f9fafb;
      --scalar-color-2: #e5e7eb;
      --scalar-color-3: #d1d5db;
      --scalar-color-4: #9ca3af;
      
      --scalar-border-color: rgba(75, 85, 99, 0.5);
      --scalar-border-color-strong: rgba(107, 114, 128, 0.6);
    }
    
    /* Global styles */
    .scalar-app {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--scalar-background-1);
      color: var(--scalar-color-1);
      line-height: 1.6;
    }
    
    /* Logo Zionic oficial */
    .zionic-logo {
      width: 32px;
      height: 32px;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .zionic-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    
    /* Header com logo personalizado - Design melhorado */
    .scalar-api-reference__header {
      background: linear-gradient(135deg, #ffffff, #f8fafc);
      border-bottom: 1px solid var(--scalar-border-color);
      backdrop-filter: blur(20px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      padding: 2rem 2.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .scalar-api-reference__header .scalar-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
      font-size: 1.25rem;
      background: linear-gradient(135deg, var(--scalar-color-1), var(--scalar-color-primary));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    /* Esconder powered by scalar */
    [class*="powered-by"], 
    [class*="scalar-footer"],
    .scalar-api-reference__footer,
    a[href*="scalar.com"] {
      display: none !important;
    }
    
         /* Design melhorado - Mais clean e espaçado */
     .scalar-api-reference__content {
       background: #fafbfc;
       padding: 3rem 2.5rem;
       min-height: 100vh;
     }
     
     .scalar-operation {
       margin-bottom: 4rem;
       background: #ffffff;
       border: 1px solid rgba(230, 232, 236, 0.8);
       border-radius: 16px;
       box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
       backdrop-filter: blur(20px);
       overflow: hidden;
       transition: all 0.3s ease;
     }
     
     .scalar-operation:hover {
       transform: translateY(-2px);
       box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
     }
     
     .scalar-operation__header {
       padding: 2rem 2.5rem;
       border-bottom: 1px solid rgba(230, 232, 236, 0.6);
       background: linear-gradient(135deg, #ffffff, #f9fafb);
     }
     
     .scalar-operation__content {
       padding: 2.5rem;
     }
    
         /* Sidebar - Design clean e organizado */
     .scalar-api-reference__sidebar {
       background: linear-gradient(180deg, #ffffff, #fcfcfd);
       border-right: 1px solid rgba(230, 232, 236, 0.8);
       box-shadow: 4px 0 24px rgba(0, 0, 0, 0.06);
       backdrop-filter: blur(20px);
       padding: 2rem 1.5rem;
       width: 340px;
       min-width: 340px;
     }
     
     /* Tags de grupo com melhor visual */
     .scalar-sidebar-group {
       margin-bottom: 2.5rem;
     }
     
     .scalar-sidebar-group-title {
       font-size: 0.8rem;
       font-weight: 700;
       color: #64748b;
       text-transform: uppercase;
       letter-spacing: 0.08em;
       margin-bottom: 1rem;
       padding: 0.5rem 1rem;
       background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
       border-radius: 8px;
       border-left: 3px solid var(--scalar-color-primary);
     }
    
    /* Cards e containers */
    .scalar-api-reference__content {
      background: var(--scalar-background-2);
    }
    
    .scalar-card {
      background: var(--scalar-background-card);
      border: 1px solid var(--scalar-border-color);
      border-radius: var(--scalar-radius-lg);
      box-shadow: var(--scalar-shadow-md);
      backdrop-filter: blur(16px);
      transition: all 0.3s ease;
    }
    
    .scalar-card:hover {
      box-shadow: var(--scalar-shadow-lg);
      transform: translateY(-1px);
    }
    
    /* Botões com gradientes (igual ao app) */
    .scalar-button-primary,
    button[data-test-id="send-request"] {
      background: linear-gradient(135deg, var(--scalar-color-primary), var(--scalar-color-secondary));
      color: white;
      border: none;
      border-radius: var(--scalar-radius);
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.25);
      transition: all 0.3s ease;
    }
    
    .scalar-button-primary:hover,
    button[data-test-id="send-request"]:hover {
      box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.35);
      transform: translateY(-1px);
    }
    
    /* Tags de método HTTP com cores do sistema */
    .scalar-tag--get { 
      background: linear-gradient(135deg, var(--scalar-color-success), #059669);
      color: white;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
    }
    
    .scalar-tag--post { 
      background: linear-gradient(135deg, var(--scalar-color-primary), #2563eb);
      color: white;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
    }
    
    .scalar-tag--put { 
      background: linear-gradient(135deg, var(--scalar-color-warning), #d97706);
      color: white;
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
    }
    
    .scalar-tag--delete { 
      background: linear-gradient(135deg, var(--scalar-color-error), #dc2626);
      color: white;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
    }
    
    /* Headers com gradientes de texto */
    h1, h2, h3, h4, h5, h6 {
      background: linear-gradient(135deg, var(--scalar-color-1), var(--scalar-color-2));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
    }
    
    /* Inputs e forms */
    input, textarea, select {
      background: var(--scalar-background-card);
      border: 1px solid var(--scalar-border-color);
      border-radius: var(--scalar-radius);
      padding: 0.75rem;
      font-size: 0.875rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(8px);
    }
    
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--scalar-color-primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    /* Code blocks */
    pre, code {
      background: var(--scalar-background-3);
      border: 1px solid var(--scalar-border-color);
      border-radius: var(--scalar-radius);
      font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', monospace;
    }
    
    /* Scrollbars customizados */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: var(--scalar-background-2);
      border-radius: var(--scalar-radius);
    }
    
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, var(--scalar-color-primary), var(--scalar-color-secondary));
      border-radius: var(--scalar-radius);
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #2563eb, #7c3aed);
    }
    
    /* Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .scalar-card {
      animation: fadeInUp 0.5s ease-out;
    }
    
    /* Logo area styling */
    .scalar-api-reference__header .scalar-logo {
      font-weight: 700;
      font-size: 1.125rem;
      background: linear-gradient(135deg, var(--scalar-color-1), var(--scalar-color-primary));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    /* Status badges */
    .scalar-status-badge {
      border-radius: var(--scalar-radius);
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    /* Response section */
    .scalar-response {
      background: var(--scalar-background-card);
      border: 1px solid var(--scalar-border-color);
      border-radius: var(--scalar-radius-lg);
      backdrop-filter: blur(16px);
    }
    
    /* Navigation improvements - Clean design */
    .scalar-sidebar-item {
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      margin: 0.25rem 0;
      padding: 0.75rem 1rem !important;
      font-weight: 500;
      border: 1px solid transparent;
    }
    
    .scalar-sidebar-item:hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.05));
      transform: translateX(6px);
      border-color: rgba(59, 130, 246, 0.2);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    }
    
    .scalar-sidebar-item.active {
      background: linear-gradient(135deg, var(--scalar-color-primary), var(--scalar-color-secondary));
      color: white;
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
      transform: translateX(4px);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    /* Melhor tipografia */
    h1, h2, h3, h4, h5, h6 {
      background: linear-gradient(135deg, #1f2937, #3b82f6);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    
    /* Badge de métodos HTTP mais elegantes */
    .scalar-tag {
      font-weight: 700;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      border-radius: 6px;
      padding: 0.375rem 0.75rem;
      text-transform: uppercase;
    }
    
    /* Destacar endpoint send-image-base64 */
    [data-testid*="send-image-base64"], 
    [href*="send-image-base64"],
    .scalar-sidebar-item:has-text("send-image-base64") {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.1)) !important;
      border-left: 4px solid #8b5cf6 !important;
      font-weight: 700 !important;
    }
    
    /* Badge especial para novos endpoints */
    .scalar-operation:has([data-testid*="send-image-base64"])::before {
      content: "✨ NOVO";
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #8b5cf6, #06b6d4);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.6rem;
      font-weight: 700;
      z-index: 10;
    }
  `;

// Rota principal para documentação com Scalar
app.get('/', (req, res) => {
  const html = generateScalarHTML();
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Rota para a documentação explícita
app.get('/docs', (req, res) => {
  const html = generateScalarHTML();
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Função para gerar HTML do Scalar via CDN (mais confiável)
function generateScalarHTML() {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zionic API - WhatsApp Business Documentation</title>
  <meta name="description" content="Documentação interativa da API Zionic para automação de WhatsApp Business">
  <meta property="og:title" content="Zionic API Documentation">
  <meta property="og:description" content="API robusta para integração completa com WhatsApp Business">
  <meta property="og:image" content="https://zionic.app/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Scalar CSS -->
  <style>
    ${customCSS}
  </style>
</head>
<body>
  <script 
    id="api-reference" 
    type="application/json"
    data-url="/api-spec.json?v=3.8.1"
    data-configuration='${JSON.stringify({
      theme: 'none',
      showSidebar: true,
      hideDownloadButton: false,
      hideTestRequestButton: false,
      searchHotKey: 'k',
      layout: 'modern'
    })}'
  ></script>
  
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest"></script>
  
  <script>
    // Configurações extras após carregamento
    document.addEventListener('DOMContentLoaded', function() {
      console.log('⚡ Zionic API Documentation carregada!');
      console.log('🎨 Design System: Zionic + Scalar');
      console.log('📊 Endpoints: 44 endpoints documentados');
      console.log('🌐 Base URL: https://api.zionic.app');
      
      // Adicionar logo personalizado após carregamento
      setTimeout(() => {
        const header = document.querySelector('.scalar-api-reference__header');
        if (header) {
          const logoContainer = document.createElement('div');
          logoContainer.className = 'scalar-logo';
          logoContainer.innerHTML = \`
            <div class="zionic-logo">
              <img src="https://anonimouz.com/wp-content/uploads/2025/06/4.png" alt="Zionic Logo" />
            </div>
            <span>ZIONIC API</span>
          \`;
          
          // Substituir logo existente
          const existingLogo = header.querySelector('.scalar-logo');
          if (existingLogo) {
            existingLogo.replaceWith(logoContainer);
          } else {
            header.appendChild(logoContainer);
          }
        }
      }, 500);
    });
  </script>
</body>
</html>`;
}

// Rotas para spec em diferentes formatos
app.get('/api-spec.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

app.get('/api-spec.yaml', (req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  res.send(yaml.dump(swaggerSpec));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Zionic API Documentation',
    version: '3.8.1',
    timestamp: new Date().toISOString(),
    ui: 'Scalar API Reference',
    endpoints: 44,
    baseUrl: 'https://api.zionic.app',
    new_features: [
      '🆕 v3.8.1: Parâmetro openai_thread_id em endpoints de mensagens - Anexa threads OpenAI às conversas',
      '🎯 v3.9.1: Vinculação inteligente de leads em agendamentos via contact_phone/email',
      '🎯 v3.9.1: POST /api/calendar/schedule - Busca automática de leads por telefone/email',
      '🎯 v3.9.1: Notificações automáticas quando leads são vinculados automaticamente',
      '🎯 v3.9.1: Informações detalhadas sobre processo de vinculação na resposta',
      '🆕 v3.8.0: GET /api/conversation/find-by-phone/:phone - Busca conversa por telefone normalizado',
      '🆕 v3.7.0: Sistema completo de cálculo de tokens OpenAI usando Tiktoken',
      '🆕 v3.7.0: GET /api/tokens/models - Lista modelos suportados com limitações',
      '🆕 v3.7.0: POST /api/tokens/count - Calcula tokens de entrada (texto/chat/funções)',
      '🆕 v3.7.0: POST /api/tokens/validate - Valida se entrada cabe no modelo',
      '🆕 v3.7.0: GET /api/tokens/encoding/:model - Testa encoding específico',
      '🆕 v3.7.0: Estimativas de custo em USD baseadas nos preços da OpenAI',
      '🆕 v3.6.1: Sistema completo de anexos para leads (upload base64, preview, categorização)',
      '🆕 v3.6.0: Formato ISO 8601 unificado para endpoints de calendar',
      '🆕 v3.5.0: Integração automática com Google Calendar em tempo real',
      '🆕 v3.4.4: POST /api/conversation/send-image-base64 - Envio de imagem via base64'
    ]
  });
});

/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     summary: Testar API Key
 *     description: Verifica se a API Key fornecida é válida e retorna informações sobre a empresa e chave
 *     tags:
 *       - Autenticação
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: API Key válida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Autenticação bem-sucedida!"
 *                 company:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID da empresa
 *                     name:
 *                       type: string
 *                       description: Nome da empresa
 *                 apiKey:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Nome da API Key
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Data de criação
 *                     last_used_at:
 *                       type: string
 *                       format: date-time
 *                       description: Último uso
 *       401:
 *         description: API Key inválida ou inativa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "API Key inválida ou inativa"
 *                 message:
 *                   type: string
 *                   example: "Verifique se a API Key está correta e ativa"
 */

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Enviar Mensagem de Texto por Número
 *     description: |
 *       Envia uma mensagem de texto diretamente para um número de telefone, criando automaticamente contato e conversa se necessário.
 *       
 *       **✨ NOVO na v3.8.1:** Parâmetro `openai_thread_id` para anexar threads OpenAI às conversas.
 *       
 *       **Funcionalidades:**
 *       - Criação automática de contato e conversa
 *       - Suporte a múltiplas instâncias WhatsApp
 *       - **Novo:** Anexação automática de thread OpenAI à conversa
 *       - Salva automaticamente no histórico da conversa
 *       - Integração com sistema de notificações
 *       
 *       **Thread OpenAI:**
 *       Quando fornecido, o `openai_thread_id` é salvo no campo `openai_thread_id` da conversa criada,
 *       permitindo que agentes IA mantenham contexto e histórico nas futuras interações.
 *     tags:
 *       - 📞 Mensagens por Número
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - message
 *             properties:
 *               number:
 *                 type: string
 *                 description: Número de telefone do destinatário (formato internacional)
 *                 example: "5511999999999"
 *                 pattern: "^[0-9]{10,15}$"
 *               message:
 *                 type: string
 *                 description: Texto da mensagem a ser enviada
 *                 example: "Olá! Como posso ajudá-lo hoje?"
 *                 maxLength: 4096
 *               instance_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID específico da instância WhatsApp (opcional)
 *                 example: "uuid-da-instancia"
 *               instance_name:
 *                 type: string
 *                 description: Nome específico da instância WhatsApp (opcional)
 *                 example: "vendas-sp"
 *               openai_thread_id:
 *                 type: string
 *                 description: ID da thread OpenAI para anexar à conversa (opcional)
 *                 example: "thread_abc123def456"
 *                 pattern: "^thread_[a-zA-Z0-9]+$"
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Mensagem enviada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     messageId:
 *                       type: string
 *                       description: ID da mensagem no banco de dados
 *                     conversationId:
 *                       type: string
 *                       description: ID da conversa
 *                     contactId:
 *                       type: string
 *                       description: ID do contato
 *                     instanceName:
 *                       type: string
 *                       description: Nome da instância WhatsApp
 *                     evolutionId:
 *                       type: string
 *                       description: ID da mensagem no WhatsApp
 *                     isNewContact:
 *                       type: boolean
 *                       description: Se é um novo contato criado
 *                     isNewConversation:
 *                       type: boolean
 *                       description: Se é uma nova conversa criada
 *                     openaiThreadId:
 *                       type: string
 *                       description: ID da thread OpenAI anexada à conversa
 *                       nullable: true
 *                     number:
 *                       type: string
 *                       description: Número limpo usado
 *                     content:
 *                       type: string
 *                       description: Conteúdo da mensagem enviada
 *                     sentAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp do envio
 *       400:
 *         description: Número inválido ou parâmetros incorretos
 *       404:
 *         description: Instância WhatsApp não encontrada ou desconectada
 */

/**
 * @swagger
 * /api/messages/send-media:
 *   post:
 *     summary: Enviar Mídia por Número
 *     description: |
 *       Envia um arquivo de mídia (imagem, vídeo, áudio ou documento) para um número de telefone.
 *       
 *       **✨ NOVO na v3.8.1:** Parâmetro `openai_thread_id` para anexar threads OpenAI às conversas.
 *       
 *       **Funcionalidades:**
 *       - Upload direto de arquivos via FormData
 *       - Suporte a diversos tipos de mídia
 *       - **Novo:** Anexação automática de thread OpenAI à conversa
 *       - Criação automática de contato e conversa se necessário
 *     tags:
 *       - 📞 Mensagens por Número
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - file
 *             properties:
 *               number:
 *                 type: string
 *                 description: Número de telefone do destinatário
 *                 example: "5511999999999"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de mídia para envio
 *               caption:
 *                 type: string
 *                 description: Legenda do arquivo (opcional)
 *                 example: "Arquivo importante!"
 *               instance_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID específico da instância WhatsApp (opcional)
 *               instance_name:
 *                 type: string
 *                 description: Nome específico da instância WhatsApp (opcional)
 *                 example: "vendas-sp"
 *               openai_thread_id:
 *                 type: string
 *                 description: ID da thread OpenAI para anexar à conversa (opcional)
 *                 example: "thread_abc123def456"
 *                 pattern: "^thread_[a-zA-Z0-9]+$"
 *     responses:
 *       200:
 *         description: Mídia enviada com sucesso
 *       400:
 *         description: Arquivo ou parâmetros inválidos
 *       404:
 *         description: Instância WhatsApp não encontrada
 */

/**
 * @swagger
 * /api/messages/reply:
 *   post:
 *     summary: Responder Mensagem Específica
 *     description: |
 *       Responde uma mensagem específica citando-a (reply/quote), criando uma resposta linkada à mensagem original.
 *       
 *       **✨ NOVO na v3.8.1:** Parâmetro `openai_thread_id` para anexar threads OpenAI às conversas.
 *       
 *       **Funcionalidades:**
 *       - Citação automática da mensagem original
 *       - Resposta linkada visualmente no WhatsApp
 *       - **Novo:** Anexação automática de thread OpenAI à conversa
 *       - Usar instância da conversa original ou especificar nova
 *     tags:
 *       - 📞 Mensagens por Número
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - message
 *               - quotedMessageId
 *             properties:
 *               number:
 *                 type: string
 *                 description: Número de telefone do destinatário
 *                 example: "5511999999999"
 *               message:
 *                 type: string
 *                 description: Texto da resposta
 *                 example: "Obrigado pela sua mensagem!"
 *               quotedMessageId:
 *                 type: string
 *                 description: ID da mensagem original que está sendo respondida
 *                 example: "uuid-da-mensagem-original"
 *               instance_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID específico da instância WhatsApp (opcional)
 *               instance_name:
 *                 type: string
 *                 description: Nome específico da instância WhatsApp (opcional)
 *                 example: "vendas-sp"
 *               openai_thread_id:
 *                 type: string
 *                 description: ID da thread OpenAI para anexar à conversa (opcional)
 *                 example: "thread_abc123def456"
 *                 pattern: "^thread_[a-zA-Z0-9]+$"
 *     responses:
 *       200:
 *         description: Resposta enviada com sucesso
 *       400:
 *         description: Parâmetros inválidos ou mensagem original não encontrada
 *       404:
 *         description: Instância WhatsApp ou mensagem original não encontrada
 */

/**
 * @swagger
 * /api/conversation/find-by-phone/{phone}:
 *   get:
 *     summary: 🔍 Buscar Conversa por Telefone
 *     description: |
 *       **✨ NOVO na v3.8.0** - Busca uma conversa existente usando o número de telefone do contato.
 *       
 *       **Funcionalidades:**
 *       - Normalização automática do número de telefone
 *       - Busca inteligente usando função RPC do banco de dados
 *       - Fallback para busca JavaScript se RPC falhar
 *       - Retorna dados completos da conversa e contato
 *       - Suporte a múltiplos formatos de telefone
 *       
 *       **Normalização Automática:**
 *       - Remove caracteres especiais: `+`, `-`, `(`, `)`, espaços
 *       - Mantém apenas dígitos numéricos
 *       - Exemplos de conversão:
 *         - `+55 (11) 97050-7364` → `5511970507364`
 *         - `(11) 97050-7364` → `5511970507364`
 *         - `11 97050 7364` → `5511970507364`
 *       
 *       **Casos de Uso:**
 *       - Integração com CRM: buscar conversa antes de enviar mensagens
 *       - Webhooks de terceiros: localizar conversa correspondente
 *       - Automação de atendimento: identificar conversa de cliente
 *       - Relatórios e analytics: conectar dados de telefone com conversas
 *       
 *       **⚠️ Importante para URL:**
 *       Para números com caracteres especiais, use `encodeURIComponent()`:
 *       ```javascript
 *       const phone = "+55 (11) 97050-7364";
 *       const encodedPhone = encodeURIComponent(phone);
 *       const url = `/api/conversation/find-by-phone/${encodedPhone}`;
 *       ```
 *     tags:
 *       - 💬 Mensagens via Conversation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           Número de telefone para busca (qualquer formato será normalizado automaticamente).
 *           
 *           **Formatos aceitos:**
 *           - `5511970507364` (normalizado)
 *           - `+55 11 97050-7364` (brasileiro)
 *           - `(11) 97050-7364` (com parênteses)
 *           - `11 97050 7364` (com espaços)
 *           
 *           **Para caracteres especiais na URL, use encodeURIComponent()!**
 *         examples:
 *           normalized:
 *             summary: Número Normalizado
 *             value: "5511970507364"
 *           brazilian_formatted:
 *             summary: Formato Brasileiro (codificado)
 *             value: "%2B55%20(11)%2097050-7364"
 *           simple_formatted:
 *             summary: Formato com Parênteses (codificado)
 *             value: "(11)%2097050-7364"
 *     responses:
 *       200:
 *         description: Conversa encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     conversation_id:
 *                       type: string
 *                       format: uuid
 *                       description: ID único da conversa encontrada
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     contact_id:
 *                       type: string
 *                       format: uuid
 *                       description: ID do contato associado
 *                       example: "660e8400-e29b-41d4-a716-446655440001"
 *                     contact_name:
 *                       type: string
 *                       description: Nome completo do contato
 *                       example: "João Silva"
 *                       nullable: true
 *                     contact_phone:
 *                       type: string
 *                       description: Telefone normalizado do contato
 *                       example: "5511970507364"
 *                     contact_email:
 *                       type: string
 *                       description: Email do contato
 *                       example: "joao@exemplo.com"
 *                       nullable: true
 *                     external_id:
 *                       type: string
 *                       description: ID externo da conversa (formato WhatsApp)
 *                       example: "5511970507364@s.whatsapp.net"
 *                     title:
 *                       type: string
 *                       description: Título da conversa
 *                       example: "Conversa com João Silva"
 *                     status:
 *                       type: string
 *                       description: Status da conversa
 *                       example: "active"
 *                       enum: [active, archived, closed]
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Data de criação da conversa
 *                       example: "2024-01-15T10:30:00.000Z"
 *                     search_params:
 *                       type: object
 *                       description: Parâmetros utilizados na busca para debug
 *                       properties:
 *                         original_phone:
 *                           type: string
 *                           description: Telefone original informado
 *                           example: "+55 (11) 97050-7364"
 *                         normalized_phone:
 *                           type: string
 *                           description: Telefone após normalização
 *                           example: "5511970507364"
 *                     method:
 *                       type: string
 *                       description: Método usado para encontrar a conversa
 *                       example: "rpc_function"
 *                       enum: [rpc_function, javascript_fallback]
 *             examples:
 *               found_conversation:
 *                 summary: Conversa Encontrada
 *                 value:
 *                   success: true
 *                   data:
 *                     conversation_id: "550e8400-e29b-41d4-a716-446655440000"
 *                     contact_id: "660e8400-e29b-41d4-a716-446655440001"
 *                     contact_name: "João Silva"
 *                     contact_phone: "5511970507364"
 *                     contact_email: "joao@exemplo.com"
 *                     external_id: "5511970507364@s.whatsapp.net"
 *                     title: "Conversa com João Silva"
 *                     status: "active"
 *                     created_at: "2024-01-15T10:30:00.000Z"
 *                     search_params:
 *                       original_phone: "+55 (11) 97050-7364"
 *                       normalized_phone: "5511970507364"
 *                     method: "rpc_function"
 *               found_with_fallback:
 *                 summary: Encontrada via Fallback
 *                 value:
 *                   success: true
 *                   data:
 *                     conversation_id: "770e8400-e29b-41d4-a716-446655440002"
 *                     contact_id: "880e8400-e29b-41d4-a716-446655440003"
 *                     contact_name: "Maria Santos"
 *                     contact_phone: "5521987654321"
 *                     contact_email: null
 *                     external_id: "5521987654321@s.whatsapp.net"
 *                     title: "WhatsApp Conversation"
 *                     status: "active"
 *                     created_at: "2024-01-10T14:20:00.000Z"
 *                     search_params:
 *                       original_phone: "21987654321"
 *                       normalized_phone: "5521987654321"
 *                     method: "javascript_fallback"
 *       400:
 *         description: Número de telefone inválido ou vazio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Número de telefone é obrigatório"
 *                 message:
 *                   type: string
 *                   example: "Forneça um número de telefone válido no parâmetro"
 *             examples:
 *               empty_phone:
 *                 summary: Telefone Vazio
 *                 value:
 *                   success: false
 *                   error: "Número de telefone é obrigatório"
 *                   message: "Forneça um número de telefone válido no parâmetro"
 *               invalid_phone:
 *                 summary: Telefone Inválido
 *                 value:
 *                   success: false
 *                   error: "Número de telefone inválido"
 *                   message: "O número deve conter apenas dígitos após normalização"
 *       404:
 *         description: Conversa não encontrada para o telefone informado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Conversa não encontrada"
 *                 message:
 *                   type: string
 *                   example: "Nenhuma conversa ativa encontrada para o número 11970507364 (normalizado: 5511970507364)"
 *                 search_info:
 *                   type: object
 *                   properties:
 *                     original_phone:
 *                       type: string
 *                       example: "11970507364"
 *                     normalized_phone:
 *                       type: string
 *                       example: "5511970507364"
 *                     method_attempted:
 *                       type: string
 *                       example: "rpc_function"
 *             examples:
 *               not_found:
 *                 summary: Conversa Não Encontrada
 *                 value:
 *                   success: false
 *                   error: "Conversa não encontrada"
 *                   message: "Nenhuma conversa ativa encontrada para o número 11970507364 (normalizado: 5511970507364)"
 *                   search_info:
 *                     original_phone: "11970507364"
 *                     normalized_phone: "5511970507364"
 *                     method_attempted: "rpc_function"
 *       401:
 *         description: Token de autenticação inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token de acesso obrigatório"
 *                 message:
 *                   type: string
 *                   example: "Inclua o header: Authorization: Bearer YOUR_API_KEY"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor"
 *                 details:
 *                   type: string
 *                   example: "Database connection failed"

/**
 * @swagger
 * /api/conversation/send-text:
 *   post:
 *     summary: Enviar Texto via Conversa
 *     description: |
 *       Envia uma mensagem de texto para uma conversa existente usando conversation_id.
 *       
 *       **✨ NOVO na v3.4:** Parâmetro `sent_via_agent` para marcar mensagens enviadas via custom agents.
 *       
 *       **Funcionalidades:**
 *       - Envio direto para conversas existentes
 *       - Controle de delay personalizado
 *       - **Novo:** Marcação visual para mensagens de custom agents
 *       - Salva automaticamente no histórico da conversa
 *       - Integração com sistema de notificações
 *       
 *       **Visual Diferenciado para Custom Agents:**
 *       Mensagens marcadas com `sent_via_agent: true` aparecem no chat com:
 *       - Badge roxo "Enviado via Custom Agent"
 *       - Ícone especial MessageSquare
 *       - Background diferenciado
 *       - Timestamp roxo
 *     tags:
 *       - 💬 Mensagens via Conversation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - message
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID único da conversa
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               message:
 *                 type: string
 *                 description: Texto da mensagem a ser enviada
 *                 example: "Olá! Como posso ajudá-lo hoje?"
 *                 maxLength: 4096
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1000
 *                 minimum: 0
 *                 maximum: 30000
 *               sent_via_agent:
 *                 type: boolean
 *                 description: |
 *                   **✨ NOVO na v3.4** - Marca a mensagem como enviada via custom agent.
 *                   
 *                   Quando `true`, a mensagem aparece no chat com visual diferenciado:
 *                   - Badge roxo "Enviado via Custom Agent"
 *                   - Ícone MessageSquare especial
 *                   - Background roxo claro/escuro conforme tema
 *                   - Timestamp em cor roxa
 *                   
 *                   **Casos de uso:**
 *                   - Webhooks N8N que enviam mensagens
 *                   - Automações via API externa
 *                   - Integrações custom de terceiros
 *                   - Bots personalizados da empresa
 *                 example: false
 *                 default: false
 *           examples:
 *             basic_message:
 *               summary: Mensagem Normal
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 message: "Olá! Como posso ajudá-lo hoje?"
 *                 delay: 1000
 *                 sent_via_agent: false
 *             custom_agent_message:
 *               summary: Mensagem via Custom Agent
 *               description: Mensagem enviada por webhook/automação que será destacada no chat
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 message: "Esta mensagem foi processada pelo meu sistema personalizado!"
 *                 delay: 1500
 *                 sent_via_agent: true
 *             n8n_webhook:
 *               summary: Webhook N8N
 *               description: Exemplo de mensagem enviada via webhook N8N
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 message: "Olá! Processamos sua solicitação e já temos uma resposta personalizada para você."
 *                 sent_via_agent: true
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Mensagem enviada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message_id:
 *                       type: string
 *                       format: uuid
 *                       description: ID da mensagem salva no banco
 *                     conversation_id:
 *                       type: string
 *                       format: uuid
 *                       description: ID da conversa
 *                     content:
 *                       type: string
 *                       description: Conteúdo da mensagem enviada
 *                     sent_via_agent:
 *                       type: boolean
 *                       description: Se foi marcada como enviada via custom agent
 *                     visual_indicator:
 *                       type: string
 *                       description: Tipo de indicador visual no chat
 *                       example: "custom_agent_badge"
 *                     whatsapp_id:
 *                       type: string
 *                       description: ID da mensagem no WhatsApp
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp do envio
 *             examples:
 *               normal_message:
 *                 summary: Mensagem Normal Enviada
 *                 value:
 *                   success: true
 *                   message: "Mensagem enviada com sucesso"
 *                   data:
 *                     message_id: "550e8400-e29b-41d4-a716-446655440000"
 *                     conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     content: "Olá! Como posso ajudá-lo hoje?"
 *                     sent_via_agent: false
 *                     visual_indicator: "none"
 *                     whatsapp_id: "3EB0C9CB8A3A4E7F9D2A"
 *                     timestamp: "2024-01-15T10:30:00.000Z"
 *               custom_agent_message:
 *                 summary: Custom Agent Message Enviada
 *                 value:
 *                   success: true
 *                   message: "Mensagem via custom agent enviada com sucesso"
 *                   data:
 *                     message_id: "660f9500-f3ac-51e5-b827-557766551111"
 *                     conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     content: "Esta mensagem foi processada pelo meu sistema personalizado!"
 *                     sent_via_agent: true
 *                     visual_indicator: "custom_agent_badge"
 *                     whatsapp_id: "4FC1D2DC9B4B5F8A0E3B"
 *                     timestamp: "2024-01-15T10:32:00.000Z"
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Parâmetros obrigatórios: conversation_id, message"
 *                 example:
 *                   type: object
 *                   properties:
 *                     conversation_id:
 *                       type: string
 *                       example: "uuid-da-conversa"
 *                     message:
 *                       type: string
 *                       example: "Sua mensagem aqui"
 *                     delay:
 *                       type: integer
 *                       example: 1000
 *                     sent_via_agent:
 *                       type: boolean
 *                       example: false
 *       404:
 *         description: Conversa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Conversa não encontrada"
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/conversation/send-image:
 *   post:
 *     summary: 📸 Enviar Imagem via URL
 *     description: |
 *       Envia uma imagem através de URL pública para uma conversa.
 *       
 *       **✨ NOVO na v3.4.2:** Parâmetro `sent_via_agent` para marcar mensagens enviadas via custom agents.
 *       
 *       **Funcionalidades:**
 *       - Envio direto via URL pública
 *       - Suporte a JPG, PNG, GIF, WebP
 *       - Caption opcional para a imagem
 *       - Controle de delay personalizado
 *       - **Novo:** Marcação visual para mensagens de custom agents
 *       - Salva automaticamente no histórico da conversa
 *     tags:
 *       - 💬 Mensagens via Conversation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - image_url
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID único da conversa
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               image_url:
 *                 type: string
 *                 format: uri
 *                 description: URL pública da imagem
 *                 example: "https://exemplo.com/imagem.jpg"
 *               caption:
 *                 type: string
 *                 description: Legenda da imagem (opcional)
 *                 example: "Imagem importante!"
 *                 maxLength: 1000
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1200
 *                 minimum: 0
 *                 maximum: 30000
 *                 default: 1200
 *               sent_via_agent:
 *                 type: boolean
 *                 description: |
 *                   **✨ NOVO na v3.4.2** - Marca a imagem como enviada via custom agent.
 *                   
 *                   Quando `true`, aparece com visual diferenciado no chat:
 *                   - Badge roxo "Enviado via Custom Agent"
 *                   - Ícone especial para mídia
 *                   - Background diferenciado
 *                   
 *                   **Casos de uso:**
 *                   - Webhooks N8N que enviam imagens
 *                   - Automações via API externa
 *                   - Integrações custom de terceiros
 *                 example: false
 *                 default: false
 *           examples:
 *             basic_image:
 *               summary: Imagem Normal
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 image_url: "https://exemplo.com/imagem.jpg"
 *                 caption: "Imagem importante!"
 *                 delay: 1200
 *                 sent_via_agent: false
 *             custom_agent_image:
 *               summary: Imagem via Custom Agent
 *               description: Imagem enviada por webhook/automação
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 image_url: "https://sistema.empresa.com/relatorio.jpg"
 *                 caption: "Relatório gerado automaticamente pelo sistema"
 *                 sent_via_agent: true
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Imagem enviada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     messageId:
 *                       type: string
 *                       format: uuid
 *                     conversationId:
 *                       type: string
 *                       format: uuid
 *                     contactName:
 *                       type: string
 *                     instanceName:
 *                       type: string
 *                     evolutionId:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *                     caption:
 *                       type: string
 *                       nullable: true
 *                     sentAt:
 *                       type: string
 *                       format: date-time
 *                     type:
 *                       type: string
 *                       example: "image"
 *                     sentViaAgent:
 *                       type: boolean
 *                       description: Se foi marcada como enviada via custom agent
 *       400:
 *         description: Parâmetros inválidos
 *       404:
 *         description: Conversa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/conversation/send-image-base64:
 *   post:
 *     summary: 📸 Enviar Imagem via Base64
 *     description: |
 *       **✨ NOVO na v3.4.4** - Envia uma imagem através de string base64 diretamente para uma conversa.
 *       
 *       **Funcionalidades:**
 *       - Envio direto sem necessidade de URL pública
 *       - Suporte a todos os formatos de imagem (JPG, PNG, GIF, WebP)
 *       - Conversão automática para formato WhatsApp
 *       - Validação de tamanho e formato
 *       - Caption opcional para a imagem
 *       - Controle de delay personalizado
 *       - Marcação para custom agents
 *       
 *       **Vantagens:**
 *       - Não precisa hospedar arquivo em servidor
 *       - Envio imediato sem upload
 *       - Segurança: dados não passam por URLs públicas
 *       - Ideal para integrações N8N e webhooks
 *       
 *       **Limitações:**
 *       - Tamanho máximo: 5MB (base64)
 *       - Formatos aceitos: JPG, PNG, GIF, WebP
 *       - Base64 deve incluir o prefixo data: (data:image/jpeg;base64,...)
 *     tags:
 *       - 💬 Mensagens via Conversation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - image_base64
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID único da conversa
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               image_base64:
 *                 type: string
 *                 description: |
 *                   String base64 da imagem com prefixo data:.
 *                   
 *                   **Formato obrigatório:**
 *                   - Deve incluir o prefixo: `data:image/jpeg;base64,` ou similar
 *                   - Formatos aceitos: jpeg, jpg, png, gif, webp
 *                   - Tamanho máximo: 5MB
 *                 example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
 *                 pattern: "^data:image\\/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/]+=*$"
 *               caption:
 *                 type: string
 *                 description: Legenda opcional da imagem
 *                 example: "Imagem enviada via API"
 *                 maxLength: 1000
 *               filename:
 *                 type: string
 *                 description: Nome do arquivo (opcional, padrão: image.jpg)
 *                 example: "minha-imagem.jpg"
 *                 default: "image.jpg"
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1200
 *                 minimum: 0
 *                 maximum: 30000
 *                 default: 1200
 *               sent_via_agent:
 *                 type: boolean
 *                 description: |
 *                   **✨ NOVO na v3.4** - Marca a imagem como enviada via custom agent.
 *                   
 *                   Quando `true`, aparece com visual diferenciado no chat:
 *                   - Badge roxo "Enviado via Custom Agent"
 *                   - Ícone especial para mídia
 *                   - Background diferenciado
 *                 example: false
 *                 default: false
 *           examples:
 *             basic_image:
 *               summary: Imagem Simples
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 image_base64: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj..."
 *                 caption: "Minha imagem"
 *                 filename: "teste.jpg"
 *             custom_agent_image:
 *               summary: Imagem via Custom Agent
 *               description: Imagem enviada por automação/webhook
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 image_base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
 *                 caption: "Imagem processada automaticamente pelo sistema"
 *                 sent_via_agent: true
 *             n8n_webhook_image:
 *               summary: Webhook N8N
 *               description: Exemplo de imagem enviada via N8N
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 image_base64: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
 *                 caption: "Relatório gerado automaticamente"
 *                 filename: "relatorio.jpg"
 *                 sent_via_agent: true
 *                 delay: 2000
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Imagem base64 enviada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message_id:
 *                       type: string
 *                       format: uuid
 *                       description: ID da mensagem salva no banco
 *                     conversation_id:
 *                       type: string
 *                       format: uuid
 *                     filename:
 *                       type: string
 *                       example: "image.jpg"
 *                     caption:
 *                       type: string
 *                       nullable: true
 *                     sent_via_agent:
 *                       type: boolean
 *                     image_size:
 *                       type: object
 *                       properties:
 *                         original_bytes:
 *                           type: integer
 *                           description: Tamanho original em bytes
 *                         base64_length:
 *                           type: integer
 *                           description: Tamanho da string base64
 *                     whatsapp_id:
 *                       type: string
 *                       description: ID da mensagem no WhatsApp
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *             examples:
 *               normal_response:
 *                 summary: Imagem Normal Enviada
 *                 value:
 *                   success: true
 *                   message: "Imagem base64 enviada com sucesso"
 *                   data:
 *                     message_id: "550e8400-e29b-41d4-a716-446655440000"
 *                     conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     filename: "minha-imagem.jpg"
 *                     caption: "Minha imagem"
 *                     sent_via_agent: false
 *                     image_size:
 *                       original_bytes: 45678
 *                       base64_length: 60904
 *                     whatsapp_id: "3EB0C9CB8A3A4E7F9D2A"
 *                     timestamp: "2024-01-15T10:30:00.000Z"
 *               custom_agent_response:
 *                 summary: Custom Agent Response
 *                 value:
 *                   success: true
 *                   message: "Imagem via custom agent enviada com sucesso"
 *                   data:
 *                     message_id: "660f9500-f3ac-51e5-b827-557766551111"
 *                     conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     filename: "relatorio.jpg"
 *                     caption: "Relatório gerado automaticamente"
 *                     sent_via_agent: true
 *                     image_size:
 *                       original_bytes: 123456
 *                       base64_length: 164608
 *                     whatsapp_id: "4FC1D2DC9B4B5F8A0E3B"
 *                     timestamp: "2024-01-15T10:32:00.000Z"
 *       400:
 *         description: Dados inválidos ou imagem muito grande
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Parâmetros obrigatórios: conversation_id, image_base64"
 *                 validation_errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Base64 deve incluir prefixo data:image/", "Tamanho máximo: 5MB"]
 *                 example:
 *                   type: object
 *                   properties:
 *                     conversation_id:
 *                       type: string
 *                       example: "uuid-da-conversa"
 *                     image_base64:
 *                       type: string
 *                       example: "data:image/jpeg;base64,/9j/4AAQ..."
 *                     caption:
 *                       type: string
 *                       example: "Legenda da imagem"
 *                     filename:
 *                       type: string
 *                       example: "imagem.jpg"
 *       404:
 *         description: Conversa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Conversa não encontrada"
 *       413:
 *         description: Imagem muito grande
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Imagem muito grande. Tamanho máximo: 5MB"
 *                 details:
 *                   type: object
 *                   properties:
 *                     received_size:
 *                       type: string
 *                       example: "7.2MB"
 *                     max_size:
 *                       type: string
 *                       example: "5MB"
 *       500:
 *         description: Erro interno do servidor
 */

// ✨ ENDPOINT DESTACADO v3.4.4: send-image-base64 - 100% FUNCIONAL
// Exemplo cURL para teste rápido:
// curl -X POST https://api.zionic.app/api/conversation/send-image-base64 \
//   -H "Authorization: Bearer zio_sua_api_key_aqui" \
//   -H "Content-Type: application/json" \
//   -d '{"conversation_id":"uuid","image_base64":"data:image/jpeg;base64,...","caption":"Teste"}'

/**
 * @swagger
 * /api/conversation/send-audio:
 *   post:
 *     summary: 🎵 Enviar Áudio via URL
 *     description: |
 *       Envia um arquivo de áudio através de URL pública para uma conversa.
 *       
 *       **✨ NOVO na v3.4.2:** Parâmetro `sent_via_agent` para marcar mensagens enviadas via custom agents.
 *       
 *       **Funcionalidades:**
 *       - Envio direto via URL pública
 *       - Conversão automática para formato WhatsApp
 *       - Suporte a MP3, OGG, WAV, M4A
 *       - **Novo:** Marcação visual para mensagens de custom agents
 *       - Salva automaticamente no histórico da conversa
 *     tags:
 *       - 💬 Mensagens via Conversation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - audio_url
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID único da conversa
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               audio_url:
 *                 type: string
 *                 format: uri
 *                 description: URL pública do áudio
 *                 example: "https://exemplo.com/audio.mp3"
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1500
 *                 minimum: 0
 *                 maximum: 30000
 *                 default: 1500
 *               sent_via_agent:
 *                 type: boolean
 *                 description: |
 *                   **✨ NOVO na v3.4.2** - Marca o áudio como enviado via custom agent.
 *                   
 *                   Quando `true`, aparece com visual diferenciado no chat:
 *                   - Badge roxo "Enviado via Custom Agent"
 *                   - Ícone especial para mídia
 *                   - Background diferenciado
 *                   
 *                   **Casos de uso:**
 *                   - Webhooks N8N que enviam áudios
 *                   - Áudios gerados por IA/TTS
 *                   - Integrações custom de terceiros
 *                 example: false
 *                 default: false
 *           examples:
 *             basic_audio:
 *               summary: Áudio Normal
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 audio_url: "https://exemplo.com/audio.mp3"
 *                 delay: 1500
 *                 sent_via_agent: false
 *             custom_agent_audio:
 *               summary: Áudio via Custom Agent
 *               description: Áudio enviado por webhook/automação
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 audio_url: "https://sistema.empresa.com/audio-resposta.mp3"
 *                 sent_via_agent: true
 *     responses:
 *       200:
 *         description: Áudio enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Áudio enviado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     messageId:
 *                       type: string
 *                       format: uuid
 *                     conversationId:
 *                       type: string
 *                       format: uuid
 *                     contactName:
 *                       type: string
 *                     instanceName:
 *                       type: string
 *                     evolutionId:
 *                       type: string
 *                     audioUrl:
 *                       type: string
 *                     fileSize:
 *                       type: string
 *                       example: "256 KB"
 *                     sentAt:
 *                       type: string
 *                       format: date-time
 *                     type:
 *                       type: string
 *                       example: "audio"
 *                     sentViaAgent:
 *                       type: boolean
 *                       description: Se foi marcado como enviado via custom agent
 *       400:
 *         description: Parâmetros inválidos
 *       404:
 *         description: Conversa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/conversation/send-video:
 *   post:
 *     summary: 🎬 Enviar Vídeo via URL
 *     description: |
 *       Envia um arquivo de vídeo através de URL pública para uma conversa.
 *       
 *       **✨ NOVO na v3.4.2:** Parâmetro `sent_via_agent` para marcar mensagens enviadas via custom agents.
 *       
 *       **Funcionalidades:**
 *       - Envio direto via URL pública
 *       - Suporte a MP4, AVI, MOV, MKV
 *       - Caption opcional para o vídeo
 *       - **Novo:** Marcação visual para mensagens de custom agents
 *       - Salva automaticamente no histórico da conversa
 *     tags:
 *       - 💬 Mensagens via Conversation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - video_url
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID único da conversa
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               video_url:
 *                 type: string
 *                 format: uri
 *                 description: URL pública do vídeo
 *                 example: "https://exemplo.com/video.mp4"
 *               caption:
 *                 type: string
 *                 description: Legenda do vídeo (opcional)
 *                 example: "Vídeo importante!"
 *                 maxLength: 1000
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 2000
 *                 minimum: 0
 *                 maximum: 30000
 *                 default: 2000
 *               sent_via_agent:
 *                 type: boolean
 *                 description: |
 *                   **✨ NOVO na v3.4.2** - Marca o vídeo como enviado via custom agent.
 *                   
 *                   Quando `true`, aparece com visual diferenciado no chat:
 *                   - Badge roxo "Enviado via Custom Agent"
 *                   - Ícone especial para mídia
 *                   - Background diferenciado
 *                   
 *                   **Casos de uso:**
 *                   - Webhooks N8N que enviam vídeos
 *                   - Vídeos gerados automaticamente
 *                   - Integrações custom de terceiros
 *                 example: false
 *                 default: false
 *           examples:
 *             basic_video:
 *               summary: Vídeo Normal
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 video_url: "https://exemplo.com/video.mp4"
 *                 caption: "Vídeo importante!"
 *                 delay: 2000
 *                 sent_via_agent: false
 *             custom_agent_video:
 *               summary: Vídeo via Custom Agent
 *               description: Vídeo enviado por webhook/automação
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 video_url: "https://sistema.empresa.com/demo-produto.mp4"
 *                 caption: "Demonstração automática do produto"
 *                 sent_via_agent: true
 *     responses:
 *       200:
 *         description: Vídeo enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Vídeo enviado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     messageId:
 *                       type: string
 *                       format: uuid
 *                     conversationId:
 *                       type: string
 *                       format: uuid
 *                     contactName:
 *                       type: string
 *                     instanceName:
 *                       type: string
 *                     evolutionId:
 *                       type: string
 *                     videoUrl:
 *                       type: string
 *                     caption:
 *                       type: string
 *                       nullable: true
 *                     sentAt:
 *                       type: string
 *                       format: date-time
 *                     type:
 *                       type: string
 *                       example: "video"
 *                     sentViaAgent:
 *                       type: boolean
 *                       description: Se foi marcado como enviado via custom agent
 *       400:
 *         description: Parâmetros inválidos
 *       404:
 *         description: Conversa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/conversation/send-document:
 *   post:
 *     summary: 📄 Enviar Documento via URL
 *     description: |
 *       Envia um documento através de URL pública para uma conversa.
 *       
 *       **✨ NOVO na v3.4.2:** Parâmetro `sent_via_agent` para marcar mensagens enviadas via custom agents.
 *       
 *       **Funcionalidades:**
 *       - Envio direto via URL pública
 *       - Suporte a PDF, DOC, DOCX, XLS, XLSX, PPT, TXT
 *       - Nome do arquivo personalizado
 *       - Caption opcional para o documento
 *       - **Novo:** Marcação visual para mensagens de custom agents
 *       - Salva automaticamente no histórico da conversa
 *     tags:
 *       - 💬 Mensagens via Conversation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - document_url
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID único da conversa
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               document_url:
 *                 type: string
 *                 format: uri
 *                 description: URL pública do documento
 *                 example: "https://exemplo.com/documento.pdf"
 *               filename:
 *                 type: string
 *                 description: Nome do arquivo (opcional, incluir extensão)
 *                 example: "documento.pdf"
 *               caption:
 *                 type: string
 *                 description: Legenda do documento (opcional)
 *                 example: "Documento importante!"
 *                 maxLength: 1000
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1500
 *                 minimum: 0
 *                 maximum: 30000
 *                 default: 1500
 *               sent_via_agent:
 *                 type: boolean
 *                 description: |
 *                   **✨ NOVO na v3.4.2** - Marca o documento como enviado via custom agent.
 *                   
 *                   Quando `true`, aparece com visual diferenciado no chat:
 *                   - Badge roxo "Enviado via Custom Agent"
 *                   - Ícone especial para mídia
 *                   - Background diferenciado
 *                   
 *                   **Casos de uso:**
 *                   - Webhooks N8N que enviam documentos
 *                   - Relatórios gerados automaticamente
 *                   - Integrações custom de terceiros
 *                 example: false
 *                 default: false
 *           examples:
 *             basic_document:
 *               summary: Documento Normal
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 document_url: "https://exemplo.com/documento.pdf"
 *                 filename: "documento.pdf"
 *                 caption: "Documento importante!"
 *                 delay: 1500
 *                 sent_via_agent: false
 *             custom_agent_document:
 *               summary: Documento via Custom Agent
 *               description: Documento enviado por webhook/automação
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 document_url: "https://sistema.empresa.com/relatorio-automatico.pdf"
 *                 filename: "relatorio-automatico.pdf"
 *                 caption: "Relatório gerado automaticamente pelo sistema"
 *                 sent_via_agent: true
 *     responses:
 *       200:
 *         description: Documento enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Documento enviado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     messageId:
 *                       type: string
 *                       format: uuid
 *                     conversationId:
 *                       type: string
 *                       format: uuid
 *                     contactName:
 *                       type: string
 *                     instanceName:
 *                       type: string
 *                     evolutionId:
 *                       type: string
 *                     documentUrl:
 *                       type: string
 *                     filename:
 *                       type: string
 *                       nullable: true
 *                     caption:
 *                       type: string
 *                       nullable: true
 *                     sentAt:
 *                       type: string
 *                       format: date-time
 *                     type:
 *                       type: string
 *                       example: "document"
 *                     sentViaAgent:
 *                       type: boolean
 *                       description: Se foi marcado como enviado via custom agent
 *       400:
 *         description: Parâmetros inválidos
 *       404:
 *         description: Conversa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/conversation/mark-read:
 *   post:
 *     summary: 👁️ Marcar Conversa como Lida
 *     description: Marca as mensagens de uma conversa como lidas
 *     tags:
 *       - 💬 Mensagens via Conversation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       200:
 *         description: Conversa marcada como lida
 */

/**
 * @swagger
 * /api/conversation/{conversation_id}:
 *   get:
 *     summary: 📋 Obter Dados da Conversa
 *     description: Busca informações completas de uma conversa incluindo contato, instância e últimas mensagens
 *     tags:
 *       - 💬 Mensagens via Conversation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da conversa
 *         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       200:
 *         description: Dados da conversa retornados com sucesso
 *       404:
 *         description: Conversa não encontrada
 */

/**
 * @swagger
 * /api/conversation/upload-image:
 *   post:
 *     summary: 📤 Upload e Envio de Imagem
 *     description: |
 *       Faz upload de uma imagem diretamente e envia para uma conversa.
 *       
 *       **✨ NOVO na v3.4.2:** Parâmetro `sent_via_agent` para marcar mensagens enviadas via custom agents.
 *       
 *       **Funcionalidades:**
 *       - Upload direto do arquivo
 *       - Armazenamento no Supabase Storage
 *       - Suporte a JPG, PNG, GIF, WebP
 *       - Tamanho máximo: 50MB
 *       - **Novo:** Marcação visual para mensagens de custom agents
 *       - URL pública gerada automaticamente
 *     tags:
 *       - 📤 Upload Direto de Arquivos
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - image
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID único da conversa
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem para upload (JPG, PNG, GIF, WebP)
 *               caption:
 *                 type: string
 *                 description: Legenda da imagem (opcional)
 *                 example: "Imagem enviada via upload!"
 *                 maxLength: 1000
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1200
 *                 minimum: 0
 *                 maximum: 30000
 *                 default: 1200
 *               sent_via_agent:
 *                 type: boolean
 *                 description: |
 *                   **✨ NOVO na v3.4.2** - Marca a imagem como enviada via custom agent.
 *                   
 *                   Quando `true`, aparece com visual diferenciado no chat:
 *                   - Badge roxo "Enviado via Custom Agent"
 *                   - Ícone especial para mídia
 *                   - Background diferenciado
 *                   
 *                   **Casos de uso:**
 *                   - Upload via sistemas automatizados
 *                   - Processamento de imagens via API
 *                   - Integrações custom que fazem upload
 *                 example: false
 *                 default: false
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Imagem enviada com sucesso via upload"
 *                 data:
 *                   type: object
 *                   properties:
 *                     messageId:
 *                       type: string
 *                       format: uuid
 *                     conversationId:
 *                       type: string
 *                       format: uuid
 *                     contactName:
 *                       type: string
 *                     instanceName:
 *                       type: string
 *                     evolutionId:
 *                       type: string
 *                     filename:
 *                       type: string
 *                     fileSize:
 *                       type: string
 *                       example: "256 KB"
 *                     storageUrl:
 *                       type: string
 *                       description: URL pública da imagem no storage
 *                     caption:
 *                       type: string
 *                       nullable: true
 *                     sentAt:
 *                       type: string
 *                       format: date-time
 *                     type:
 *                       type: string
 *                       example: "image"
 *                     sentViaAgent:
 *                       type: boolean
 *                       description: Se foi marcada como enviada via custom agent
 *       400:
 *         description: Arquivo inválido ou parâmetros incorretos
 *       413:
 *         description: Arquivo muito grande (máximo 50MB)
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/conversation/upload-audio:
 *   post:
 *     summary: 📤 Upload e Envio de Áudio
 *     description: |
 *       Faz upload de um arquivo de áudio diretamente e envia para uma conversa.
 *       
 *       **✨ NOVO na v3.4.2:** Parâmetro `sent_via_agent` para marcar mensagens enviadas via custom agents.
 *       
 *       **Funcionalidades:**
 *       - Upload direto do arquivo
 *       - Conversão automática para formato WhatsApp
 *       - Suporte a MP3, OGG, WAV, M4A
 *       - Tamanho máximo: 50MB
 *       - **Novo:** Marcação visual para mensagens de custom agents
 *       - Armazenamento no Supabase Storage
 *     tags:
 *       - 📤 Upload Direto de Arquivos
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - audio
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID único da conversa
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de áudio para upload (MP3, OGG, WAV, M4A)
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1500
 *                 minimum: 0
 *                 maximum: 30000
 *                 default: 1500
 *               sent_via_agent:
 *                 type: boolean
 *                 description: |
 *                   **✨ NOVO na v3.4.2** - Marca o áudio como enviado via custom agent.
 *                   
 *                   Quando `true`, aparece com visual diferenciado no chat:
 *                   - Badge roxo "Enviado via Custom Agent"
 *                   - Ícone especial para mídia
 *                   - Background diferenciado
 *                   
 *                   **Casos de uso:**
 *                   - Upload via sistemas de transcrição
 *                   - Áudios gerados por IA/TTS
 *                   - Integrações custom que fazem upload
 *                 example: false
 *                 default: false
 *     responses:
 *       200:
 *         description: Áudio enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Áudio enviado com sucesso via upload"
 *                 data:
 *                   type: object
 *                   properties:
 *                     messageId:
 *                       type: string
 *                       format: uuid
 *                     conversationId:
 *                       type: string
 *                       format: uuid
 *                     contactName:
 *                       type: string
 *                     instanceName:
 *                       type: string
 *                     evolutionId:
 *                       type: string
 *                     filename:
 *                       type: string
 *                     fileSize:
 *                       type: string
 *                       example: "512 KB"
 *                     storageUrl:
 *                       type: string
 *                       description: URL pública do áudio no storage
 *                     sentAt:
 *                       type: string
 *                       format: date-time
 *                     type:
 *                       type: string
 *                       example: "audio"
 *                     sentViaAgent:
 *                       type: boolean
 *                       description: Se foi marcado como enviado via custom agent
 *       400:
 *         description: Arquivo inválido ou parâmetros incorretos
 *       413:
 *         description: Arquivo muito grande (máximo 50MB)
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/conversation/upload-video:
 *   post:
 *     summary: 📤 Upload e Envio de Vídeo
 *     description: |
 *       Faz upload de um arquivo de vídeo diretamente e envia para uma conversa.
 *       
 *       **✨ NOVO na v3.4.2:** Parâmetro `sent_via_agent` para marcar mensagens enviadas via custom agents.
 *       
 *       **Funcionalidades:**
 *       - Upload direto do arquivo
 *       - Suporte a MP4, AVI, MOV, MKV
 *       - Tamanho máximo: 50MB
 *       - Caption opcional para o vídeo
 *       - **Novo:** Marcação visual para mensagens de custom agents
 *       - Armazenamento no Supabase Storage
 *     tags:
 *       - 📤 Upload Direto de Arquivos
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - video
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID único da conversa
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de vídeo para upload (MP4, AVI, MOV, MKV)
 *               caption:
 *                 type: string
 *                 description: Legenda do vídeo (opcional)
 *                 example: "Vídeo enviado via upload!"
 *                 maxLength: 1000
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 2000
 *                 minimum: 0
 *                 maximum: 30000
 *                 default: 2000
 *               sent_via_agent:
 *                 type: boolean
 *                 description: |
 *                   **✨ NOVO na v3.4.2** - Marca o vídeo como enviado via custom agent.
 *                   
 *                   Quando `true`, aparece com visual diferenciado no chat:
 *                   - Badge roxo "Enviado via Custom Agent"
 *                   - Ícone especial para mídia
 *                   - Background diferenciado
 *                   
 *                   **Casos de uso:**
 *                   - Upload via sistemas automatizados
 *                   - Vídeos processados por IA
 *                   - Integrações custom que fazem upload
 *                 example: false
 *                 default: false
 *     responses:
 *       200:
 *         description: Vídeo enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Vídeo enviado com sucesso via upload"
 *                 data:
 *                   type: object
 *                   properties:
 *                     messageId:
 *                       type: string
 *                       format: uuid
 *                     conversationId:
 *                       type: string
 *                       format: uuid
 *                     contactName:
 *                       type: string
 *                     instanceName:
 *                       type: string
 *                     evolutionId:
 *                       type: string
 *                     filename:
 *                       type: string
 *                     fileSize:
 *                       type: string
 *                       example: "5.2 MB"
 *                     storageUrl:
 *                       type: string
 *                       description: URL pública do vídeo no storage
 *                     caption:
 *                       type: string
 *                       nullable: true
 *                     sentAt:
 *                       type: string
 *                       format: date-time
 *                     type:
 *                       type: string
 *                       example: "video"
 *                     sentViaAgent:
 *                       type: boolean
 *                       description: Se foi marcado como enviado via custom agent
 *       400:
 *         description: Arquivo inválido ou parâmetros incorretos
 *       413:
 *         description: Arquivo muito grande (máximo 50MB)
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/conversation/upload-document:
 *   post:
 *     summary: 📤 Upload e Envio de Documento
 *     description: |
 *       Faz upload de um documento diretamente e envia para uma conversa.
 *       
 *       **✨ NOVO na v3.4.2:** Parâmetro `sent_via_agent` para marcar mensagens enviadas via custom agents.
 *       
 *       **Funcionalidades:**
 *       - Upload direto do arquivo
 *       - Suporte a PDF, DOC, DOCX, XLS, XLSX, PPT, TXT
 *       - Tamanho máximo: 50MB
 *       - Caption opcional para o documento
 *       - **Novo:** Marcação visual para mensagens de custom agents
 *       - Armazenamento no Supabase Storage
 *     tags:
 *       - 📤 Upload Direto de Arquivos
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - document
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID único da conversa
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de documento para upload (PDF, DOC, DOCX, XLS, XLSX, PPT, TXT)
 *               caption:
 *                 type: string
 *                 description: Legenda do documento (opcional)
 *                 example: "Documento importante anexado!"
 *                 maxLength: 1000
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1500
 *                 minimum: 0
 *                 maximum: 30000
 *                 default: 1500
 *               sent_via_agent:
 *                 type: boolean
 *                 description: |
 *                   **✨ NOVO na v3.4.2** - Marca o documento como enviado via custom agent.
 *                   
 *                   Quando `true`, aparece com visual diferenciado no chat:
 *                   - Badge roxo "Enviado via Custom Agent"
 *                   - Ícone especial para mídia
 *                   - Background diferenciado
 *                   
 *                   **Casos de uso:**
 *                   - Upload via sistemas automatizados
 *                   - Documentos gerados por IA
 *                   - Relatórios automáticos
 *                   - Integrações custom que fazem upload
 *                 example: false
 *                 default: false
 *     responses:
 *       200:
 *         description: Documento enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Documento enviado com sucesso via upload"
 *                 data:
 *                   type: object
 *                   properties:
 *                     messageId:
 *                       type: string
 *                       format: uuid
 *                     conversationId:
 *                       type: string
 *                       format: uuid
 *                     contactName:
 *                       type: string
 *                     instanceName:
 *                       type: string
 *                     evolutionId:
 *                       type: string
 *                     filename:
 *                       type: string
 *                     fileSize:
 *                       type: string
 *                       example: "1.2 MB"
 *                     storageUrl:
 *                       type: string
 *                       description: URL pública do documento no storage
 *                     caption:
 *                       type: string
 *                       nullable: true
 *                     sentAt:
 *                       type: string
 *                       format: date-time
 *                     type:
 *                       type: string
 *                       example: "document"
 *                     sentViaAgent:
 *                       type: boolean
 *                       description: Se foi marcado como enviado via custom agent
 *       400:
 *         description: Arquivo inválido ou parâmetros incorretos
 *       413:
 *         description: Arquivo muito grande (máximo 50MB)
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/conversation/agent-control:
 *   post:
 *     summary: 🎛️ Controlar Agentes na Conversa
 *     description: |
 *       **🆕 NOVO na v3.1** - Permite pausar, ativar e atribuir agentes (IA ou humanos) em conversas específicas.
 *       
 *       **Ações Disponíveis:**
 *       - `assign_ai` - Atribuir agente IA (requer ai_agent_id)
 *       - `pause_ai` - Pausar agente IA (mantém atribuição)
 *       - `resume_ai` - Reativar agente IA
 *       - `assign_human` - Atribuir agente humano (requer assigned_to)
 *       - `unassign_human` - Remover atribuição humana
 *       - `remove_ai` - Remover agente IA completamente
 *       
 *       **Regras de Negócio:**
 *       - Atribuir humano pausa automaticamente a IA
 *       - Só agentes ativos podem ser atribuídos
 *       - Só usuários da mesma empresa podem ser atribuídos
 *       - Todas as ações são auditadas automaticamente
 *     tags:
 *       - 🎛️ Controle de Agentes (v3.1)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - action
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID único da conversa a ser modificada
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               action:
 *                 type: string
 *                 enum: [assign_ai, pause_ai, resume_ai, assign_human, unassign_human, remove_ai]
 *                 description: Ação a ser executada na conversa
 *                 example: "assign_ai"
 *               ai_agent_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID do agente IA (obrigatório para action "assign_ai")
 *                 example: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
 *               assigned_to:
 *                 type: string
 *                 format: uuid
 *                 description: ID do usuário/agente humano (obrigatório para action "assign_human")
 *                 example: "7c9e6679-7425-40de-944b-e07fc1f90ae7"
 *           examples:
 *             assign_ai:
 *               summary: Atribuir Agente IA
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 action: "assign_ai"
 *                 ai_agent_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
 *             pause_ai:
 *               summary: Pausar Agente IA
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 action: "pause_ai"
 *             assign_human:
 *               summary: Atribuir Agente Humano
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 action: "assign_human"
 *                 assigned_to: "7c9e6679-7425-40de-944b-e07fc1f90ae7"
 *             resume_ai:
 *               summary: Reativar Agente IA
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 action: "resume_ai"
 *             remove_ai:
 *               summary: Remover Agente IA
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 action: "remove_ai"
 *             unassign_human:
 *               summary: Remover Atribuição Humana
 *               value:
 *                 conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 action: "unassign_human"
 *     responses:
 *       200:
 *         description: Ação executada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Agente IA 'Atendente Virtual' atribuído e ativado"
 *                 data:
 *                   type: object
 *                   properties:
 *                     conversation_id:
 *                       type: string
 *                       format: uuid
 *                       example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     contact_name:
 *                       type: string
 *                       example: "João Silva"
 *                     conversation_title:
 *                       type: string
 *                       example: "WhatsApp Conversation"
 *                     action_performed:
 *                       type: string
 *                       example: "assign_ai"
 *                     current_state:
 *                       type: object
 *                       properties:
 *                         ai_agent:
 *                           type: object
 *                           nullable: true
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             name:
 *                               type: string
 *                               example: "Atendente Virtual"
 *                             enabled:
 *                               type: boolean
 *                               example: true
 *                         human_agent:
 *                           type: object
 *                           nullable: true
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             name:
 *                               type: string
 *                               example: "Ana Silva"
 *                         ai_enabled:
 *                           type: boolean
 *                           example: true
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00.000Z"
 *             examples:
 *               ai_assigned:
 *                 summary: Agente IA Atribuído
 *                 value:
 *                   success: true
 *                   message: "Agente IA 'Atendente Virtual' atribuído e ativado"
 *                   data:
 *                     conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     contact_name: "João Silva"
 *                     conversation_title: "WhatsApp Conversation"
 *                     action_performed: "assign_ai"
 *                     current_state:
 *                       ai_agent:
 *                         id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
 *                         name: "Atendente Virtual"
 *                         enabled: true
 *                       human_agent: null
 *                       ai_enabled: true
 *                     timestamp: "2024-01-15T10:30:00.000Z"
 *               human_assigned:
 *                 summary: Agente Humano Atribuído
 *                 value:
 *                   success: true
 *                   message: "Atribuído ao agente humano 'Ana Silva' (IA pausada)"
 *                   data:
 *                     conversation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     contact_name: "João Silva"
 *                     action_performed: "assign_human"
 *                     current_state:
 *                       ai_agent:
 *                         id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
 *                         name: "Atendente Virtual"
 *                         enabled: false
 *                       human_agent:
 *                         id: "7c9e6679-7425-40de-944b-e07fc1f90ae7"
 *                         name: "Ana Silva"
 *                       ai_enabled: false
 *       400:
 *         description: Parâmetros inválidos ou ação não permitida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "ai_agent_id é obrigatório para action 'assign_ai'"
 *                 actions:
 *                   type: object
 *                   description: Lista de ações disponíveis e seus requisitos
 *                   properties:
 *                     assign_ai:
 *                       type: string
 *                       example: "Atribuir agente IA (requer ai_agent_id)"
 *                     pause_ai:
 *                       type: string
 *                       example: "Pausar agente IA"
 *                     resume_ai:
 *                       type: string
 *                       example: "Reativar agente IA (mantém ai_agent_id atual)"
 *                     assign_human:
 *                       type: string
 *                       example: "Atribuir agente humano (requer assigned_to)"
 *                     unassign_human:
 *                       type: string
 *                       example: "Remover atribuição humana"
 *                     remove_ai:
 *                       type: string
 *                       example: "Remover agente IA completamente"
 *       401:
 *         description: Token de autenticação inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token de acesso obrigatório"
 *                 message:
 *                   type: string
 *                   example: "Inclua o header: Authorization: Bearer YOUR_API_KEY"
 *       404:
 *         description: Conversa, agente ou usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Conversa não encontrada ou sem acesso"
 *                 details:
 *                   type: string
 *                   example: "No rows returned"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor"
 *                 details:
 *                   type: string
 *                   example: "Database connection failed"
 */

/**
 * @swagger
 * /api/leads:
 *   get:
 *     summary: Listar Leads
 *     description: Lista todos os leads da empresa com opções de filtro, busca e paginação
 *     tags:
 *       - 🎯 Leads Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, contacted, qualified, proposal, negotiation, won, lost, invalid]
 *         description: Filtrar por status do lead
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         description: Filtrar por prioridade
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Filtrar por fonte (whatsapp, instagram, website, etc.)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por título, empresa ou email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Limite de leads por página
 *     responses:
 *       200:
 *         description: Lista de leads retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     leads:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           title:
 *                             type: string
 *                             example: "João Silva - Interessado em Automação"
 *                           description:
 *                             type: string
 *                           company:
 *                             type: string
 *                             example: "Silva Tech"
 *                           email:
 *                             type: string
 *                             example: "joao@silvatech.com"
 *                           phone:
 *                             type: string
 *                             example: "11999999999"
 *                           estimated_value:
 *                             type: number
 *                             example: 5000.00
 *                           status:
 *                             type: string
 *                             example: "open"
 *                           priority:
 *                             type: string
 *                             example: "high"
 *                           source:
 *                             type: string
 *                             example: "whatsapp"
 *                           tags:
 *                             type: array
 *                             items:
 *                               type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *   post:
 *     summary: Criar Lead com Pipeline Específico ✨ NOVO v3.9.0
 *     description: |
 *       **✨ ATUALIZADO na v3.9.0** - Agora suporta criação direta em pipelines específicos
 *       
 *       Cria um novo lead no sistema com posicionamento inteligente em pipelines:
 *       
 *       **Funcionalidades v3.9.0:**
 *       - Criação em pipeline específico via `pipeline_id`
 *       - Posicionamento em coluna específica via `column_id`
 *       - Validação automática de permissões
 *       - Cálculo inteligente de posições
 *       - Registro automático de atividades
 *       - Fallback para pipeline padrão se não especificado
 *       
 *       **Comportamento:**
 *       - Se `pipeline_id` não fornecido: usa pipeline padrão da empresa
 *       - Se `column_id` não fornecido: usa primeira coluna do pipeline
 *       - Valida se pipeline/coluna pertencem à empresa
 *     tags:
 *       - 🎯 Leads Management
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "João Silva - Interessado em Automação"
 *               description:
 *                 type: string
 *                 example: "Cliente interessado em automação de WhatsApp"
 *               company:
 *                 type: string
 *                 example: "Silva Tech"
 *               email:
 *                 type: string
 *                 example: "joao@silvatech.com"
 *               phone:
 *                 type: string
 *                 example: "11999999999"
 *               estimated_value:
 *                 type: number
 *                 example: 5000.00
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: "high"
 *                 description: "Valores válidos: low (baixa), medium (média), high (alta)"
 *               source:
 *                 type: string
 *                 example: "whatsapp"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["automação", "whatsapp"]
 *               contact_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID de contato existente (opcional)
 *               pipeline_id:
 *                 type: string
 *                 format: uuid
 *                 description: |
 *                   **✨ NOVO na v3.9.0** - ID do pipeline onde criar o lead.
 *                   
 *                   Se não fornecido, usa o pipeline padrão da empresa.
 *                   Pipeline deve pertencer à empresa.
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               column_id:
 *                 type: string
 *                 format: uuid
 *                 description: |
 *                   **✨ NOVO na v3.9.0** - ID da coluna específica no pipeline.
 *                   
 *                   Se não fornecido, usa a primeira coluna do pipeline.
 *                   Coluna deve pertencer ao pipeline especificado.
 *                 example: "f1e2d3c4-b5a6-9087-fedc-ba0987654321"
 *               custom_fields:
 *                 type: object
 *                 description: Campos personalizados
 *     responses:
 *       201:
 *         description: Lead criado com sucesso
 *       400:
 *         description: Dados inválidos
 *
 * /api/leads/{id}:
 *   get:
 *     summary: Buscar Lead Específico
 *     description: Retorna dados detalhados de um lead específico incluindo relações
 *     tags:
 *       - 🎯 Leads Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do lead
 *     responses:
 *       200:
 *         description: Lead encontrado
 *       404:
 *         description: Lead não encontrado
 *   put:
 *     summary: Atualizar Lead
 *     description: Atualiza dados de um lead existente
 *     tags:
 *       - 🎯 Leads Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               company:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               estimated_value:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [open, contacted, qualified, proposal, negotiation, won, lost, invalid]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *               source:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Lead atualizado com sucesso
 *       404:
 *         description: Lead não encontrado
 *   delete:
 *     summary: Deletar Lead
 *     description: Remove um lead do sistema (soft delete)
 *     tags:
 *       - 🎯 Leads Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lead deletado com sucesso
 *       404:
 *         description: Lead não encontrado
 *
 * /api/leads/{id}/move:
 *   post:
 *     summary: Mover Lead Entre Colunas ✨ MELHORADO v3.9.0
 *     description: |
 *       **✨ MELHORADO na v3.9.0** - Movimentação inteligente com registro de atividades
 *       
 *       Move um lead para uma coluna específica de qualquer pipeline com:
 *       
 *       **Funcionalidades v3.9.0:**
 *       - Movimentação entre colunas do mesmo pipeline ou pipelines diferentes
 *       - Remoção automática do mapeamento anterior (evita duplicatas)
 *       - Cálculo inteligente de posição se não especificada
 *       - Registro automático de atividade de movimentação
 *       - Validação completa de permissões
 *       - Resposta detalhada com informações do pipeline/coluna
 *     tags:
 *       - 🎯 Leads Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do lead a ser movido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - column_id
 *             properties:
 *               column_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID da coluna de destino (deve pertencer à empresa)
 *                 example: "f1e2d3c4-b5a6-9087-fedc-ba0987654321"
 *               position:
 *                 type: integer
 *                 description: |
 *                   Posição específica na coluna (opcional).
 *                   
 *                   Se não fornecida, será calculada automaticamente
 *                   como próxima posição disponível.
 *                 example: 2
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Lead movido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     lead_id:
 *                       type: string
 *                       format: uuid
 *                     lead_title:
 *                       type: string
 *                       example: "João Silva - Interessado"
 *                     column_id:
 *                       type: string
 *                       format: uuid
 *                     column_title:
 *                       type: string
 *                       example: "Em Negociação"
 *                     pipeline_id:
 *                       type: string
 *                       format: uuid
 *                     pipeline_name:
 *                       type: string
 *                       example: "Pipeline Vendas"
 *                     position:
 *                       type: integer
 *                       example: 3
 *                     message:
 *                       type: string
 *                       example: "Lead movido com sucesso"
 *       404:
 *         description: Lead ou coluna não encontrada
 *       400:
 *         description: Coluna não pertence à empresa
 *
 * /api/leads/{id}/move-to-pipeline:
 *   post:
 *     summary: Transferir Lead Entre Pipelines ✨ NOVO v3.9.0
 *     description: |
 *       **✨ NOVO na v3.9.0** - Transferência completa entre pipelines
 *       
 *       Transfere um lead para outro pipeline com posicionamento inteligente:
 *       
 *       **Funcionalidades:**
 *       - Transferência completa entre pipelines diferentes
 *       - Seleção automática da primeira coluna se não especificada
 *       - Validação de pipeline e coluna
 *       - Cálculo automático de posição
 *       - Registro detalhado de atividade
 *       - Resposta completa com dados do destino
 *       
 *       **Casos de uso:**
 *       - Mover lead de "Prospecção" para "Vendas"
 *       - Transferir entre diferentes times/departamentos
 *       - Reposicionar leads em fluxos específicos
 *     tags:
 *       - 🎯 Leads Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do lead a ser transferido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pipeline_id
 *             properties:
 *               pipeline_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID do pipeline de destino (deve pertencer à empresa)
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               column_id:
 *                 type: string
 *                 format: uuid
 *                 description: |
 *                   ID da coluna específica no pipeline de destino (opcional).
 *                   
 *                   Se não fornecida, usa a primeira coluna do pipeline.
 *                   Coluna deve pertencer ao pipeline especificado.
 *                 example: "f1e2d3c4-b5a6-9087-fedc-ba0987654321"
 *     responses:
 *       200:
 *         description: Lead transferido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     lead_id:
 *                       type: string
 *                       format: uuid
 *                     lead_title:
 *                       type: string
 *                       example: "João Silva - Interessado"
 *                     pipeline_id:
 *                       type: string
 *                       format: uuid
 *                     pipeline_name:
 *                       type: string
 *                       example: "Pipeline Vendas"
 *                     column_id:
 *                       type: string
 *                       format: uuid
 *                     column_title:
 *                       type: string
 *                       example: "Novo Lead"
 *                     position:
 *                       type: integer
 *                       example: 1
 *                     message:
 *                       type: string
 *                       example: 'Lead movido para pipeline "Pipeline Vendas" com sucesso'
 *       404:
 *         description: Lead ou pipeline não encontrado
 *       400:
 *         description: Pipeline/coluna não pertence à empresa ou pipeline sem colunas
 *
 * /api/leads/column/{column_id}:
 *   get:
 *     summary: Listar Leads de uma Coluna
 *     description: Lista todos os leads de uma coluna específica
 *     tags:
 *       - 🎯 Leads Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: column_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de leads da coluna
 *       404:
 *         description: Coluna não encontrada
 */

/**
 * @swagger
 * /api/leads/attachments/{leadId}:
 *   post:
 *     summary: Anexar Documento ao Lead
 *     description: |
 *       Anexa um documento ao lead via upload base64. Suporta diversos tipos de arquivo:
 *       - **Documentos**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
 *       - **Imagens**: JPG, PNG, GIF, WEBP, SVG
 *       - **Texto**: TXT, CSV, JSON, XML
 *       - **Outros**: ZIP, RAR
 *       
 *       **Limite**: Máximo 50MB por arquivo
 *     tags:
 *       - 📎 Lead Attachments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do lead que receberá o anexo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - file_base64
 *               - file_name
 *               - file_type
 *             properties:
 *               file_base64:
 *                 type: string
 *                 description: Arquivo codificado em base64
 *                 example: "JVBERi0xLjQKJcOkw7zDtsO..."
 *               file_name:
 *                 type: string
 *                 description: Nome do arquivo com extensão
 *                 example: "proposta_comercial.pdf"
 *               file_type:
 *                 type: string
 *                 description: MIME type do arquivo
 *                 example: "application/pdf"
 *               description:
 *                 type: string
 *                 description: Descrição opcional do anexo
 *                 example: "Proposta comercial para o cliente"
 *               category:
 *                 type: string
 *                 enum: [document, image, contract, proposal, other]
 *                 default: document
 *                 description: Categoria do anexo para organização
 *     responses:
 *       200:
 *         description: Anexo adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Anexo adicionado com sucesso ao lead"
 *                 data:
 *                   type: object
 *                   properties:
 *                     attachment_id:
 *                       type: string
 *                       format: uuid
 *                     lead_id:
 *                       type: string
 *                       format: uuid
 *                     lead_title:
 *                       type: string
 *                       example: "João Silva - Consulta"
 *                     file_name:
 *                       type: string
 *                       example: "proposta_comercial.pdf"
 *                     file_type:
 *                       type: string
 *                       example: "application/pdf"
 *                     file_size:
 *                       type: integer
 *                       example: 524288
 *                     file_size_formatted:
 *                       type: string
 *                       example: "512 KB"
 *                     file_url:
 *                       type: string
 *                       format: uri
 *                       example: "https://supabase.com/storage/v1/object/public/media/lead-attachments/..."
 *                     category:
 *                       type: string
 *                       example: "proposal"
 *                     description:
 *                       type: string
 *                       example: "Proposta comercial para o cliente"
 *                     uploaded_at:
 *                       type: string
 *                       format: date-time
 *                     uploaded_via:
 *                       type: string
 *                       example: "api"
 *       400:
 *         description: Erro de validação (arquivo muito grande, base64 inválido, etc.)
 *       404:
 *         description: Lead não encontrado
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Listar Anexos do Lead
 *     description: Lista todos os anexos ativos de um lead específico
 *     tags:
 *       - 📎 Lead Attachments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do lead
 *     responses:
 *       200:
 *         description: Lista de anexos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     lead_id:
 *                       type: string
 *                       format: uuid
 *                     lead_title:
 *                       type: string
 *                       example: "João Silva - Consulta"
 *                     attachments_count:
 *                       type: integer
 *                       example: 3
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           attachment_id:
 *                             type: string
 *                             format: uuid
 *                           file_name:
 *                             type: string
 *                             example: "contrato.pdf"
 *                           file_type:
 *                             type: string
 *                             example: "application/pdf"
 *                           file_size:
 *                             type: integer
 *                             example: 1048576
 *                           file_size_formatted:
 *                             type: string
 *                             example: "1 MB"
 *                           file_url:
 *                             type: string
 *                             format: uri
 *                           description:
 *                             type: string
 *                             example: "Contrato assinado"
 *                           category:
 *                             type: string
 *                             example: "contract"
 *                           uploaded_by_name:
 *                             type: string
 *                             example: "João Silva"
 *                           uploaded_at:
 *                             type: string
 *                             format: date-time
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *       404:
 *         description: Lead não encontrado
 *       500:
 *         description: Erro interno do servidor
 *
 * /api/leads/attachments/{leadId}/{attachmentId}:
 *   delete:
 *     summary: Deletar Anexo do Lead
 *     description: Remove um anexo específico de um lead (soft delete)
 *     tags:
 *       - 📎 Lead Attachments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do lead
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do anexo a ser removido
 *     responses:
 *       200:
 *         description: Anexo removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Anexo removido com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     attachment_id:
 *                       type: string
 *                       format: uuid
 *                     lead_id:
 *                       type: string
 *                       format: uuid
 *                     file_name:
 *                       type: string
 *                       example: "documento.pdf"
 *                     deleted_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Anexo ou lead não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/pipelines:
 *   get:
 *     summary: Listar Pipelines
 *     description: Lista todos os pipelines da empresa com suas colunas
 *     tags:
 *       - 📊 Pipelines Management
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pipelines retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                         example: "Pipeline de Vendas"
 *                       description:
 *                         type: string
 *                       is_default:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       columns:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             title:
 *                               type: string
 *                               example: "Novos Leads"
 *                             color:
 *                               type: string
 *                               example: "#3b82f6"
 *                             position:
 *                               type: integer
 *
 * /api/pipelines/{id}:
 *   get:
 *     summary: Buscar Pipeline Específico
 *     description: Retorna dados detalhados de um pipeline específico
 *     tags:
 *       - 📊 Pipelines Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Pipeline encontrado
 *       404:
 *         description: Pipeline não encontrado
 *
 * /api/pipelines/default/info:
 *   get:
 *     summary: Buscar Pipeline Padrão
 *     description: Retorna informações do pipeline padrão da empresa
 *     tags:
 *       - 📊 Pipelines Management
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Pipeline padrão encontrado
 *       404:
 *         description: Pipeline padrão não encontrado
 *
 * /api/pipelines/{id}/columns:
 *   get:
 *     summary: Listar Colunas de um Pipeline
 *     description: Lista todas as colunas de um pipeline específico ordenadas por posição
 *     tags:
 *       - 📊 Pipelines Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de colunas do pipeline
 *       404:
 *         description: Pipeline não encontrado
 *
 * /api/pipelines/columns/all:
 *   get:
 *     summary: Listar Todas as Colunas
 *     description: Lista todas as colunas de todos os pipelines agrupadas por pipeline
 *     tags:
 *       - 📊 Pipelines Management
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas as colunas agrupadas por pipeline
 *
 * /api/pipelines/{id}/stats:
 *   get:
 *     summary: Estatísticas do Pipeline
 *     description: Retorna estatísticas detalhadas do pipeline incluindo contagem de leads e valores por coluna
 *     tags:
 *       - 📊 Pipelines Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Estatísticas do pipeline
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     pipeline:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         total_leads:
 *                           type: integer
 *                         total_value:
 *                           type: number
 *                     columns:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           column_id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           lead_count:
 *                             type: integer
 *                           total_value:
 *                             type: number
 *       404:
 *         description: Pipeline não encontrado
 */

/**
 * @swagger
 * /api/columns:
 *   get:
 *     summary: Listar Colunas
 *     description: Lista todas as colunas da empresa com informações do pipeline
 *     tags:
 *       - 📋 Columns Management
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de colunas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                         example: "Novos Leads"
 *                       description:
 *                         type: string
 *                       color:
 *                         type: string
 *                         example: "#3b82f6"
 *                       position:
 *                         type: integer
 *                       pipeline_id:
 *                         type: string
 *                         format: uuid
 *                       pipeline_name:
 *                         type: string
 *                         example: "Pipeline de Vendas"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *
 * /api/columns/{id}:
 *   get:
 *     summary: Buscar Coluna Específica
 *     description: Retorna dados detalhados de uma coluna específica
 *     tags:
 *       - 📋 Columns Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Coluna encontrada
 *       404:
 *         description: Coluna não encontrada
 *
 * /api/columns/{id}/leads:
 *   get:
 *     summary: Listar Leads de uma Coluna
 *     description: Lista todos os leads de uma coluna específica ordenados por posição
 *     tags:
 *       - 📋 Columns Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de leads da coluna
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     column:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         color:
 *                           type: string
 *                     leads:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           company:
 *                             type: string
 *                           estimated_value:
 *                             type: number
 *                           priority:
 *                             type: string
 *                           position:
 *                             type: integer
 *       404:
 *         description: Coluna não encontrada
 */

/**
 * @swagger
 * /api/calendar/availability:
 *   get:
 *     summary: Verificar Disponibilidade
 *     description: |
 *       **📅 ATUALIZADO na v3.6.0** - Verifica a disponibilidade de horários usando formato ISO 8601 unificado.
 *       
 *       **✨ NOVA FUNCIONALIDADE v3.6.0:**
 *       - **FORMATO ISO 8601**: Data e hora em parâmetro único (ex: 2025-07-07T11:30:00)
 *       - **TIMEZONE AUTOMÁTICO**: Busca timezone da tabela users.timezone automaticamente
 *       - **SIMPLIFICAÇÃO**: Não precisa mais passar data separada da hora
 *       
 *       **✅ FUNCIONALIDADES v3.5.0:**
 *       - **AGENDA ESPECÍFICA**: Verifica disponibilidade apenas na agenda selecionada
 *       - **VALIDAÇÃO AUTOMÁTICA**: calendar_id obrigatório e validado automaticamente
 *       - **MÚLTIPLAS AGENDAS**: Cada empresa pode ter várias agendas independentes
 *       
 *       **Funcionalidades:**
 *       - Retorna se o período está completamente livre na agenda específica
 *       - Lista horários ocupados com detalhes do agendamento
 *       - Período de verificação flexível (minutos, horas, dias)
 *       - Integração automática com agenda Google Calendar selecionada
 *       - Resolução automática de calendários "primary" → email real
 *     tags:
 *       - 📅 Calendar Management (v3.6.0)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_time
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data/hora de início para verificação (formato ISO 8601)
 *         example: "2025-07-07T09:00:00"
 *       - in: query
 *         name: end_time
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data/hora de fim para verificação (formato ISO 8601)
 *         example: "2025-07-07T18:00:00"
 *       - in: query
 *         name: calendar_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da integração de calendário (obrigatório). Use GET /api/calendar/integrations para listar as agendas disponíveis
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Disponibilidade verificada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-15"
 *                     is_completely_free:
 *                       type: boolean
 *                       example: false
 *                     period_checked:
 *                       type: object
 *                       properties:
 *                         start_hour:
 *                           type: string
 *                           example: "09:00"
 *                         end_hour:
 *                           type: string
 *                           example: "18:00"
 *                     occupied_slots:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           title:
 *                             type: string
 *                             example: "Reunião com Cliente"
 *                           start_time:
 *                             type: string
 *                             format: date-time
 *                           end_time:
 *                             type: string
 *                             format: date-time
 *                           status:
 *                             type: string
 *                             example: "confirmed"
 *                           lead_info:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                     total_appointments:
 *                       type: integer
 *                       example: 3
 *             examples:
 *               completely_free:
 *                 summary: Período Completamente Livre (Formato ISO 8601)
 *                 value:
 *                   success: true
 *                   data:
 *                     date: "2024-01-15"
 *                     is_completely_free: true
 *                     period_checked:
 *                       start_hour: "09:00"
 *                       end_hour: "18:00"
 *                     occupied_slots: []
 *                     total_appointments: 0
 *               with_appointments:
 *                 summary: Dia com Agendamentos
 *                 value:
 *                   success: true
 *                   data:
 *                     date: "2024-01-15"
 *                     is_completely_free: false
 *                     period_checked:
 *                       start_hour: "09:00"
 *                       end_hour: "18:00"
 *                     occupied_slots:
 *                       - id: "550e8400-e29b-41d4-a716-446655440000"
 *                         title: "Reunião com Cliente ABC"
 *                         start_time: "2024-01-15T10:00:00.000Z"
 *                         end_time: "2024-01-15T11:00:00.000Z"
 *                         status: "confirmed"
 *                         lead_info:
 *                           name: "João Silva"
 *                           email: "joao@empresa.com"
 *                     total_appointments: 1
 *       400:
 *         description: Data inválida ou parâmetros incorretos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Formato de data inválido. Use YYYY-MM-DD"
 *       401:
 *         description: Token de autenticação inválido
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/calendar/schedule:
 *   post:
 *     summary: Agendar Horário
 *     description: |
 *       **📅 ATUALIZADO na v3.9.1** - Cria um novo agendamento com validações automáticas, integração AUTOMÁTICA com Google Calendar e vinculação inteligente de leads.
 *       
 *       **✨ NOVA FUNCIONALIDADE v3.9.1:**
 *       - **VINCULAÇÃO INTELIGENTE DE LEADS**: Busca automática de leads por telefone/email
 *       - **NOTIFICAÇÕES AUTOMÁTICAS**: Notifica quando leads são automaticamente vinculados
 *       - **BUSCA POR CONTATO**: Localiza contatos e leads existentes automaticamente
 *       - **INTEGRAÇÃO AUTOMÁTICA**: Evento criado instantaneamente no Google Calendar
 *       - **REFRESH AUTOMÁTICO**: Renova tokens expirados automaticamente
 *       - **MÚLTIPLAS AGENDAS**: Suporte a várias integrações por empresa
 *       - **GOOGLE MEET**: Geração automática de links de reunião
 *       
 *       **Funcionalidades de Vinculação:**
 *       - Vinculação automática de leads baseada em contact_phone ou contact_email
 *       - Validação automática de leads fornecidos diretamente
 *       - Criação de notificações quando leads são automaticamente vinculados
 *       - Busca inteligente em base de contatos existentes
 *       
 *       **Funcionalidades Gerais:**
 *       - Validação automática de conflitos de horário
 *       - Integração obrigatória com agenda específica (calendar_id)
 *       - Criação automática de Google Meet (se habilitado na integração)
 *       - Sincronização bidirecional em tempo real com Google Calendar
 *       - Validações de horário de negócios
 *       - Renovação automática de tokens OAuth
 *       
 *       **Regras de Negócio:**
 *       - Não permite agendamentos em conflito
 *       - Data/hora deve ser no futuro
 *       - Duração mínima de 15 minutos
 *       - Máximo de 8 horas por agendamento
 *     tags:
 *       - 📅 Calendar Management (v3.5.0)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - start_time
 *               - end_time
 *               - calendar_id
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título do agendamento
 *                 example: "Reunião com Cliente ABC"
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 description: Descrição detalhada do agendamento
 *                 example: "Apresentação da proposta comercial"
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora de início (ISO 8601)
 *                 example: "2024-01-15T10:00:00.000Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora de fim (ISO 8601)
 *                 example: "2024-01-15T11:00:00.000Z"
 *               location:
 *                 type: string
 *                 description: Local do agendamento
 *                 example: "Escritório Central - Sala 1"
 *               lead_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID do lead associado (opcional). Se não fornecido, o sistema tentará buscar automaticamente usando contact_phone ou contact_email
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               contact_phone:
 *                 type: string
 *                 description: Telefone do contato para busca automática de lead existente (opcional)
 *                 example: "11999999999"
 *               contact_email:
 *                 type: string
 *                 format: email
 *                 description: Email do contato para busca automática de lead existente (opcional)
 *                 example: "cliente@empresa.com"
 *               calendar_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID da integração de calendário (obrigatório). Use GET /api/calendar/integrations para listar as agendas disponíveis
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               attendees:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "João Silva"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "joao@empresa.com"
 *                     phone:
 *                       type: string
 *                       example: "+5511999999999"
 *                 description: Lista de participantes
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 default: medium
 *                 description: Prioridade do agendamento
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 default: pending
 *                 description: Status do agendamento
 *               create_google_meet:
 *                 type: boolean
 *                 default: true
 *                 description: Se deve criar Google Meet automaticamente
 *               send_notifications:
 *                 type: boolean
 *                 default: true
 *                 description: Se deve enviar notificações aos participantes
 *               created_by_agent:
 *                 type: boolean
 *                 default: false
 *                 description: Indica se o agendamento foi criado por um agente IA (usado para diferenciação visual no app)
 *           examples:
 *             basic_appointment:
 *               summary: Agendamento Básico
 *               value:
 *                 title: "Reunião com Cliente"
 *                 description: "Apresentação da proposta comercial"
 *                 start_time: "2024-01-15T10:00:00.000Z"
 *                 end_time: "2024-01-15T11:00:00.000Z"
 *                 location: "Escritório Central"
 *                 priority: "high"
 *                 calendar_id: "550e8400-e29b-41d4-a716-446655440001"
 *             with_lead:
 *               summary: Agendamento com Lead
 *               value:
 *                 title: "Reunião - Lead João Silva"
 *                 start_time: "2024-01-15T14:00:00.000Z"
 *                 end_time: "2024-01-15T15:30:00.000Z"
 *                 lead_id: "550e8400-e29b-41d4-a716-446655440000"
 *                 attendees:
 *                   - name: "João Silva"
 *                     email: "joao@empresa.com"
 *                     phone: "+5511999999999"
 *                 calendar_id: "550e8400-e29b-41d4-a716-446655440001"
 *                 create_google_meet: true
 *             auto_lead_linking:
 *               summary: Agendamento com Busca Automática de Lead
 *               value:
 *                 title: "Reunião com cliente existente"
 *                 description: "Sistema busca automaticamente o lead pelo telefone"
 *                 start_time: "2024-01-15T16:00:00.000Z"
 *                 end_time: "2024-01-15T17:00:00.000Z"
 *                 contact_phone: "11999999999"
 *                 calendar_id: "550e8400-e29b-41d4-a716-446655440001"
 *                 create_google_meet: true
 *             agent_created:
 *               summary: Agendamento Criado por Agente IA
 *               value:
 *                 title: "Reunião automática via IA"
 *                 description: "Agendamento criado automaticamente pelo agente inteligente"
 *                 start_time: "2025-07-18T09:00:00.000Z"
 *                 end_time: "2025-07-18T10:00:00.000Z"
 *                 location: "Escritório Central"
 *                 calendar_id: "550e8400-e29b-41d4-a716-446655440001"
 *                 created_by_agent: true
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso (inclui criação automática no Google Calendar)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Agendamento criado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         title:
 *                           type: string
 *                         start_time:
 *                           type: string
 *                           format: date-time
 *                         end_time:
 *                           type: string
 *                           format: date-time
 *                         status:
 *                           type: string
 *                         google_event_id:
 *                           type: string
 *                           nullable: true
 *                         google_meet_link:
 *                           type: string
 *                           nullable: true
 *                         created_by_agent:
 *                           type: boolean
 *                           description: Indica se foi criado por agente IA
 *                           example: false
 *                     lead_linking:
 *                       type: object
 *                       description: Informações sobre vinculação de lead
 *                       properties:
 *                         has_lead:
 *                           type: boolean
 *                           description: Se o agendamento foi vinculado a um lead
 *                           example: true
 *                         lead_id:
 *                           type: string
 *                           format: uuid
 *                           nullable: true
 *                           description: ID do lead vinculado
 *                         auto_linked:
 *                           type: boolean
 *                           description: Se o lead foi encontrado automaticamente
 *                           example: true
 *                         method:
 *                           type: string
 *                           enum: [provided_directly, auto_found_by_contact, not_linked]
 *                           description: Método de vinculação usado
 *                           example: "auto_found_by_contact"
 *                         message:
 *                           type: string
 *                           description: Descrição do resultado da vinculação
 *                           example: "Lead \"João Silva - Interessado\" automaticamente vinculado ao agendamento"
 *                         lead_info:
 *                           type: object
 *                           nullable: true
 *                           description: Informações do lead vinculado
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             title:
 *                               type: string
 *                               example: "João Silva - Interessado"
 *                             estimated_value:
 *                               type: number
 *                               example: 5000
 *                             priority:
 *                               type: string
 *                               example: "high"
 *                             pipeline:
 *                               type: string
 *                               example: "Vendas"
 *                             column:
 *                               type: string
 *                               example: "Negociação"
 *                         contact_info:
 *                           type: object
 *                           nullable: true
 *                           description: Informações do contato encontrado (se busca automática)
 *                     google_calendar:
 *                       type: object
 *                       properties:
 *                         integration_status:
 *                           type: string
 *                           enum: [success, failed, partial_success, not_attempted]
 *                           example: "success"
 *                         message:
 *                           type: string
 *                           example: "Evento criado com sucesso no Google Calendar"
 *                         google_event_id:
 *                           type: string
 *                           nullable: true
 *                           example: "google_event_456"
 *                         google_meet_link:
 *                           type: string
 *                           nullable: true
 *                           example: "https://meet.google.com/abc-defg-hij"
 *                         calendar_info:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             name:
 *                               type: string
 *                               example: "Agenda Principal"
 *                             calendar_id:
 *                               type: string
 *                               example: "primary"
 *             examples:
 *               success_with_meet:
 *                 summary: ✅ Sucesso com Google Meet
 *                 value:
 *                   success: true
 *                   message: "Agendamento criado com sucesso"
 *                   appointment:
 *                     id: "apt_123"
 *                     title: "Reunião com Cliente"
 *                     google_event_id: "google_event_456"
 *                     google_meet_link: "https://meet.google.com/abc-defg-hij"
 *                     calendar_integration_id: "550e8400-e29b-41d4-a716-446655440001"
 *                   google_calendar:
 *                     integration_status: "success"
 *                     message: "Evento criado com sucesso no Google Calendar"
 *                     google_event_id: "google_event_456"
 *                     google_meet_link: "https://meet.google.com/abc-defg-hij"
 *                     calendar_info:
 *                       id: "550e8400-e29b-41d4-a716-446655440001"
 *                       name: "Agenda Principal"
 *                       calendar_id: "primary"
 *               token_expired_auto_refresh:
 *                 summary: 🔄 Token Renovado Automaticamente
 *                 value:
 *                   success: true
 *                   message: "Agendamento criado com sucesso"
 *                   appointment:
 *                     id: "apt_124"
 *                     google_event_id: "google_event_457"
 *                   google_calendar:
 *                     integration_status: "success"
 *                     message: "Evento criado com sucesso no Google Calendar"
 *                     token_refreshed: true
 *               integration_failed:
 *                 summary: ❌ Falha na Integração
 *                 value:
 *                   success: true
 *                   message: "Agendamento criado com sucesso"
 *                   appointment:
 *                     id: "apt_125"
 *                     google_event_id: null
 *                   google_calendar:
 *                     integration_status: "failed"
 *                     message: "Erro ao criar no Google Calendar: Token expired and no refresh token"
 *       400:
 *         description: Dados inválidos ou conflito de horário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Conflito de horário detectado"
 *                 conflicts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       appointment_id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       start_time:
 *                         type: string
 *                       end_time:
 *                         type: string
 *       401:
 *         description: Token de autenticação inválido
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/calendar/appointments:
 *   get:
 *     summary: Listar Agendamentos
 *     description: |
 *       **📅 ATUALIZADO na v3.5.0** - Lista agendamentos com filtros avançados, paginação e informações de agenda.
 *       
 *       **Filtros Disponíveis:**
 *       - Por data (data específica, intervalo, mês)
 *       - Por status (pending, confirmed, cancelled, completed)
 *       - Por lead associado
 *       - Por prioridade
 *       - Busca por título/descrição
 *       
 *       **Ordenação:**
 *       - Por data (mais próximos primeiro)
 *       - Por prioridade
 *       - Por status
 *     tags:
 *       - 📅 Calendar Management (v3.5.0)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por data específica (YYYY-MM-DD)
 *         example: "2024-01-15"
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início para intervalo (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim para intervalo (YYYY-MM-DD)
 *         example: "2024-01-31"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         description: Filtrar por status
 *       - in: query
 *         name: lead_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por lead específico
 *       - in: query
 *         name: calendar_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por agenda específica (opcional)
 *         example: "550e8400-e29b-41d4-a716-446655440001"
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         description: Filtrar por prioridade
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por título ou descrição
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           maximum: 100
 *         description: Limite de resultados por página
 *       - in: query
 *         name: order_by
 *         schema:
 *           type: string
 *           enum: [start_time, priority, created_at]
 *           default: start_time
 *         description: Campo para ordenação
 *       - in: query
 *         name: order_direction
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Direção da ordenação
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           start_time:
 *                             type: string
 *                             format: date-time
 *                           end_time:
 *                             type: string
 *                             format: date-time
 *                           location:
 *                             type: string
 *                           status:
 *                             type: string
 *                           priority:
 *                             type: string
 *                           google_meet_link:
 *                             type: string
 *                             nullable: true
 *                           calendar_info:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                                 description: ID da integração de calendário
 *                               name:
 *                                 type: string
 *                                 description: Nome da agenda
 *                                 example: "Agenda Principal"
 *                               calendar_id:
 *                                 type: string
 *                                 description: ID do calendário no Google
 *                                 example: "primary"
 *                           lead_info:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               id:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                               company:
 *                                 type: string
 *                           attendees:
 *                             type: array
 *                             items:
 *                               type: object
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       400:
 *         description: Parâmetros de filtro inválidos
 *       401:
 *         description: Token de autenticação inválido
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/calendar/appointments/{id}:
 *   put:
 *     summary: Atualizar Agendamento
 *     description: |
 *       **📅 ATUALIZADO na v3.5.0** - Atualiza um agendamento existente com validações e sincronização automática com Google Calendar.
 *       
 *       **✨ NOVA FUNCIONALIDADE v3.5.0:**
 *       - **ATUALIZAÇÃO AUTOMÁTICA**: Evento atualizado instantaneamente no Google Calendar
 *       - **MÚLTIPLAS AGENDAS**: Permite mover agendamentos entre diferentes agendas
 *       - **REFRESH AUTOMÁTICO**: Renova tokens expirados automaticamente
 *       
 *       **Funcionalidades:**
 *       - Validação de conflitos ao alterar horários
 *       - Sincronização automática em tempo real com Google Calendar
 *       - Atualização automática de Google Meet
 *       - Validações de permissão e integridade
 *       - Suporte a mudança entre agendas (calendar_id)
 *       
 *       **Regras de Negócio:**
 *       - Não permite conflitos com outros agendamentos
 *       - Novos horários devem ser no futuro
 *       - Apenas agendamentos não concluídos podem ser alterados
 *       - Notificações automáticas aos participantes
 *     tags:
 *       - 📅 Calendar Management (v3.5.0)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do agendamento a ser atualizado
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Reunião com Cliente - Atualizada"
 *               description:
 *                 type: string
 *                 example: "Revisão da proposta comercial"
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T11:00:00.000Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T12:00:00.000Z"
 *               location:
 *                 type: string
 *                 example: "Escritório Central - Sala 2"
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 example: "confirmed"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 example: "high"
 *               attendees:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *               lead_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID do lead (pode ser alterado ou removido)
 *               calendar_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID da integração de calendário (opcional - permite mover para outra agenda)
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *           examples:
 *             update_time:
 *               summary: Alterar Horário
 *               value:
 *                 start_time: "2024-01-15T11:00:00.000Z"
 *                 end_time: "2024-01-15T12:00:00.000Z"
 *             update_status:
 *               summary: Confirmar Agendamento
 *               value:
 *                 status: "confirmed"
 *                 priority: "high"
 *             full_update:
 *               summary: Atualização Completa
 *               value:
 *                 title: "Reunião Final - Cliente ABC"
 *                 description: "Assinatura do contrato"
 *                 start_time: "2024-01-15T14:00:00.000Z"
 *                 end_time: "2024-01-15T15:00:00.000Z"
 *                 location: "Sala de Reuniões VIP"
 *                 status: "confirmed"
 *                 priority: "urgent"
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Agendamento atualizado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         title:
 *                           type: string
 *                         start_time:
 *                           type: string
 *                           format: date-time
 *                         end_time:
 *                           type: string
 *                           format: date-time
 *                         status:
 *                           type: string
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                     changes:
 *                       type: object
 *                       description: Campos que foram alterados
 *                     google_calendar:
 *                       type: object
 *                       properties:
 *                         synced:
 *                           type: boolean
 *                         updated:
 *                           type: boolean
 *       400:
 *         description: Dados inválidos ou conflito de horário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Conflito de horário detectado"
 *                 conflicts:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Agendamento não encontrado
 *       401:
 *         description: Token de autenticação inválido
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Deletar Agendamento
 *     description: |
 *       **📅 NOVO na v3.3** - Remove um agendamento do sistema com sincronização automática.
 *       
 *       **Funcionalidades:**
 *       - Remoção automática do Google Calendar
 *       - Notificações aos participantes
 *       - Soft delete com possibilidade de recuperação
 *       - Atualização automática de atividades do lead
 *       - Logs de auditoria completos
 *       
 *       **Regras de Negócio:**
 *       - Apenas agendamentos futuros ou pendentes podem ser deletados
 *       - Agendamentos concluídos são mantidos para histórico
 *       - Notificação automática de cancelamento
 *     tags:
 *       - 📅 Calendar Management (v3.5.0)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do agendamento a ser deletado
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *       - in: query
 *         name: reason
 *         schema:
 *           type: string
 *         description: Motivo do cancelamento (opcional)
 *         example: "Cliente solicitou reagendamento"
 *       - in: query
 *         name: notify_attendees
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Se deve notificar os participantes
 *     responses:
 *       200:
 *         description: Agendamento deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Agendamento cancelado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointment_id:
 *                       type: string
 *                       format: uuid
 *                     title:
 *                       type: string
 *                     cancelled_at:
 *                       type: string
 *                       format: date-time
 *                     reason:
 *                       type: string
 *                       nullable: true
 *                     google_calendar:
 *                       type: object
 *                       properties:
 *                         removed:
 *                           type: boolean
 *                         event_id:
 *                           type: string
 *                           nullable: true
 *                     notifications:
 *                       type: object
 *                       properties:
 *                         sent:
 *                           type: boolean
 *                         attendees_notified:
 *                           type: integer
 *       400:
 *         description: Agendamento não pode ser deletado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Agendamentos concluídos não podem ser deletados"
 *                 details:
 *                   type: string
 *                   example: "Use o status 'cancelled' para manter histórico"
 *       404:
 *         description: Agendamento não encontrado
 *       401:
 *         description: Token de autenticação inválido
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/calendar/integrations:
 *   get:
 *     summary: 📊 Listar Integrações Google Calendar
 *     description: |
 *       **🆕 NOVO na v3.4** - Lista todas as integrações do Google Calendar da empresa com informações detalhadas.
 *       
 *       **Funcionalidades:**
 *       - Lista todas as integrações (ativas e inativas)
 *       - Mostra status de cada integração
 *       - Informações do usuário associado a cada agenda
 *       - Estatísticas resumidas de integrações
 *       - Configurações de sincronização e timezone
 *       
 *       **Status Possíveis:**
 *       - `connected`: Integração ativa e funcionando
 *       - `disconnected`: Integração desconectada
 *       - `error`: Erro na integração (token expirado, etc.)
 *       
 *       **Casos de Uso:**
 *       - Gerenciar múltiplas agendas da empresa
 *       - Verificar status de sincronização
 *       - Identificar integrações com problemas
 *       - Auditoria de conexões ativas
 *     tags:
 *       - 📅 Calendar Management (v3.4)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de integrações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "3 integração(ões) encontrada(s)"
 *                 data:
 *                   type: object
 *                   properties:
 *                     integrations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: "550e8400-e29b-41d4-a716-446655440000"
 *                           calendar_id:
 *                             type: string
 *                             example: "primary"
 *                           calendar_name:
 *                             type: string
 *                             example: "Agenda Principal - João Silva"
 *                           status:
 *                             type: string
 *                             enum: [connected, disconnected, error]
 *                             example: "connected"
 *                           is_active:
 *                             type: boolean
 *                             example: true
 *                           timezone:
 *                             type: string
 *                             example: "America/Sao_Paulo"
 *                           auto_create_meet:
 *                             type: boolean
 *                             example: true
 *                           sync_enabled:
 *                             type: boolean
 *                             example: true
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                               name:
 *                                 type: string
 *                                 example: "João Silva"
 *                               email:
 *                                 type: string
 *                                 example: "joao@empresa.com"
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                           last_sync_at:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total_integrations:
 *                           type: integer
 *                           example: 3
 *                         active_integrations:
 *                           type: integer
 *                           example: 2
 *                         status_breakdown:
 *                           type: object
 *                           properties:
 *                             connected:
 *                               type: integer
 *                               example: 2
 *                             disconnected:
 *                               type: integer
 *                               example: 1
 *                             error:
 *                               type: integer
 *                               example: 0
 *                             inactive:
 *                               type: integer
 *                               example: 0
 *                             total:
 *                               type: integer
 *                               example: 3
 *             examples:
 *               multiple_integrations:
 *                 summary: Múltiplas Integrações
 *                 value:
 *                   success: true
 *                   message: "3 integração(ões) encontrada(s)"
 *                   data:
 *                     integrations:
 *                       - id: "550e8400-e29b-41d4-a716-446655440000"
 *                         calendar_id: "primary"
 *                         calendar_name: "Agenda Principal - João Silva"
 *                         status: "connected"
 *                         is_active: true
 *                         timezone: "America/Sao_Paulo"
 *                         auto_create_meet: true
 *                         sync_enabled: true
 *                         user:
 *                           id: "user-123"
 *                           name: "João Silva"
 *                           email: "joao@empresa.com"
 *                         created_at: "2024-01-01T10:00:00.000Z"
 *                         updated_at: "2024-01-15T14:30:00.000Z"
 *                         last_sync_at: "2024-01-15T14:25:00.000Z"
 *                       - id: "660f9500-f3ac-51e5-b827-557766551111"
 *                         calendar_id: "vendas@empresa.com"
 *                         calendar_name: "Agenda de Vendas"
 *                         status: "connected"
 *                         is_active: true
 *                         timezone: "America/Sao_Paulo"
 *                         auto_create_meet: true
 *                         sync_enabled: true
 *                         user:
 *                           id: "user-456"
 *                           name: "Maria Santos"
 *                           email: "maria@empresa.com"
 *                         created_at: "2024-01-05T09:00:00.000Z"
 *                         updated_at: "2024-01-15T14:30:00.000Z"
 *                         last_sync_at: "2024-01-15T14:20:00.000Z"
 *                     summary:
 *                       total_integrations: 2
 *                       active_integrations: 2
 *                       status_breakdown:
 *                         connected: 2
 *                         disconnected: 0
 *                         error: 0
 *                         inactive: 0
 *                         total: 2
 *       401:
 *         description: Token de autenticação inválido
 *       500:
 *         description: Erro interno do servidor
 *
 * /api/calendar/integrations/status:
 *   get:
 *     summary: 🔍 Status de Múltiplas Integrações
 *     description: |
 *       **🆕 NOVO na v3.4** - Verificação rápida do status das integrações Google Calendar.
 *       
 *       **Informações Retornadas:**
 *       - Se há pelo menos uma integração ativa
 *       - Quantidade total de integrações ativas
 *       - Integração primária (primeira ativa)
 *       - Resumo de todas as integrações
 *       - Mensagens de erro se houver problemas
 *       
 *       **Endpoint Otimizado:**
 *       - Resposta mais rápida que `/integrations`
 *       - Ideal para verificações de status
 *       - Usado internamente pelo sistema
 *       - Perfeito para dashboards e validações
 *     tags:
 *       - 📅 Calendar Management (v3.4)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Status verificado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     has_integration:
 *                       type: boolean
 *                       example: true
 *                       description: Se há pelo menos uma integração ativa
 *                     total_active:
 *                       type: integer
 *                       example: 3
 *                       description: Número total de integrações ativas
 *                     primary_calendar:
 *                       type: string
 *                       example: "Agenda Principal - João Silva"
 *                       nullable: true
 *                       description: Nome da agenda primária (primeira ativa)
 *                     integrations_summary:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           calendar_name:
 *                             type: string
 *                           status:
 *                             type: string
 *                           user_id:
 *                             type: string
 *                             format: uuid
 *                       description: Resumo básico de cada integração
 *                     error:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                       description: Mensagem de erro se houver problemas
 *                     timezone:
 *                       type: string
 *                       example: "America/Sao_Paulo"
 *                       description: Timezone da empresa
 *                     company:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *             examples:
 *               active_integrations:
 *                 summary: Integrações Ativas
 *                 value:
 *                   success: true
 *                   data:
 *                     has_integration: true
 *                     total_active: 2
 *                     primary_calendar: "Agenda Principal - João Silva"
 *                     integrations_summary:
 *                       - id: "550e8400-e29b-41d4-a716-446655440000"
 *                         calendar_name: "Agenda Principal - João Silva"
 *                         status: "connected"
 *                         user_id: "user-123"
 *                       - id: "660f9500-f3ac-51e5-b827-557766551111"
 *                         calendar_name: "Agenda de Vendas"
 *                         status: "connected"
 *                         user_id: "user-456"
 *                     error: null
 *                     timezone: "America/Sao_Paulo"
 *                     company:
 *                       id: "company-789"
 *                       name: "Empresa ABC"
 *               no_integrations:
 *                 summary: Sem Integrações
 *                 value:
 *                   success: true
 *                   data:
 *                     has_integration: false
 *                     total_active: 0
 *                     primary_calendar: null
 *                     integrations_summary: []
 *                     error: "Nenhuma integração ativa do Google Calendar encontrada"
 *                     timezone: "America/Sao_Paulo"
 *                     company:
 *                       id: "company-789"
 *                       name: "Empresa ABC"
 *       401:
 *         description: Token de autenticação inválido
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/tokens/models:
 *   get:
 *     summary: 📋 Listar Modelos Suportados
 *     description: |
 *       **🧮 NOVO na v3.7.0** - Lista todos os modelos OpenAI suportados para cálculo de tokens com informações detalhadas.
 *       
 *       **Funcionalidades:**
 *       - Lista modelos GPT-3.5, GPT-4, GPT-4o com limitações
 *       - Mostra encoding usado por cada modelo
 *       - Máximo de tokens por modelo
 *       - Preços aproximados por 1K tokens
 *       - Agrupamento por tipo de encoding
 *       
 *       **Modelos Suportados:**
 *       - **GPT-4o/GPT-4o-mini**: o200k_base (128K tokens)
 *       - **GPT-4/GPT-3.5-turbo**: cl100k_base (4K-128K tokens)
 *       - **Text-davinci**: p50k_base (4K tokens)
 *       
 *       **Casos de Uso:**
 *       - Verificar qual modelo usar para tarefas específicas
 *       - Calcular custos antes de fazer chamadas
 *       - Entender limitações de tokens de cada modelo
 *     tags:
 *       - 🧮 Token Calculation (v3.7.0)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de modelos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     supported_models:
 *                       type: object
 *                       additionalProperties:
 *                         type: object
 *                         properties:
 *                           encoding:
 *                             type: string
 *                             example: "cl100k_base"
 *                           max_tokens:
 *                             type: integer
 *                             example: 128000
 *                     default_model:
 *                       type: string
 *                       example: "gpt-3.5-turbo"
 *                     encodings:
 *                       type: object
 *                       additionalProperties:
 *                         type: array
 *                         items:
 *                           type: string
 *             examples:
 *               model_list:
 *                 summary: Lista Completa de Modelos
 *                 value:
 *                   success: true
 *                   data:
 *                     supported_models:
 *                       "gpt-4o":
 *                         encoding: "o200k_base"
 *                         max_tokens: 128000
 *                       "gpt-4o-mini":
 *                         encoding: "o200k_base"
 *                         max_tokens: 128000
 *                       "gpt-4-turbo":
 *                         encoding: "cl100k_base"
 *                         max_tokens: 128000
 *                       "gpt-4":
 *                         encoding: "cl100k_base"
 *                         max_tokens: 8192
 *                       "gpt-3.5-turbo":
 *                         encoding: "cl100k_base"
 *                         max_tokens: 4096
 *                     default_model: "gpt-3.5-turbo"
 *                     encodings:
 *                       "o200k_base": ["gpt-4o", "gpt-4o-mini"]
 *                       "cl100k_base": ["gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"]
 *                       "p50k_base": ["text-davinci-003", "text-davinci-002"]
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/tokens/count:
 *   post:
 *     summary: 🧮 Calcular Tokens Totais do Assistente
 *     description: |
 *       **🧮 NOVO na v3.7.0** - Calcula tokens totais de uma conversa com assistente usando a biblioteca Tiktoken.
 *       
 *       **Funcionalidades:**
 *       - Calcula tokens de entrada (prompt + mensagem do usuário)
 *       - Calcula tokens de saída (resposta do assistente)
 *       - Calcula total de tokens (entrada + saída)
 *       - Estimativa de custo real em USD
 *       - Breakdown detalhado por componente
 *       
 *       **Como Funciona:**
 *       - **Entrada**: prompt do sistema + mensagem do usuário
 *       - **Saída**: resposta gerada pelo assistente
 *       - **Total**: entrada + saída
 *       
 *       **Ideal Para:**
 *       - Calcular custos reais após usar OpenAI
 *       - Monitorar gastos com assistentes
 *       - Otimizar prompts para economia
 *       - Análise de eficiência de conversas
 *     tags:
 *       - 🧮 Token Calculation (v3.7.0)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_message
 *               - assistant_message
 *               - prompt
 *             properties:
 *               user_message:
 *                 type: string
 *                 description: Mensagem que o usuário enviou para o assistente
 *                 example: "Qual é a capital do Brasil?"
 *               assistant_message:
 *                 type: string
 *                 description: Resposta que o assistente gerou
 *                 example: "A capital do Brasil é Brasília, que foi inaugurada em 1960 e está localizada no Distrito Federal."
 *               prompt:
 *                 type: string
 *                 description: Prompt do sistema usado pelo assistente
 *                 example: "Você é um assistente útil que responde perguntas de forma clara e precisa."
 *               model:
 *                 type: string
 *                 default: "gpt-3.5-turbo"
 *                 description: Modelo utilizado (para cálculo preciso de tokens)
 *                 example: "gpt-4"
 *                 enum: [gpt-3.5-turbo, gpt-4, gpt-4-turbo, gpt-4o, gpt-4o-mini, text-davinci-003]
 *           examples:
 *             assistant_conversation:
 *               summary: Conversa com Assistente
 *               value:
 *                 user_message: "Qual é a capital do Brasil?"
 *                 assistant_message: "A capital do Brasil é Brasília, que foi inaugurada em 1960 e está localizada no Distrito Federal."
 *                 prompt: "Você é um assistente útil que responde perguntas de forma clara e precisa."
 *                 model: "gpt-3.5-turbo"
 *             gpt4_conversation:
 *               summary: Conversa com GPT-4
 *               value:
 *                 user_message: "Explique o que é inteligência artificial"
 *                 assistant_message: "Inteligência artificial é um campo da ciência da computação que busca criar sistemas capazes de realizar tarefas que normalmente requerem inteligência humana."
 *                 prompt: "Você é um professor de tecnologia que explica conceitos complexos de forma simples."
 *                 model: "gpt-4"
 *     responses:
 *       200:
 *         description: Tokens calculados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     input_tokens:
 *                       type: integer
 *                       example: 25
 *                       description: Total de tokens de entrada (prompt + user_message)
 *                     output_tokens:
 *                       type: integer
 *                       example: 32
 *                       description: Total de tokens de saída (assistant_message)
 *                     total_tokens:
 *                       type: integer
 *                       example: 57
 *                       description: Total geral de tokens (entrada + saída)
 *                     model:
 *                       type: string
 *                       example: "gpt-3.5-turbo"
 *                     calculation_details:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           enum: [assistant_conversation]
 *                           example: "assistant_conversation"
 *                         model:
 *                           type: string
 *                           example: "gpt-3.5-turbo"
 *                         encoding:
 *                           type: string
 *                           example: "cl100k_base"
 *                         breakdown:
 *                           type: object
 *                           properties:
 *                             prompt:
 *                               type: object
 *                               properties:
 *                                 text_length:
 *                                   type: integer
 *                                   example: 70
 *                                 tokens:
 *                                   type: integer
 *                                   example: 15
 *                             user_message:
 *                               type: object
 *                               properties:
 *                                 text_length:
 *                                   type: integer
 *                                   example: 30
 *                                 tokens:
 *                                   type: integer
 *                                   example: 10
 *                             assistant_message:
 *                               type: object
 *                               properties:
 *                                 text_length:
 *                                   type: integer
 *                                   example: 120
 *                                 tokens:
 *                                   type: integer
 *                                   example: 32
 *                         totals:
 *                           type: object
 *                           properties:
 *                             input_tokens:
 *                               type: integer
 *                               example: 25
 *                             output_tokens:
 *                               type: integer
 *                               example: 32
 *                             total_tokens:
 *                               type: integer
 *                               example: 57
 *                     cost_estimate:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         input_cost_usd:
 *                           type: number
 *                           example: 0.000025
 *                           description: Custo real dos tokens de entrada
 *                         output_cost_usd:
 *                           type: number
 *                           example: 0.000064
 *                           description: Custo real dos tokens de saída
 *                         total_cost_usd:
 *                           type: number
 *                           example: 0.000089
 *                           description: Custo total real da conversa
 *                         per_1k_tokens:
 *                           type: object
 *                           properties:
 *                             input:
 *                               type: number
 *                               example: 0.001
 *                             output:
 *                               type: number
 *                               example: 0.002
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *             examples:
 *               assistant_conversation:
 *                 summary: Cálculo de Conversa com Assistente
 *                 value:
 *                   success: true
 *                   data:
 *                     input_tokens: 25
 *                     output_tokens: 32
 *                     total_tokens: 57
 *                     model: "gpt-3.5-turbo"
 *                     calculation_details:
 *                       type: "assistant_conversation"
 *                       encoding: "cl100k_base"
 *                       breakdown:
 *                         prompt:
 *                           text_length: 70
 *                           tokens: 15
 *                         user_message:
 *                           text_length: 30
 *                           tokens: 10
 *                         assistant_message:
 *                           text_length: 120
 *                           tokens: 32
 *                       totals:
 *                         input_tokens: 25
 *                         output_tokens: 32
 *                         total_tokens: 57
 *                     cost_estimate:
 *                       input_cost_usd: 0.000025
 *                       output_cost_usd: 0.000064
 *                       total_cost_usd: 0.000089
 *                       per_1k_tokens:
 *                         input: 0.001
 *                         output: 0.002

 *       400:
 *         description: Entrada inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Parâmetros obrigatórios"
 *                 message:
 *                   type: string
 *                   example: "Forneça: user_message, assistant_message e prompt"
 *       500:
 *         description: Biblioteca tiktoken não disponível
 */

/**
 * @swagger
 * /api/tokens/validate:
 *   post:
 *     summary: ✅ Validar Entrada para Modelo
 *     description: |
 *       **🧮 NOVO na v3.7.0** - Valida se uma entrada (texto ou mensagens) cabe no modelo especificado.
 *       
 *       **Funcionalidades:**
 *       - Verifica se entrada + saída cabem no limite do modelo
 *       - Recomendações para otimização se não couber
 *       - Sugestões de modelos alternativos
 *       - Validação rápida antes de fazer chamadas custosas
 *       
 *       **Casos de Uso:**
 *       - Verificar viabilidade antes de chamadas à API
 *       - Escolher modelo adequado para tamanho da entrada
 *       - Otimizar max_tokens baseado no espaço disponível
 *       - Evitar erros de limite de tokens
 *     tags:
 *       - 🧮 Token Calculation (v3.7.0)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Texto para validação (use OU text OU messages)
 *                 example: "Texto longo que precisa ser validado..."
 *               messages:
 *                 type: array
 *                 description: Mensagens para validação (use OU text OU messages)
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [system, user, assistant]
 *                     content:
 *                       type: string
 *               functions:
 *                 type: array
 *                 description: Definições de funções (opcional)
 *                 items:
 *                   type: object
 *               model:
 *                 type: string
 *                 default: "gpt-3.5-turbo"
 *                 description: Modelo para validação
 *                 example: "gpt-3.5-turbo"
 *               max_tokens:
 *                 type: integer
 *                 default: 1000
 *                 description: Tokens de saída desejados
 *                 example: 1000
 *           examples:
 *             valid_input:
 *               summary: Entrada Válida
 *               value:
 *                 text: "Texto curto para teste"
 *                 model: "gpt-3.5-turbo"
 *                 max_tokens: 500
 *             too_long:
 *               summary: Entrada Muito Longa
 *               value:
 *                 text: "Texto extremamente longo que pode exceder o limite do modelo..."
 *                 model: "gpt-3.5-turbo"
 *                 max_tokens: 2000
 *     responses:
 *       200:
 *         description: Validação realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     valid:
 *                       type: boolean
 *                       example: true
 *                       description: Se a entrada é válida para o modelo
 *                     input_tokens:
 *                       type: integer
 *                       example: 15
 *                       description: Tokens de entrada calculados
 *                     requested_output_tokens:
 *                       type: integer
 *                       example: 1000
 *                       description: Tokens de saída solicitados
 *                     model_limit:
 *                       type: integer
 *                       example: 4096
 *                       description: Limite do modelo
 *                     remaining_tokens:
 *                       type: integer
 *                       example: 4081
 *                       description: Tokens restantes após entrada
 *                     recommendation:
 *                       type: string
 *                       example: "Entrada válida para processamento"
 *                       description: Recomendação de ação
 *                     alternative_models:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Modelos alternativos se entrada inválida
 *                       example: []
 *             examples:
 *               valid_response:
 *                 summary: Entrada Válida
 *                 value:
 *                   success: true
 *                   data:
 *                     valid: true
 *                     input_tokens: 15
 *                     requested_output_tokens: 1000
 *                     model_limit: 4096
 *                     remaining_tokens: 4081
 *                     recommendation: "Entrada válida para processamento"
 *                     alternative_models: []
 *               invalid_response:
 *                 summary: Entrada Inválida
 *                 value:
 *                   success: true
 *                   data:
 *                     valid: false
 *                     input_tokens: 3500
 *                     requested_output_tokens: 1000
 *                     model_limit: 4096
 *                     remaining_tokens: 596
 *                     recommendation: "Reduza max_tokens para 596 ou menos"
 *                     alternative_models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"]
 *       400:
 *         description: Parâmetros inválidos
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/tokens/encoding/{model}:
 *   get:
 *     summary: 🔍 Testar Encoding Específico
 *     description: |
 *       **🧮 NOVO na v3.7.0** - Testa o encoding de um modelo específico com texto personalizado.
 *       
 *       **Funcionalidades:**
 *       - Mostra tokens individuais gerados
 *       - Verifica se decoded text = original text
 *       - Calcula bytes por token médio
 *       - Útil para debug e entendimento do tokenizer
 *       
 *       **Casos de Uso:**
 *       - Debug de problemas de tokenização
 *       - Entender como textos são quebrados em tokens
 *       - Comparar encodings entre modelos
 *       - Análise de eficiência de encoding
 *     tags:
 *       - 🧮 Token Calculation (v3.7.0)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *           enum: [gpt-3.5-turbo, gpt-4, gpt-4-turbo, gpt-4o, gpt-4o-mini, text-davinci-003]
 *         description: Modelo para testar encoding
 *         example: "gpt-4"
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *           default: "Hello, world!"
 *         description: Texto para testar encoding
 *         example: "Olá, mundo! Como você está?"
 *     responses:
 *       200:
 *         description: Encoding testado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     model:
 *                       type: string
 *                       example: "gpt-4"
 *                     encoding:
 *                       type: string
 *                       example: "cl100k_base"
 *                     input_text:
 *                       type: string
 *                       example: "Olá, mundo!"
 *                     token_count:
 *                       type: integer
 *                       example: 4
 *                     tokens:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [47007, 11, 91913]
 *                       description: Array dos tokens numéricos
 *                     decoded_text:
 *                       type: string
 *                       example: "Olá, mundo!"
 *                       description: Texto reconstruído dos tokens
 *                     matches_original:
 *                       type: boolean
 *                       example: true
 *                       description: Se o texto decodificado == original
 *                     bytes_per_token:
 *                       type: number
 *                       example: 3.0
 *                       description: Média de bytes por token
 *             examples:
 *               portuguese_text:
 *                 summary: Texto em Português
 *                 value:
 *                   success: true
 *                   data:
 *                     model: "gpt-4"
 *                     encoding: "cl100k_base"
 *                     input_text: "Olá, mundo! Como você está?"
 *                     token_count: 8
 *                     tokens: [47007, 11, 91913, 0, 17797, 25482, 12272, 30]
 *                     decoded_text: "Olá, mundo! Como você está?"
 *                     matches_original: true
 *                     bytes_per_token: 3.25
 *               english_text:
 *                 summary: Texto em Inglês
 *                 value:
 *                   success: true
 *                   data:
 *                     model: "gpt-3.5-turbo"
 *                     encoding: "cl100k_base"
 *                     input_text: "Hello, world! How are you?"
 *                     token_count: 6
 *                     tokens: [9906, 11, 1917, 0, 2650, 527, 499, 30]
 *                     decoded_text: "Hello, world! How are you?"
 *                     matches_original: true
 *                     bytes_per_token: 4.0
 *       400:
 *         description: Modelo não suportado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * 📋 CHANGELOG - ZIONIC API v3.7.0
 * ═══════════════════════════════════════════════════════════════
 * 
 * 🆕 NOVIDADES v3.7.0 - SISTEMA DE CÁLCULO DE TOKENS OPENAI:
 * 
 * 🧮 Token Calculation Endpoints:
 * • GET /api/tokens/models
 *   - Lista modelos suportados (GPT-3.5, GPT-4, GPT-4o)
 *   - Mostra encoding e limites de cada modelo
 *   - Preços aproximados por 1K tokens
 * 
 * • POST /api/tokens/count
 *   - Calcula tokens de entrada (texto simples ou chat)
 *   - Suporte a functions/tools do OpenAI
 *   - Estimativas de custo em USD
 *   - Breakdown detalhado por mensagem
 * 
 * • POST /api/tokens/validate  
 *   - Valida se entrada + saída cabem no modelo
 *   - Recomendações de otimização
 *   - Sugestões de modelos alternativos
 * 
 * • GET /api/tokens/encoding/:model
 *   - Testa encoding específico com texto personalizado
 *   - Debug de tokenização
 *   - Comparação entre modelos
 * 
 * 🎯 Biblioteca Tiktoken:
 * • Cálculos precisos usando biblioteca oficial da OpenAI
 * • Suporte a encodings: o200k_base, cl100k_base, p50k_base
 * • Compatível com todos os modelos atuais
 * 
 * 💰 Estimativas de Custo:
 * • Preços atualizados da OpenAI por 1K tokens
 * • Cálculo de entrada + estimativa máxima de saída
 * • Útil para otimização de custos
 * 
 * ✨ Benefícios:
 * • Planejamento de custos antes das chamadas
 * • Otimização de prompts para economia
 * • Validação automática de limites
 * • Debug de problemas de tokenização
 * 
 * ═══════════════════════════════════════════════════════════════
 * 📋 CHANGELOG ANTERIOR - v3.6.0 - FORMATO ISO 8601:
 * ═══════════════════════════════════════════════════════════════
 * 
 * 🆕 NOVIDADES v3.6.0 - FORMATO ISO 8601 UNIFICADO:
 * 
 * 📅 Calendar Endpoints Simplificados:
 * • GET /api/calendar/availability
 *   - ANTES: /:date + start_hour/end_hour (separados)
 *   - AGORA: ?start_time=2025-07-07T09:00:00&end_time=2025-07-07T18:00:00
 * 
 * • GET /api/calendar/appointments  
 *   - NOVO: start_time/end_time em formato ISO 8601 (PREFERIDO)
 *   - LEGACY: date, start_date/end_date ainda funcionam
 * 
 * 🌍 Timezone Automático:
 * • Busca automática de users.timezone da empresa
 * • Fallback: company_settings.timezone → 'America/Sao_Paulo'
 * 
 * ✨ Benefícios:
 * • Menos redundância (data + hora em parâmetro único)
 * • Maior precisão temporal
 * • Compatibilidade mantida com formatos antigos
 * • Resolução automática de "primary" → email real
 * 
 * 🔧 Breaking Changes:
 * • GET /availability/:date removido (agora usa query params)
 * • Formatos antigos marcados como LEGACY (ainda funcionam)
 * 
 * ═══════════════════════════════════════════════════════════════
 */

app.listen(port, () => {
  console.log('');
  console.log('⚡ ═══════════════════════════════════════════════');
  console.log('   ZIONIC API DOCUMENTATION - CLEAN & MODERN EDITION');
  console.log('⚡ ═══════════════════════════════════════════════');
  console.log('');
  console.log(`📖 Documentação: http://localhost:${port}`);
  console.log(`📄 API Spec JSON: http://localhost:${port}/api-spec.json`);
  console.log(`📝 API Spec YAML: http://localhost:${port}/api-spec.yaml`);
  console.log(`💚 Health Check: http://localhost:${port}/health`);
  console.log('');
  console.log(`🎨 Interface: Scalar API Reference (Clean Design)`);
  console.log(`📊 Endpoints: 47+ endpoints organizados`);
  console.log(`🌐 Base URL: https://api.zionic.app`);
  console.log(`🖼️ Logo: Zionic oficial integrado`);
  console.log(`📱 Sidebar: 10 categorias organizadas - Leads + Pipelines + Tokens + Calendar`);
  console.log(`🎯 v3.9.0: Criação e movimentação de leads com pipelines específicos - POST /leads move-to-pipeline`);
  console.log(`🔍 v3.8.0: Busca de conversas por telefone normalizado - GET /find-by-phone/:phone`);
  console.log(`🧮 v3.7.0: Sistema completo de cálculo de tokens OpenAI usando Tiktoken`);
  console.log(`📅 v3.6.0: Formato ISO 8601 unificado - Calendar endpoints simplificados`);
  console.log(`🎯 v3.5.0: Leads, Pipelines, Columns e Calendar Management - INTEGRAÇÃO AUTOMÁTICA GOOGLE CALENDAR`);
  console.log(`🤖 v3.4: Custom Agent Messages com visual diferenciado`);
  console.log(`📸 v3.4.2: Envio de imagem via base64 direto`);
  console.log(`⚙️ v3.4.4: send-image-base64 100% visível e funcional`);
  console.log(`✨ Status: Design clean, detalhado e moderno`);
  console.log('');
  console.log('⚡ ═══════════════════════════════════════════════');
}); 
