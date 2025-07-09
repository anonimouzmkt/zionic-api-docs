const express = require('express');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const { apiReference } = require('@scalar/api-reference');

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
      version: '3.0.0',
      description: `
# 📱 API Zionic - WhatsApp Business Integração

**Plataforma completa para automação de WhatsApp Business**

## 🌟 **Visão Geral**

A API Zionic oferece integração robusta com WhatsApp Business, permitindo envio de mensagens, mídia e automação completa de conversas.

## 📋 **Recursos Disponíveis**

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
- ✅ Obter dados da conversa - \`GET /api/conversation/:conversation_id\`

### 📤 **Upload Direto de Arquivos**
- ✅ Upload de imagem - \`POST /api/conversation/upload-image\`
- ✅ Upload de áudio - \`POST /api/conversation/upload-audio\`
- ✅ Upload de vídeo - \`POST /api/conversation/upload-video\`
- ✅ Upload de documento - \`POST /api/conversation/upload-document\`

## 🔑 **Autenticação**

Todas as rotas requerem autenticação via **Bearer Token**:

\`\`\`
Authorization: Bearer zio_sua_api_key_aqui
\`\`\`

## 🚀 **Base URL**

\`\`\`
https://api.zionic.com
\`\`\`

## 📞 **Suporte**

- **Website:** https://zionic.com
- **Email:** suporte@zionic.com
- **Documentação:** https://docs.zionic.com
      `,
      contact: {
        name: 'Zionic Support',
        url: 'https://zionic.com',
        email: 'suporte@zionic.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://api.zionic.com',
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
    ]
  },
  apis: ['./index.js'] // Aponta para este arquivo
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Configuração do Scalar com tema customizado
const scalarConfig = {
  theme: 'purple',
  customCss: `
    :root {
      --scalar-background-1: #0f172a;
      --scalar-background-2: #1e293b;
      --scalar-background-3: #334155;
      --scalar-color-1: #f1f5f9;
      --scalar-color-2: #cbd5e1;
      --scalar-color-3: #94a3b8;
      --scalar-accent: #3b82f6;
      --scalar-border-color: #475569;
    }
    
    .scalar-app {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    .scalar-api-reference {
      --scalar-radius: 8px;
      --scalar-radius-lg: 12px;
    }
  `,
  searchHotKey: 'k',
  showSidebar: true,
  hideDownloadButton: false,
  hideTestRequestButton: false,
  hiddenClients: [],
  layout: 'modern'
};

// Rota principal para documentação com Scalar
app.get('/', (req, res) => {
  const html = apiReference({
    spec: {
      content: swaggerSpec,
    },
    configuration: scalarConfig,
  });
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Rota para a documentação explícita
app.get('/docs', (req, res) => {
  const html = apiReference({
    spec: {
      content: swaggerSpec,
    },
    configuration: scalarConfig,
  });
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Zionic API Documentation',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    ui: 'Scalar API Reference'
  });
});

/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     summary: 🔐 Testar API Key
 *     description: Verifica se a API Key fornecida é válida e retorna informações sobre a empresa e chave
 *     tags:
 *       - 🔐 Autenticação
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
 *       400:
 *         description: Arquivo ou parâmetros inválidos
 *       404:
 *         description: Instância WhatsApp não encontrada
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
 *       400:
 *         description: Parâmetros inválidos ou mensagem original não encontrada
 *       404:
 *         description: Instância WhatsApp ou mensagem original não encontrada
 */

app.listen(port, () => {
  console.log(`🚀 Zionic API Docs (Scalar) rodando na porta ${port}`);
  console.log(`📚 Documentação moderna: http://localhost:${port}`);
  console.log(`🎨 Interface: Scalar API Reference`);
}); 
