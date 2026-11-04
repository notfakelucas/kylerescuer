# Kyle Rescuer - Complete Website Mirror (All Versions & Pages)

Mirror completo, estático e independente de **todas as páginas** do ecossistema **Kyle Rescuer** (`https://donate.kylerescuer.org`), incluindo todas as versões do funil de doação, landing pages, página de agradecimento, políticas institucionais e página de links oficial.

🔗 **Repositório GitHub**: [https://github.com/notfakelucas/kylerescuer](https://github.com/notfakelucas/kylerescuer)

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
├── download_all.py              # Script automatizado de download e sincronização
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
- [http://localhost:8000/v2/](http://localhost:8000/v2/)
- [http://localhost:8000/v3/](http://localhost:8000/v3/)
- [http://localhost:8000/v4/](http://localhost:8000/v4/)
- [http://localhost:8000/v5/](http://localhost:8000/v5/)
- [http://localhost:8000/v6/](http://localhost:8000/v6/)
- [http://localhost:8000/v7/](http://localhost:8000/v7/)
- [http://localhost:8000/v8/](http://localhost:8000/v8/)
- [http://localhost:8000/thank-you/](http://localhost:8000/thank-you/)
- [http://localhost:8000/kylerescuer-links/](http://localhost:8000/kylerescuer-links/)

### Com Node.js
```bash
npx serve .
```

### Com PHP
```bash
php -S localhost:8000
```

---

## 🌐 Deploy Estático

Compatível com deploy em:
- **GitHub Pages**
- **Vercel**
- **Netlify**
- **Cloudflare Pages**
