# Kyle Rescuer - Donation Page (v5)

Mirror completo e estático da página de doação do **Kyle Rescuer** (`https://donate.kylerescuer.org/v5/`), contendo todos os assets, estilos, scripts, componentes e páginas institucionais de políticas.

## 📁 Estrutura de Arquivos

```
├── index.html                   # Página principal de doação (v5)
├── v5/
│   └── index.html               # Cópia servida no path /v5/
├── privacy-policy/
│   └── index.html               # Política de Privacidade
├── terms-and-conditions/
│   └── index.html               # Termos e Condições
├── cookie-policy/
│   └── index.html               # Política de Cookies
├── donation-policy/
│   └── index.html               # Política de Doação
├── refund-policy/
│   └── index.html               # Política de Reembolso e Cancelamento
├── _next/                       # CSS (Tailwind), Chunks JS e fontes
├── caio/                        # Imagens da história, abrigos e pôsteres de vídeo
├── susan/                       # Imagens da galeria de resgate
├── documentos/                  # Documentos comprobatórios (IRS EIN)
├── candid.svg                   # Selo Candid / GuideStar
├── charity.png                  # Selo Charity Navigator
├── favicon.ico                  # Favicon oficial
├── downloader.py                # Script em Python utilizado para download e sincronização dos assets
└── robots.txt                   # Configuração de robôs
```

## 🚀 Como Executar Localmente

Como a página é totalmente estática e independente, você pode executá-la usando qualquer servidor HTTP local:

### Opção 1: Python
```bash
python3 -m http.server 8000
```
Acesse: [http://localhost:8000](http://localhost:8000) ou [http://localhost:8000/v5/](http://localhost:8000/v5/)

### Opção 2: Node.js (npx serve)
```bash
npx serve .
```

### Opção 3: PHP
```bash
php -S localhost:8000
```

## 🌐 Deploy Estático

O repositório está pronto para deploy imediato em serviços como:
- **GitHub Pages**
- **Vercel**
- **Netlify**
- **Cloudflare Pages**
