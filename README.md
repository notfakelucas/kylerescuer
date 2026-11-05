# Kyle Rescuer - Complete Website Mirror (All Versions & Pages)

Mirror completo, estático e independente de **todas as páginas** do ecossistema **Kyle Rescuer** (`https://donate.kylerescuer.org`), incluindo todas as versões do funil de doação, landing pages, página de agradecimento, políticas institucionais e a **VSL (Vídeo) totalmente hospedada e reproduzida localmente**.

🔗 **Repositório GitHub**: [https://github.com/notfakelucas/kylerescuer](https://github.com/notfakelucas/kylerescuer)

---

## 🎬 VSL 100% Auto-hospedada (Self-Hosted)

A página não depende mais de serviços externos (VTurb / ConverteAI) para rodar o vídeo.
* **Arquivo de vídeo local:** `vsl-kylerescuer.mp4` (720p HD, ~26.6 MB)
* **Player VSL personalizado:** `vsl-player.js`
  * Autoplay inteligente com banner pulsante *"SEU VÍDEO JÁ COMEÇOU! CLIQUE PARA OUVIR"* (padrão de alta conversão de VSL).
  * Ao clicar no vídeo, ativa o áudio e reinicia do início com som alto e nítido.
  * Controles completos: Play/Pause, barra de progresso, volume e tela cheia.
  * Fallback nativo em HTML5 nas tags `<video>` caso o JavaScript esteja desativado.

---

## 📑 Todas as Páginas Incluídas

| Caminho | Descrição |
|---|---|
| `/` (`index.html`) | Landing page principal oficial do domínio `donate.kylerescuer.org` |
| `/v2/` (`v2/index.html`) | Funil de doação - Versão 2 |
| `/v3/` (`v3/index.html`) | Funil de doação - Versão 3 |
| `/v4/` (`v4/index.html`) | Funil de doação - Versão 4 ("Help Every Month and Keep More Than 400 Animals Standing") |
| `/v5/` (`v5/index.html`) | Funil de doação - Versão 5 ("Donate and Help Kyle Save More Than 400 Animals") |
| `/v6/` (`v6/index.html`) | Funil de doação - Versão 6 ("We save one life at a time") |
| `/v7/` (`v7/index.html`) | Funil de doação - Versão 7 |
| `/v8/` (`v8/index.html`) | Funil de doação - Versão 8 |
| `/thank-you/` (`thank-you/index.html`) | Página de confirmação e agradecimento pós-doação |
| `/privacy-policy/` (`privacy-policy/index.html`) | Política de Privacidade |
| `/terms-and-conditions/` (`terms-and-conditions/index.html`) | Termos e Condições |
| `/cookie-policy/` (`cookie-policy/index.html`) | Política de Cookies |
| `/donation-policy/` (`donation-policy/index.html`) | Política de Doações |
| `/refund-policy/` (`refund-policy/index.html`) | Política de Cancelamento e Reembolso |
| `/kylerescuer-links/` (`kylerescuer-links/index.html`) | Página central de links (`kylerescuer.org`) |

---

## 📁 Estrutura de Arquivos e Assets

```
├── index.html                   # Landing page principal
├── v2/index.html                # Versão 2
├── v3/index.html                # Versão 3
├── v4/index.html                # Versão 4
├── v5/index.html                # Versão 5
├── v6/index.html                # Versão 6
├── v7/index.html                # Versão 7
├── v8/index.html                # Versão 8
├── thank-you/index.html         # Página de Agradecimento
├── privacy-policy/index.html    # Política de Privacidade
├── terms-and-conditions/index.html # Termos e Condições
├── cookie-policy/index.html     # Política de Cookies
├── donation-policy/index.html   # Política de Doações
├── refund-policy/index.html     # Política de Reembolso
├── kylerescuer-links/index.html # Página de links (kylerescuer.org)
│
├── vsl-kylerescuer.mp4          # Vídeo da VSL (720p HD, 01:50)
├── vsl-player.js                # Player VSL auto-hospedado com autoplay e un-mute
│
├── _next/                       # Bundles Next.js
│   └── static/
│       ├── css/                 # Estilos Tailwind CSS compilados
│       ├── chunks/              # Código dos componentes React, checkout e lógica
│       └── media/               # Fontes web WOFF2 (Inter)
│
├── caio/                        # Mídias e fotos
│   ├── abrigos/                 # Fotos dos abrigos parceiros
│   ├── historia/                # Fotos da história do Kyle / Caio
│   ├── depoimentos/             # Depoimentos dos voluntários
│   └── vsl-poster*.webp         # Capas/pôsteres de vídeo
│
├── susan/img/                   # Galeria de fotos de resgate animal
├── documentos/                  # Documentos comprobatórios (EIN IRS)
├── candid.svg                   # Selo de transparência Candid / GuideStar
├── charity.png                  # Selo Charity Navigator
├── favicon.ico                  # Favicon original
└── robots.txt                   # Arquivo de robots
```

---

## 🚀 Como Executar Localmente

Você pode abrir qualquer página localmente com qualquer servidor HTTP estático:

### Com Python 3
```bash
python3 -m http.server 8000
```
Navegue para:
- [http://localhost:8000](http://localhost:8000) (Home)
- [http://localhost:8000/v5/](http://localhost:8000/v5/) (Versão 5)

---

## 💳 Gateway de Pagamento Integrado (XXPay Connect)

O checkout foi configurado para utilizar a **API XXPay Connect** com suporte completo a **PayPal e Cartões de Crédito/Débito**:

* **Base URL:** `https://api.xxpayconnect.com/api/v1/public`
* **Credenciais ativas:**
  * Client ID: `xxc_n6ahpk3i8zocyguimy5wsbvezkkb`
  * Client Secret: `xxs_ewDGC8BnsmL0ICYDjSIwkn09r1imZmHYcbzTdMT2`
* **Moeda:** `EUR` (com conversão transparente para doadores em USD e outras moedas)
* **Arquivos do Checkout:**
  * `api/checkout.js`: Serverless Function (Vercel / Node.js)
  * `api/webhook.js`: Handler de confirmações e webhooks (Vercel / Node.js)
  * `checkout.php` / `config.php`: Endpoint para servidores PHP (Apache / Nginx / cPanel)
  * `webhook.php`: Endpoint de webhook para servidores PHP
  * `_next/static/chunks/603-2d1c77c9cde46ac6.js`: Componente de checkout no frontend (com fallback automático direto para a API XXPay com CORS em deploys estáticos como GitHub Pages)

---

## 🌐 Deploy e Hospedagem

Compatível com deploy imediato em:
- **Vercel** (com Serverless Functions em `/api/checkout`)
- **PHP / cPanel / Apache / Nginx** (`checkout.php` e `config.php`)
- **GitHub Pages** / **Cloudflare Pages** / **Netlify** (fallback direto via CORS com a API XXPay)
