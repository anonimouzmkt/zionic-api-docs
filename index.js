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

- ✅ Envio de texto, imagem, áudio, vídeo, documento
- ✅ Upload direto de arquivos ou via URL
- ✅ Marcar mensagens como lidas
- ✅ APIs baseadas em \`conversation_id\`
- ✅ Autenticação por API Key
- ✅ Suporte completo a mídia

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
                contactName: {
                  type: 'string',
                  description: 'Nome do contato'
                },
                instanceName: {
                  type: 'string',
                  description: 'Nome da instância WhatsApp'
                },
                evolutionId: {
                  type: 'string',
                  description: 'ID da mensagem no WhatsApp'
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
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #1f2937; font-size: 2.5rem; }
    .swagger-ui .info .description { font-size: 1rem; line-height: 1.6; }
    .swagger-ui .scheme-container { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; }
    .swagger-ui .auth-wrapper { margin: 2rem 0; }
    .swagger-ui .btn.authorize { background: #3b82f6; border-color: #3b82f6; }
    .swagger-ui .btn.authorize:hover { background: #2563eb; border-color: #2563eb; }
    .swagger-ui .response-col_status { font-weight: bold; }
    .swagger-ui .opblock.opblock-post { border-color: #10b981; }
    .swagger-ui .opblock.opblock-post .opblock-summary { border-color: #10b981; }
    .swagger-ui .opblock.opblock-get { border-color: #3b82f6; }
    .swagger-ui .opblock.opblock-get .opblock-summary { border-color: #3b82f6; }
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
