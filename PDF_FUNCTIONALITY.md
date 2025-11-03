# Funcionalidade de Geração de PDF de Etiquetas

## Visão Geral

A funcionalidade de geração de PDF permite aos usuários criar etiquetas personalizadas em formato PDF para seus lotes, com preview em tempo real e campos configuráveis.

## Como Usar

### 1. Acessar a Funcionalidade
- Navegue para a página de detalhes de um lote específico
- Localize o botão com ícone de download 📄 na parte superior direita
- Clique no botão para abrir o modal de configuração de PDF

### 2. Configurar a Etiqueta
O modal permite configurar os seguintes campos:

#### Campos Editáveis:
- **Peso Líquido**: Peso do produto (preenchido automaticamente com dados do lote)
- **Empresa**: Nome da empresa produtora
- **Endereço**: Endereço completo da empresa
- **CPF/CNPJ**: Documento de identificação
- **Telefone**: Telefone de contato
- **Data de Validade**: Data limite do produto

#### Campos Automáticos:
- **Nome do Produto**: Baseado no ID do produto do lote
- **Código do Produto**: ID do produto
- **Código do Lote**: Código único do lote
- **QR Code**: Gerado automaticamente com URL de rastreamento

### 3. Preview da Etiqueta
- O modal exibe um preview em tempo real da etiqueta
- Todas as alterações nos campos são refletidas instantaneamente
- Preview em escala reduzida (70%) para caber no modal

### 4. Gerar PDF
- Clique em "Gerar PDF" após preencher os campos
- O sistema captura a etiqueta em tamanho real (oculta)
- PDF é gerado e baixado automaticamente
- Nome do arquivo: `etiqueta-lote-[CODIGO_DO_LOTE].pdf`

## Especificações Técnicas

### Dimensões da Etiqueta:
- **Largura**: 583px
- **Altura**: 384px
- **Formato**: Retangular horizontal
- **Resolução**: Alta qualidade (scale: 2x)

### Layout da Etiqueta:
```
┌─────────────────────────────────────────────────────┐
│ [NOME DO PRODUTO - 69px]                            │
│ [Peso Líquido - 38px]                               │
│                                                     │
│ [Empresa - 18px]                              ┌─────┐
│ [Endereço - 18px]                             │ QR  │
│ CPF: [CPF/CNPJ - 18px]                        │Code │
│ Tel: [Telefone - 18px]                        │120px│
│ Val: [Validade - 18px]                        └─────┘
│ Código Produto: [ID - 18px]                         │
│ Código Lote: [Código - 18px]                        │
└─────────────────────────────────────────────────────┘
```

## Bibliotecas Utilizadas

### Dependências:
- **jsPDF**: Geração de arquivos PDF
- **html2canvas**: Captura de elementos HTML como imagem
- **qrcode**: Geração de QR Codes
- **@types/qrcode**: Tipos TypeScript para qrcode

### Componentes:
- **EtiquetaProduto**: Componente de layout da etiqueta
- **usePDFGenerator**: Hook personalizado para geração de PDF
- **Produto**: Interface TypeScript para dados da etiqueta

## Fluxo de Funcionamento

### 1. Preparação dos Dados:
```typescript
// Função getProdutoData() mapeia:
Lote + Formulário → Objeto Produto → EtiquetaProduto
```

### 2. Renderização:
- Preview visível no modal (escala 70%)
- Versão oculta em tamanho real para captura
- QR Code gerado assincronamente

### 3. Geração do PDF:
- html2canvas captura elemento `#etiqueta-pdf`
- jsPDF cria documento com dimensões exatas
- Download automático do arquivo

## Tratamento de Erros

### Cenários de Erro:
- **Elemento não encontrado**: Etiqueta não renderizada
- **Falha na captura**: html2canvas com erro
- **Erro no PDF**: jsPDF com problema

### Feedback ao Usuário:
- Toast de sucesso quando PDF é gerado
- Toast de erro com mensagem específica
- Loading implícito durante geração

## Estados da Interface

### Botão de PDF:
- **Normal**: Ícone de download visível
- **Ativo**: Modal aberto com preview

### Modal:
- **Formulário**: Campos preenchidos com dados do lote
- **Preview**: Atualização em tempo real
- **Geração**: Processo automático e rápido

## Arquivos Relacionados

### Componentes:
- `src/components/EtiquetaProduto.tsx` - Layout da etiqueta
- `src/components/EtiquetaProduto.css` - Estilos da etiqueta

### Hooks:
- `src/hooks/usePDFGenerator.ts` - Lógica de geração de PDF

### Tipos:
- `src/types/produto.ts` - Interface de dados da etiqueta

### Páginas:
- `src/pages/batches/LoteDetalhes.tsx` - Integração principal

## Próximas Melhorias

1. **Templates de etiqueta**: Múltiplos layouts disponíveis
2. **Configurações persistentes**: Salvar dados da empresa por usuário
3. **Impressão direta**: Integração com impressoras locais
4. **Lote de PDFs**: Gerar múltiplas etiquetas simultaneamente
5. **Customização**: Cores, fontes e logos personalizados
6. **Histórico**: Log de etiquetas geradas
7. **Validação**: Campos obrigatórios e formatos
8. **Exportação**: Outros formatos (PNG, JPG)