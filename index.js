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
      version: '3.0.0',
      description: `
# API Zionic - WhatsApp Business Integração

**Plataforma completa para automação de WhatsApp Business**

## 🌟 **Visão Geral**

A API Zionic oferece integração robusta com WhatsApp Business, permitindo envio de mensagens, mídia e automação completa de conversas.

## **Recursos Disponíveis**

### **Autenticação**
- Teste de API Key - \`GET /api/auth/test\`

### **Mensagens por Número**
- Envio de texto - \`POST /api/messages/send\`
- Envio de mídia com upload - \`POST /api/messages/send-media\` 
- Resposta com citação - \`POST /api/messages/reply\`

### **Mensagens via Conversa**
- Envio de texto - \`POST /api/conversation/send-text\`
- Envio de imagem via URL - \`POST /api/conversation/send-image\`
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
    
    /* Logo Zionic SVG baseado no ZionixLogo.tsx */
    .zionic-logo {
      width: 32px;
      height: 32px;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .zionic-logo-circle {
      width: 16px;
      height: 16px;
      background: var(--scalar-color-1);
      border-radius: 50%;
      position: absolute;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 2;
    }
    
    .zionic-logo-ring {
      width: 26px;
      height: 26px;
      border: 1px solid var(--scalar-color-1);
      border-radius: 50%;
      position: absolute;
      opacity: 0.6;
      animation: zionic-rotate 4s linear infinite;
    }
    
    .zionic-logo-ring:nth-child(3) {
      animation-duration: 6s;
      animation-direction: reverse;
    }
    
    @keyframes zionic-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    /* Header com logo personalizado */
    .scalar-api-reference__header {
      background: var(--scalar-background-sidebar);
      border-bottom: 1px solid var(--scalar-border-color);
      backdrop-filter: blur(20px);
      box-shadow: var(--scalar-shadow-sm);
      padding: 1.5rem 2rem;
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
    
         /* Melhor espaçamento e organização */
     .scalar-api-reference__content {
       background: var(--scalar-background-2);
       padding: 2rem;
     }
     
     .scalar-operation {
       margin-bottom: 3rem;
       background: var(--scalar-background-card);
       border: 1px solid var(--scalar-border-color);
       border-radius: var(--scalar-radius-lg);
       box-shadow: var(--scalar-shadow-md);
       backdrop-filter: blur(16px);
       overflow: hidden;
     }
     
     .scalar-operation__header {
       padding: 1.5rem 2rem;
       border-bottom: 1px solid var(--scalar-border-color);
       background: linear-gradient(135deg, var(--scalar-background-1), var(--scalar-background-2));
     }
     
     .scalar-operation__content {
       padding: 2rem;
     }
    
         /* Sidebar styling (igual ao app principal) */
     .scalar-api-reference__sidebar {
       background: var(--scalar-background-sidebar);
       border-right: 1px solid var(--scalar-border-color);
       box-shadow: var(--scalar-shadow-xl);
       backdrop-filter: blur(20px);
       padding: 1.5rem 1rem;
       width: 320px;
       min-width: 320px;
     }
     
     /* Tags de grupo mais organizadas */
     .scalar-sidebar-group {
       margin-bottom: 2rem;
     }
     
     .scalar-sidebar-group-title {
       font-size: 0.875rem;
       font-weight: 600;
       color: var(--scalar-color-2);
       text-transform: uppercase;
       letter-spacing: 0.05em;
       margin-bottom: 0.75rem;
       padding: 0 0.75rem;
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
    
    /* Navigation improvements */
    .scalar-sidebar-item {
      border-radius: var(--scalar-radius);
      transition: all 0.3s ease;
      margin: 0.125rem 0;
    }
    
    .scalar-sidebar-item:hover {
      background: rgba(59, 130, 246, 0.1);
      transform: translateX(4px);
    }
    
    .scalar-sidebar-item.active {
      background: linear-gradient(135deg, var(--scalar-color-primary), var(--scalar-color-secondary));
      color: white;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
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
    data-url="/api-spec.json"
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
      console.log('📊 Endpoints: 16 endpoints documentados');
      console.log('🌐 Base URL: https://api.zionic.app');
      
      // Adicionar logo personalizado após carregamento
      setTimeout(() => {
        const header = document.querySelector('.scalar-api-reference__header');
        if (header) {
          const logoContainer = document.createElement('div');
          logoContainer.className = 'scalar-logo';
          logoContainer.innerHTML = \`
            <div class="zionic-logo">
              <div class="zionic-logo-ring"></div>
              <div class="zionic-logo-ring"></div>
              <div class="zionic-logo-circle"></div>
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
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    ui: 'Scalar API Reference',
    endpoints: 16,
    baseUrl: 'https://api.zionic.app'
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
 *     summary: Enviar Mídia por Número
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
 *     summary: Responder Mensagem Específica
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

/**
 * @swagger
 * /api/conversation/send-text:
 *   post:
 *     summary: Enviar Texto via Conversa
 *     description: Envia uma mensagem de texto para uma conversa existente usando conversation_id
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
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1000
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso
 *       404:
 *         description: Conversa não encontrada
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
 *                 example: "Imagem importante!"
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1200
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 *       404:
 *         description: Conversa não encontrada
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
 *                 description: URL pública do áudio
 *                 example: "https://exemplo.com/audio.mp3"
 *               delay:
 *                 type: integer
 *                 description: Delay em milissegundos antes do envio
 *                 example: 1500
 *     responses:
 *       200:
 *         description: Áudio enviado com sucesso
 *       404:
 *         description: Conversa não encontrada
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
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               video_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://exemplo.com/video.mp4"
 *               caption:
 *                 type: string
 *                 example: "Vídeo importante!"
 *               delay:
 *                 type: integer
 *                 example: 2000
 *     responses:
 *       200:
 *         description: Vídeo enviado com sucesso
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
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               document_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://exemplo.com/documento.pdf"
 *               filename:
 *                 type: string
 *                 example: "documento.pdf"
 *               caption:
 *                 type: string
 *                 example: "Documento importante!"
 *     responses:
 *       200:
 *         description: Documento enviado com sucesso
 */

/**
 * @swagger
 * /api/conversation/mark-read:
 *   post:
 *     summary: 👁️ Marcar Conversa como Lida
 *     description: Marca as mensagens de uma conversa como lidas
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
 *       - 📱 Mensagens via URL
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
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem para upload (JPG, PNG, GIF)
 *               caption:
 *                 type: string
 *                 example: "Imagem enviada via upload!"
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
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
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de áudio para upload (MP3, OGG, WAV)
 *     responses:
 *       200:
 *         description: Áudio enviado com sucesso
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
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de vídeo para upload (MP4, AVI, MOV)
 *               caption:
 *                 type: string
 *                 example: "Vídeo enviado via upload!"
 *     responses:
 *       200:
 *         description: Vídeo enviado com sucesso
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
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de documento para upload (PDF, DOC, XLS, etc.)
 *               caption:
 *                 type: string
 *                 example: "Documento importante anexado!"
 *     responses:
 *       200:
 *         description: Documento enviado com sucesso
 */

app.listen(port, () => {
  console.log('');
  console.log('⚡ ═══════════════════════════════════════════════');
  console.log('   ZIONIC API DOCUMENTATION - PROFESSIONAL EDITION');
  console.log('⚡ ═══════════════════════════════════════════════');
  console.log('');
  console.log(`📖 Documentação: http://localhost:${port}`);
  console.log(`📄 API Spec JSON: http://localhost:${port}/api-spec.json`);
  console.log(`📝 API Spec YAML: http://localhost:${port}/api-spec.yaml`);
  console.log(`💚 Health Check: http://localhost:${port}/health`);
  console.log('');
  console.log(`🎨 Interface: Scalar API Reference (Zionic Design)`);
  console.log(`📊 Endpoints: 16 endpoints completos`);
  console.log(`🌐 Base URL: https://api.zionic.app`);
  console.log(`✨ Status: Design profissional e organizado`);
  console.log('');
  console.log('⚡ ═══════════════════════════════════════════════');
}); 
