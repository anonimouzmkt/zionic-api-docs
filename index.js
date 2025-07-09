const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3002;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zionic WhatsApp API',
      version: '3.0.0',
      description: `
# 🤖 Zionic WhatsApp API - Sandbox Interativo

Bem-vindo ao sandbox da **Zionic API**! Aqui você pode testar todas as funcionalidades de envio de mensagens WhatsApp.

## 🚀 Como Usar

1. **Obtenha sua API Key** no painel Zionic
2. **Clique em "Authorize"** e insira: \`Bearer YOUR_API_KEY\`
3. **Teste as rotas** diretamente no sandbox
4. **Veja exemplos reais** em cada endpoint

## 📋 Recursos Disponíveis

### 🔐 **Autenticação**
- ✅ Teste de API Key - \`GET /api/auth/test\`

### 📞 **Mensagens por Número**
- ✅ Envio de texto - \`POST /api/messages/send\`
- ✅ Envio de mídia com upload - \`POST /api/messages/send-media\` 
- ✅ Resposta com citação - \`POST /api/messages/reply\`

### 📱 **Mensagens via URL**
- ✅ Envio de texto - \`POST /api/conversation/send-text\`
- ✅ Envio de imagem via URL - \`POST /api/conversation/send-image\`
- ✅ Envio de áudio via URL - \`POST /api/conversation/send-audio\`
- ✅ Envio de vídeo via URL - \`POST /api/conversation/send-video\`
- ✅ Envio de documento via URL - \`POST /api/conversation/send-document\`
- ✅ Marcar como lida - \`POST /api/conversation/mark-read\`
- ✅ Obter dados da conversa - \`GET /api/conversation/:id\`

### 📤 **Upload Direto**
- ✅ Upload de imagem - \`POST /api/conversation/upload-image\`
- ✅ Upload de áudio - \`POST /api/conversation/upload-audio\`
- ✅ Upload de vídeo - \`POST /api/conversation/upload-video\`
- ✅ Upload de documento - \`POST /api/conversation/upload-document\`

### 🎯 **Funcionalidades**
- ✅ **16 endpoints completos** para todas as necessidades
- ✅ **Multi-instâncias** - Escolha automática ou específica por ID/nome
- ✅ **Autenticação** segura por API Key
- ✅ **Upload e URLs** - Duas formas de enviar mídia
- ✅ **Conversation-based** - APIs baseadas em conversation_id
- ✅ **Webhook-ready** - Compatível com custom agents

## 🔗 URLs

- **API Produção:** https://zionic-api-production.up.railway.app
- **Documentação:** https://zionic-api-docs.up.railway.app
- **Painel Zionic:** https://wise-app.netlify.app

---
*Powered by Zionic - WhatsApp Business Solutions*
      `,
      contact: {
        name: 'Suporte Zionic',
        email: 'suporte@zionic.com'
      }
    },
    servers: [
      {
        url: 'https://zionic-api-production.up.railway.app',
        description: 'Servidor de Produção'
      },
      {
        url: 'http://localhost:3001',
        description: 'Servidor Local (Dev)'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'API Key',
          description: 'Insira sua API Key no formato: zio_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        }
      },
      schemas: {
        ConversationId: {
          type: 'object',
          required: ['conversation_id'],
          properties: {
            conversation_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da conversa no sistema',
              example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
            }
          }
        },
        MessageResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Mensagem enviada com sucesso'
            },
            data: {
              type: 'object',
              properties: {
                messageId: {
                  type: 'string',
                  description: 'ID da mensagem no banco de dados'
                },
                conversationId: {
                  type: 'string',
                  description: 'ID da conversa'
                },
                contactId: {
                  type: 'string',
                  description: 'ID do contato'
                },
                instanceId: {
                  type: 'string',
                  description: 'ID da instância WhatsApp'
                },
                instanceName: {
                  type: 'string',
                  description: 'Nome da instância WhatsApp'
                },
                evolutionId: {
                  type: 'string',
                  description: 'ID da mensagem no WhatsApp'
                },
                isNewContact: {
                  type: 'boolean',
                  description: 'Se é um novo contato criado'
                },
                isNewConversation: {
                  type: 'boolean',
                  description: 'Se é uma nova conversa criada'
                },
                number: {
                  type: 'string',
                  description: 'Número limpo usado'
                },
                content: {
                  type: 'string',
                  description: 'Conteúdo da mensagem enviada'
                },
                sentAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Timestamp do envio'
                },
                type: {
                  type: 'string',
                  enum: ['text', 'image', 'audio', 'video', 'document'],
                  description: 'Tipo da mensagem'
                },
                company: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: 'ID da empresa'
                    },
                    name: {
                      type: 'string',
                      description: 'Nome da empresa'
                    }
                  }
                },
                apiKey: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Nome da API Key'
                    },
                    used_at: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Último uso da API Key'
                    }
                  }
                }
              }
            }
          }
        },
        MediaResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Mídia enviada com sucesso'
            },
            data: {
              type: 'object',
              properties: {
                messageId: {
                  type: 'string',
                  description: 'ID da mensagem no banco de dados'
                },
                conversationId: {
                  type: 'string',
                  description: 'ID da conversa'
                },
                contactId: {
                  type: 'string',
                  description: 'ID do contato'
                },
                instanceId: {
                  type: 'string',
                  description: 'ID da instância WhatsApp'
                },
                instanceName: {
                  type: 'string',
                  description: 'Nome da instância WhatsApp'
                },
                evolutionId: {
                  type: 'string',
                  description: 'ID da mensagem no WhatsApp'
                },
                mediaType: {
                  type: 'string',
                  enum: ['image', 'audio', 'video', 'document'],
                  description: 'Tipo de mídia enviada'
                },
                fileName: {
                  type: 'string',
                  description: 'Nome do arquivo original'
                },
                fileSize: {
                  type: 'string',
                  description: 'Tamanho do arquivo'
                },
                caption: {
                  type: 'string',
                  description: 'Legenda do arquivo (se fornecida)'
                },
                storageUrl: {
                  type: 'string',
                  description: 'URL do arquivo armazenado (para uploads)'
                },
                number: {
                  type: 'string',
                  description: 'Número do destinatário'
                },
                sentAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Timestamp do envio'
                },
                type: {
                  type: 'string',
                  description: 'Tipo da mensagem (igual a mediaType)'
                },
                company: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: 'ID da empresa'
                    },
                    name: {
                      type: 'string',
                      description: 'Nome da empresa'
                    }
                  }
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Descrição do erro'
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './index.js'] // Paths para os arquivos com documentação
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Customizar Swagger UI
const swaggerUiOptions = {
  customCss: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    /* Theme Variables - Auto Dark Mode */
    :root {
      --zionic-primary: #3B82F6;
      --zionic-success: #10B981;
      --zionic-danger: #EF4444;
      --zionic-warning: #F59E0B;
      --zionic-bg-primary: #ffffff;
      --zionic-bg-secondary: #f9fafb;
      --zionic-text-primary: #111827;
      --zionic-text-secondary: #4b5563;
      --zionic-border: #e5e7eb;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --zionic-bg-primary: #1e293b;
        --zionic-bg-secondary: #0f172a;
        --zionic-text-primary: #f1f5f9;
        --zionic-text-secondary: #cbd5e1;
        --zionic-border: #334155;
      }
    }

    /* Base Styling */
    body, html {
      background: var(--zionic-bg-secondary) !important;
      font-family: 'Inter', sans-serif !important;
    }
    
    .swagger-ui {
      font-family: 'Inter', sans-serif !important;
      background: var(--zionic-bg-secondary) !important;
      color: var(--zionic-text-primary) !important;
    }

    /* Hide Default Topbar */
    .swagger-ui .topbar { display: none !important; }

    /* Custom Header */
    .swagger-ui::before {
      content: "";
      display: block;
      height: 80px;
      background: linear-gradient(135deg, var(--zionic-primary), #6366f1);
      margin: 0 -20px 30px -20px;
      position: relative;
    }
    
    .swagger-ui::after {
      content: "🚀 Zionic API - Sandbox Interativo";
      position: absolute;
      top: 25px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      z-index: 1000;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    /* Info Section */
    .swagger-ui .info {
      background: var(--zionic-bg-primary) !important;
      border-radius: 16px !important;
      padding: 2rem !important;
      margin: 2rem 0 !important;
      border: 1px solid var(--zionic-border) !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    }
    
    .swagger-ui .info .title {
      background: linear-gradient(135deg, var(--zionic-primary), #6366f1) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
      font-size: 2.5rem !important;
      font-weight: 700 !important;
      margin-bottom: 1rem !important;
    }
    
    .swagger-ui .info .description {
      color: var(--zionic-text-secondary) !important;
      font-size: 1rem !important;
      line-height: 1.7 !important;
    }

    /* Scheme Container */
    .swagger-ui .scheme-container {
      background: var(--zionic-bg-primary) !important;
      border: 1px solid var(--zionic-border) !important;
      border-radius: 12px !important;
      padding: 1.5rem !important;
      margin: 1.5rem 0 !important;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
    }

    /* Auth */
    .swagger-ui .auth-wrapper {
      background: var(--zionic-bg-primary) !important;
      border-radius: 12px !important;
      padding: 1.5rem !important;
      border: 1px solid var(--zionic-border) !important;
      margin: 2rem 0 !important;
    }
    
    .swagger-ui .btn.authorize {
      background: linear-gradient(135deg, var(--zionic-primary), #6366f1) !important;
      border: none !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
      padding: 0.75rem 1.5rem !important;
      transition: all 0.2s !important;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2) !important;
    }
    
    .swagger-ui .btn.authorize:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3) !important;
    }

    /* Operations */
    .swagger-ui .opblock {
      background: var(--zionic-bg-primary) !important;
      border-radius: 12px !important;
      border: 1px solid var(--zionic-border) !important;
      margin: 1.5rem 0 !important;
      overflow: hidden !important;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
    }

    .swagger-ui .opblock.opblock-post {
      border-left: 4px solid var(--zionic-success) !important;
    }
    .swagger-ui .opblock.opblock-get {
      border-left: 4px solid var(--zionic-primary) !important;
    }
    .swagger-ui .opblock.opblock-put {
      border-left: 4px solid var(--zionic-warning) !important;
    }
    .swagger-ui .opblock.opblock-delete {
      border-left: 4px solid var(--zionic-danger) !important;
    }

    .swagger-ui .opblock .opblock-summary {
      background: var(--zionic-bg-secondary) !important;
      border: none !important;
      padding: 1.5rem !important;
    }

    /* HTTP Methods */
    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background: var(--zionic-success) !important;
      border-radius: 6px !important;
      font-weight: 600 !important;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: var(--zionic-primary) !important;
      border-radius: 6px !important;
      font-weight: 600 !important;
    }
    .swagger-ui .opblock.opblock-put .opblock-summary-method {
      background: var(--zionic-warning) !important;
      border-radius: 6px !important;
      font-weight: 600 !important;
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background: var(--zionic-danger) !important;
      border-radius: 6px !important;
      font-weight: 600 !important;
    }

    /* Buttons */
    .swagger-ui .btn {
      border-radius: 8px !important;
      font-weight: 500 !important;
      font-family: 'Inter', sans-serif !important;
      transition: all 0.2s !important;
      border: none !important;
    }

    .swagger-ui .btn.execute {
      background: linear-gradient(135deg, var(--zionic-primary), #6366f1) !important;
      color: white !important;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2) !important;
    }
    .swagger-ui .btn.execute:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3) !important;
    }

    .swagger-ui .btn.try-out__btn {
      background: var(--zionic-success) !important;
      color: white !important;
    }

    .swagger-ui .btn.cancel {
      background: var(--zionic-danger) !important;
      color: white !important;
    }

    /* Inputs */
    .swagger-ui input, .swagger-ui textarea, .swagger-ui select {
      background: var(--zionic-bg-primary) !important;
      border: 1px solid var(--zionic-border) !important;
      border-radius: 6px !important;
      color: var(--zionic-text-primary) !important;
      font-family: 'Inter', sans-serif !important;
    }

    .swagger-ui input:focus, .swagger-ui textarea:focus {
      border-color: var(--zionic-primary) !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }

    /* Parameters */
    .swagger-ui .parameters-container {
      background: var(--zionic-bg-secondary) !important;
      border-radius: 8px !important;
      padding: 1.5rem !important;
    }

    /* Responses */
    .swagger-ui .responses-wrapper {
      background: var(--zionic-bg-secondary) !important;
      border-radius: 8px !important;
      padding: 1.5rem !important;
    }

    .swagger-ui .response-col_status {
      font-weight: 600 !important;
    }

    /* Code blocks */
    .swagger-ui .highlight-code {
      background: var(--zionic-bg-secondary) !important;
      border: 1px solid var(--zionic-border) !important;
      border-radius: 6px !important;
    }

    /* Custom scrollbar */
    .swagger-ui ::-webkit-scrollbar {
      width: 6px !important;
    }
    .swagger-ui ::-webkit-scrollbar-track {
      background: var(--zionic-bg-secondary) !important;
    }
    .swagger-ui ::-webkit-scrollbar-thumb {
      background: var(--zionic-border) !important;
      border-radius: 3px !important;
    }
  `,
  customSiteTitle: 'Zionic API - Sandbox Interativo',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
};

// Documentar rotas inline (já que não temos arquivos separados ainda)

/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     summary: 🔐 Testar Autenticação
 *     description: Endpoint para verificar se sua API Key está funcionando corretamente
 *     tags:
 *       - 🔐 Autenticação
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
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
 *                     last_used_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: API Key inválida ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/conversation/send-text:
 *   post:
 *     summary: 📝 Enviar Mensagem de Texto
 *     description: Envia uma mensagem de texto para uma conversa específica
 *     tags:
 *       - 📱 Mensagens via URL
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
 *                 maximum: 10000
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Conversa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/conversation/send-image:
 *   post:
 *     summary: 📸 Enviar Imagem via URL
 *     description: Envia uma imagem através de URL pública para uma conversa
 *     tags:
 *       - 📱 Mensagens via URL
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
 *                 example: "Aqui está a imagem solicitada!"
 *                 maxLength: 1024
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1200
 *                 minimum: 0
 *                 maximum: 10000
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: URL inválida ou parâmetros incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/conversation/send-audio:
 *   post:
 *     summary: 🎵 Enviar Áudio via URL
 *     description: Envia um arquivo de áudio através de URL pública para uma conversa
 *     tags:
 *       - 📱 Mensagens via URL
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
 *                 description: URL pública do arquivo de áudio
 *                 example: "https://exemplo.com/audio.mp3"
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1500
 *                 minimum: 0
 *                 maximum: 10000
 *     responses:
 *       200:
 *         description: Áudio enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: URL inválida ou parâmetros incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/conversation/send-video:
 *   post:
 *     summary: 🎬 Enviar Vídeo via URL
 *     description: Envia um arquivo de vídeo através de URL pública para uma conversa
 *     tags:
 *       - 📱 Mensagens via URL
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
 *                 description: URL pública do arquivo de vídeo
 *                 example: "https://exemplo.com/video.mp4"
 *               caption:
 *                 type: string
 *                 description: Legenda do vídeo (opcional)
 *                 example: "Vídeo demonstrativo!"
 *                 maxLength: 1024
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 2000
 *                 minimum: 0
 *                 maximum: 10000
 *     responses:
 *       200:
 *         description: Vídeo enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: URL inválida ou parâmetros incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/conversation/send-document:
 *   post:
 *     summary: 📄 Enviar Documento via URL
 *     description: Envia um documento através de URL pública para uma conversa
 *     tags:
 *       - 📱 Mensagens via URL
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
 *                 description: Nome do arquivo (opcional)
 *                 example: "relatorio_vendas.pdf"
 *               caption:
 *                 type: string
 *                 description: Legenda do documento (opcional)
 *                 example: "Relatório mensal de vendas"
 *                 maxLength: 1024
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1500
 *                 minimum: 0
 *                 maximum: 10000
 *     responses:
 *       200:
 *         description: Documento enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: URL inválida ou parâmetros incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/conversation/mark-read:
 *   post:
 *     summary: 👁️ Marcar Conversa como Lida
 *     description: Marca a última mensagem de uma conversa como lida no WhatsApp
 *     tags:
 *       - 📱 Mensagens via URL
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
 *                 description: ID único da conversa
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       200:
 *         description: Conversa marcada como lida com sucesso
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
 *                   example: "Conversa marcada como lida"
 *                 data:
 *                   type: object
 *                   properties:
 *                     conversationId:
 *                       type: string
 *                       description: ID da conversa
 *                     contactName:
 *                       type: string
 *                       description: Nome do contato
 *                     instanceName:
 *                       type: string
 *                       description: Nome da instância WhatsApp
 *                     markedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp quando foi marcada como lida
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Conversa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/conversation/{conversation_id}:
 *   get:
 *     summary: 📋 Obter Dados da Conversa
 *     description: Retorna informações completas sobre uma conversa, incluindo contato, instância e últimas mensagens
 *     tags:
 *       - 📱 Mensagens via URL
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         description: ID único da conversa
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       200:
 *         description: Dados da conversa retornados com sucesso
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
 *                     conversation:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: ID da conversa
 *                         title:
 *                           type: string
 *                           description: Título da conversa
 *                         status:
 *                           type: string
 *                           description: Status da conversa
 *                     contact:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: Nome do contato
 *                         phone:
 *                           type: string
 *                           description: Telefone do contato
 *                         email:
 *                           type: string
 *                           description: Email do contato
 *                     instance:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: Nome da instância WhatsApp
 *                         status:
 *                           type: string
 *                           description: Status da instância
 *                     messages:
 *                       type: array
 *                       description: Últimas 20 mensagens da conversa
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: ID da mensagem
 *                           content:
 *                             type: string
 *                             description: Conteúdo da mensagem
 *                           direction:
 *                             type: string
 *                             enum: [inbound, outbound]
 *                             description: Direção da mensagem
 *                           message_type:
 *                             type: string
 *                             description: Tipo da mensagem
 *                           sent_at:
 *                             type: string
 *                             format: date-time
 *                             description: Data de envio
 *       404:
 *         description: Conversa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/conversation/upload-image:
 *   post:
 *     summary: 📤 Upload e Envio de Imagem
 *     description: Faz upload de uma imagem diretamente e envia para uma conversa
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
 *                 description: Arquivo de imagem para upload (JPG, PNG, GIF)
 *               caption:
 *                 type: string
 *                 description: Legenda da imagem (opcional)
 *                 example: "Imagem enviada via upload!"
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1200
 *                 minimum: 0
 *                 maximum: 10000
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaResponse'
 *       400:
 *         description: Arquivo inválido ou parâmetros incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/conversation/upload-audio:
 *   post:
 *     summary: 📤 Upload e Envio de Áudio
 *     description: Faz upload de um arquivo de áudio diretamente e envia para uma conversa
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
 *                 description: Arquivo de áudio para upload (MP3, OGG, WAV)
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1500
 *                 minimum: 0
 *                 maximum: 10000
 *     responses:
 *       200:
 *         description: Áudio enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaResponse'
 *       400:
 *         description: Arquivo inválido ou parâmetros incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/conversation/upload-video:
 *   post:
 *     summary: 📤 Upload e Envio de Vídeo
 *     description: Faz upload de um arquivo de vídeo diretamente e envia para uma conversa
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
 *                 description: Arquivo de vídeo para upload (MP4, AVI, MOV)
 *               caption:
 *                 type: string
 *                 description: Legenda do vídeo (opcional)
 *                 example: "Vídeo enviado via upload!"
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 2000
 *                 minimum: 0
 *                 maximum: 10000
 *     responses:
 *       200:
 *         description: Vídeo enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaResponse'
 *       400:
 *         description: Arquivo inválido ou parâmetros incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/conversation/upload-document:
 *   post:
 *     summary: 📤 Upload e Envio de Documento
 *     description: Faz upload de um documento diretamente e envia para uma conversa
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
 *                 description: Arquivo de documento para upload (PDF, DOC, XLS, etc.)
 *               caption:
 *                 type: string
 *                 description: Legenda do documento (opcional)
 *                 example: "Documento importante anexado!"
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1500
 *                 minimum: 0
 *                 maximum: 10000
 *     responses:
 *       200:
 *         description: Documento enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaResponse'
 *       400:
 *         description: Arquivo inválido ou parâmetros incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: 📱 Enviar Mensagem de Texto por Número
 *     description: Envia uma mensagem de texto diretamente para um número de telefone, criando automaticamente contato e conversa se necessário
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
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Número inválido ou parâmetros incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Instância WhatsApp não encontrada ou desconectada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/messages/send-media:
 *   post:
 *     summary: 📎 Enviar Mídia por Número
 *     description: Envia um arquivo de mídia (imagem, vídeo, áudio ou documento) para um número de telefone
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
 *     responses:
 *       200:
 *         description: Mídia enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaResponse'
 *       400:
 *         description: Arquivo ou parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Instância WhatsApp não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/messages/reply:
 *   post:
 *     summary: 💬 Responder Mensagem Específica
 *     description: Responde uma mensagem específica citando-a (reply/quote), criando uma resposta linkada à mensagem original
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
 *     responses:
 *       200:
 *         description: Resposta enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Parâmetros inválidos ou mensagem original não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Instância WhatsApp ou mensagem original não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// Rota principal
app.get('/', (req, res) => {
  res.redirect('/docs');
});

// Documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Rota para baixar a especificação OpenAPI em JSON
app.get('/api-spec.json', (req, res) => {
  res.json(swaggerSpec);
});

// Rota para baixar a especificação OpenAPI em YAML
app.get('/api-spec.yaml', (req, res) => {
  const yaml = require('js-yaml');
  res.set('Content-Type', 'text/yaml');
  res.send(yaml.dump(swaggerSpec));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Zionic API Documentation',
    version: '3.0.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🚀 Zionic API Docs rodando na porta ${port}`);
  console.log(`📚 Documentação: http://localhost:${port}/docs`);
  console.log(`📋 API Spec JSON: http://localhost:${port}/api-spec.json`);
  console.log(`📄 API Spec YAML: http://localhost:${port}/api-spec.yaml`);
}); 
