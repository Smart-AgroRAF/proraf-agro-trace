import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Script para injetar Google Analytics no index.html após o build
const indexPath = resolve('./dist/index.html');
let html = readFileSync(indexPath, 'utf-8');

const gaScript = `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-QGDQD6MYPK"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-QGDQD6MYPK');
    </script>`;

// Injeta antes do fechamento do </head>
html = html.replace('</head>', `${gaScript}\n  </head>`);

writeFileSync(indexPath, html, 'utf-8');
console.log('✓ Google Analytics injetado com sucesso!');
