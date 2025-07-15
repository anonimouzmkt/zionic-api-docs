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
      version: '3.4.1',
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

### **Mensagens via Conversation**
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

### **Controle de Agentes** ✨ **NOVO na v3.1**
- Pausar ou atribuir agentes - \`POST /api/conversation/agent-control\`

### **Gerenciamento de Leads** 🎯 **NOVO na v3.2**
- Listar leads - \`GET /api/leads\`
- Criar lead - \`POST /api/leads\`
- Buscar lead específico - \`GET /api/leads/:id\`
- Atualizar lead - \`PUT /api/leads/:id\`
- Deletar lead - \`DELETE /api/leads/:id\`
- Mover lead entre colunas - \`POST /api/leads/:id/move\`
- Listar leads de uma coluna - \`GET /api/leads/column/:column_id\`

### **Gerenciamento de Pipelines** 📊 **NOVO na v3.2**
- Listar pipelines - \`GET /api/pipelines\`
- Buscar pipeline específico - \`GET /api/pipelines/:id\`
- Buscar pipeline padrão - \`GET /api/pipelines/default/info\`
- Listar colunas de um pipeline - \`GET /api/pipelines/:id/columns\`
- Listar todas as colunas - \`GET /api/pipelines/columns/all\`
- Estatísticas do pipeline - \`GET /api/pipelines/:id/stats\`

### **Gerenciamento de Colunas** 📋 **NOVO na v3.2**
- Listar colunas - \`GET /api/columns\`
- Buscar coluna específica - \`GET /api/columns/:id\`
- Listar leads de uma coluna - \`GET /api/columns/:id/leads\`

### **Gerenciamento de Agendamentos** 📅 **ATUALIZADO na v3.4.1**
- Verificar disponibilidade - \`GET /api/calendar/availability/:date\`
- Agendar horário - \`POST /api/calendar/schedule\`
- Listar agendamentos - \`GET /api/calendar/appointments\`
- Atualizar agendamento - \`PUT /api/calendar/appointments/:id\`
- Deletar agendamento - \`DELETE /api/calendar/appointments/:id\`
- **🆕 v3.4.1**: Listar integrações Google Calendar - \`GET /api/calendar/integrations\`
- **🆕 v3.4.1**: Status de múltiplas integrações - \`GET /api/calendar/integrations/status\`
- **🆕 v3.4.1**: Suporte completo a múltiplas agendas Google Calendar
- **🆕 v3.4.1**: Sincronização simultânea de várias integrações por empresa

**⏰ TIMEZONE - Como Agendar no Horário Correto:**
- A API usa automaticamente o timezone configurado na empresa/usuário
- Se não configurado, usa timezone padrão do Brasil (America/Sao_Paulo - GMT-3)
- Para agendar às 10h no horário local, envie: \`"2024-01-15T10:00:00"\`
- A API converte automaticamente considerando seu timezone
- Formatos aceitos: ISO 8601 com ou sem timezone explícito
- **TODOS os endpoints de calendário respeitam e retornam o timezone configurado**
- **GET /availability/:date** - Considera horários no timezone correto
- **POST /schedule** - Cria agendamentos considerando timezone da empresa
- **GET /appointments** - Filtra datas no timezone correto  
- **PUT /appointments/:id** - Atualiza considerando timezone
- **DELETE /appointments/:id** - Remove considerando timezone
- **Resposta JSON sempre inclui campo "timezone" para confirmação**

### **Mensagens de Custom Agents** 🤖 **NOVO na v3.4**
- Marcação visual diferenciada - parâmetro \`sent_via_agent\`
- Identificação automática de mensagens via webhooks/automações
- Badge roxo "Enviado via Custom Agent" no chat
- Integração com N8N e sistemas externos

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
    data-url="https://docs.zionic.app/api-spec.json"
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
    version: '3.4.1',
    timestamp: new Date().toISOString(),
    ui: 'Scalar API Reference',
    endpoints: 37,
    baseUrl: 'https://api.zionic.app',
    new_features: [
      'Multiple Google Calendar integrations per company',
      'GET /api/calendar/integrations - List all calendar integrations',
      'GET /api/calendar/integrations/status - Quick integration status check',
      'Enhanced sync support for multiple calendars simultaneously'
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
 *     description: Envia uma imagem através de URL pública para uma conversa
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
 *     summary: Criar Lead
 *     description: Cria um novo lead no sistema usando a função unificada do banco
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
 *                 enum: [low, medium, high, urgent]
 *                 example: "high"
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
 *     summary: Mover Lead Entre Colunas
 *     description: Move um lead para uma coluna específica de um pipeline
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
 *             required:
 *               - column_id
 *             properties:
 *               column_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID da coluna de destino
 *               pipeline_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID do pipeline (opcional, será derivado da coluna)
 *               position:
 *                 type: integer
 *                 description: Posição na coluna (opcional)
 *     responses:
 *       200:
 *         description: Lead movido com sucesso
 *       404:
 *         description: Lead ou coluna não encontrada
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
 * /api/calendar/availability/{date}:
 *   get:
 *     summary: Verificar Disponibilidade
 *     description: |
 *       **📅 NOVO na v3.3** - Verifica a disponibilidade de horários para uma data específica.
 *       
 *       **Funcionalidades:**
 *       - Retorna se o dia está completamente livre
 *       - Lista horários ocupados com detalhes do agendamento
 *       - Permite filtrar por horário de início e fim
 *       - Integração automática com Google Calendar (se configurado)
 *       
 *       **Parâmetros de Consulta Opcionais:**
 *       - `start_hour`: Horário de início para verificação (formato HH:MM)
 *       - `end_hour`: Horário de fim para verificação (formato HH:MM)
 *       - `include_details`: Se deve incluir detalhes dos agendamentos (true/false)
 *     tags:
 *       - 📅 Calendar Management (v3.3)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data para verificação de disponibilidade (formato YYYY-MM-DD)
 *         example: "2024-01-15"
 *       - in: query
 *         name: start_hour
 *         schema:
 *           type: string
 *           pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
 *         description: Horário de início para verificação (formato HH:MM)
 *         example: "09:00"
 *       - in: query
 *         name: end_hour
 *         schema:
 *           type: string
 *           pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
 *         description: Horário de fim para verificação (formato HH:MM)
 *         example: "18:00"
 *       - in: query
 *         name: include_details
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Se deve incluir detalhes dos agendamentos
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
 *                 summary: Dia Completamente Livre
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
 *       **📅 NOVO na v3.3** - Cria um novo agendamento com validações automáticas e integração opcional com Google Calendar.
 *       
 *       **Funcionalidades:**
 *       - Validação automática de conflitos de horário
 *       - Integração opcional com leads existentes
 *       - Criação automática de Google Meet (se integração ativa)
 *       - Sincronização bidirecional com Google Calendar
 *       - Validações de horário de negócios
 *       - Suporte a agendamentos recorrentes (futuro)
 *       
 *       **Regras de Negócio:**
 *       - Não permite agendamentos em conflito
 *       - Data/hora deve ser no futuro
 *       - Duração mínima de 15 minutos
 *       - Máximo de 8 horas por agendamento
 *     tags:
 *       - 📅 Calendar Management (v3.3)
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
 *                 description: ID do lead associado (opcional)
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
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
 *                 create_google_meet: true
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
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
 *                     google_calendar:
 *                       type: object
 *                       properties:
 *                         synced:
 *                           type: boolean
 *                         event_id:
 *                           type: string
 *                         meet_link:
 *                           type: string
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
 *       **📅 NOVO na v3.3** - Lista agendamentos com filtros avançados e paginação.
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
 *       - 📅 Calendar Management (v3.3)
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
 *       **📅 NOVO na v3.3** - Atualiza um agendamento existente com validações e sincronização automática.
 *       
 *       **Funcionalidades:**
 *       - Validação de conflitos ao alterar horários
 *       - Sincronização automática com Google Calendar
 *       - Atualização automática de Google Meet
 *       - Validações de permissão e integridade
 *       - Histórico de alterações (auditoria)
 *       
 *       **Regras de Negócio:**
 *       - Não permite conflitos com outros agendamentos
 *       - Novos horários devem ser no futuro
 *       - Apenas agendamentos não concluídos podem ser alterados
 *       - Notificações automáticas aos participantes
 *     tags:
 *       - 📅 Calendar Management (v3.3)
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
 *       - 📅 Calendar Management (v3.3)
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
  console.log(`📊 Endpoints: 35 endpoints organizados`);
  console.log(`🌐 Base URL: https://api.zionic.app`);
  console.log(`🖼️ Logo: Zionic oficial integrado`);
  console.log(`📱 Sidebar: Mensagens + Agent Control + CRM (organizado)`);
  console.log(`🎯 Novos: Leads, Pipelines, Columns e Calendar Management (v3.3)`);
  console.log(`🤖 v3.4: Custom Agent Messages com visual diferenciado`);
  console.log(`✨ Status: Design clean, detalhado e moderno`);
  console.log('');
  console.log('⚡ ═══════════════════════════════════════════════');
}); 
