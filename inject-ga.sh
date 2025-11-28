#!/bin/sh
# Script para injetar Google Analytics no index.html após o build

INDEX_FILE="dist/index.html"

if [ -f "$INDEX_FILE" ]; then
    echo "Injetando Google Analytics no $INDEX_FILE..."
    echo "Conteúdo ANTES da injeção:"
    head -25 "$INDEX_FILE"
    
    # Criar o conteúdo do GA em um arquivo temporário
    cat > /tmp/ga-inject.txt << 'EOF'
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-QGDQD6MYPK"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-QGDQD6MYPK');
    </script>
EOF
    
    # Encontrar a linha com <script type="module" e injetar antes dela
    awk '/<script type="module"/ && !found {
        while ((getline line < "/tmp/ga-inject.txt") > 0) print line
        found=1
    }
    {print}' "$INDEX_FILE" > "$INDEX_FILE.tmp"
    
    mv "$INDEX_FILE.tmp" "$INDEX_FILE"
    rm -f /tmp/ga-inject.txt
    
    echo "Conteúdo DEPOIS da injeção:"
    head -30 "$INDEX_FILE"
    
    echo "✓ Google Analytics injetado com sucesso!"
else
    echo "Erro: $INDEX_FILE não encontrado"
    exit 1
fi
