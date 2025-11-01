# Funcionalidade de Impressão de Etiquetas

## Visão Geral

A funcionalidade de impressão de etiquetas permite aos usuários imprimir etiquetas personalizadas para seus lotes diretamente da página de detalhes do lote.

## Como Usar

### 1. Acessar a Funcionalidade
- Navegue para a página de detalhes de um lote específico
- Localize o botão com ícone de impressora 🖨️ na parte superior direita
- Clique no botão para abrir o modal de configuração

### 2. Configurar a Impressão
O modal permite configurar os seguintes campos:

#### Campos Obrigatórios:
- **Código do Lote**: Preenchido automaticamente

#### Campos Opcionais:
- **Nome da Impressora**: Nome da impressora (padrão: "ZDesigner ZT230-200dpi ZPL")
- **Peso**: Peso específico para esta impressão
- **Endereço**: Endereço a ser impresso na etiqueta
- **Telefone**: Telefone de contato
- **Validade (dias)**: Número de dias de validade (padrão: 30)

### 3. Imprimir
- Preencha os campos desejados
- Clique em "Imprimir Etiqueta"
- O sistema enviará a requisição para o backend
- Aguarde a confirmação de sucesso

## Integração Backend

### Rota utilizada:
```
POST /print/batch-label
```

### Payload enviado:
```typescript
{
  batch_code: string,           // Código do lote (obrigatório)
  printer_name?: string,        // Nome da impressora
  peso?: string,               // Peso personalizado
  endereco?: string,           // Endereço
  telefone?: string,           // Telefone
  validade_dias?: number       // Dias de validade
}
```

### Resposta esperada:
```typescript
{
  success: boolean,
  message: string,
  batch_info?: {
    batch_code: string,
    product_name: string,
    production: number,
    unit: string,
    planting_date?: string,
    harvest_date?: string
  }
}
```

## Segurança
- Usuários só podem imprimir etiquetas de lotes próprios
- Autenticação obrigatória via token Bearer
- Validação de dados no backend

## Tratamento de Erros

### Erros Comuns:
- **404**: Lote não encontrado ou não pertence ao usuário
- **400**: Lote sem produto associado
- **500**: Falha na impressora ou erro interno

### Feedback ao Usuário:
- Toasts de sucesso quando etiqueta é impressa
- Toasts de erro com mensagem específica do problema
- Loading state durante o processo

## Estados da Interface

### Botão de Impressão:
- **Normal**: Ícone de impressora visível
- **Loading**: Texto "Imprimindo..." durante processo
- **Desabilitado**: Durante requisição ao backend

### Modal:
- **Aberto**: Formulário com campos preenchidos com valores padrão
- **Enviando**: Botão desabilitado com loading
- **Fechado**: Após sucesso ou cancelamento

## Arquivos Relacionados

### Novos Arquivos:
- `src/api/print.ts` - API para comunicação com backend

### Arquivos Modificados:
- `src/pages/batches/LoteDetalhes.tsx` - Interface e lógica

## Próximas Melhorias

1. **Preview da etiqueta**: Mostrar preview antes de imprimir
2. **Histórico de impressões**: Log de etiquetas impressas
3. **Templates**: Diferentes modelos de etiqueta
4. **Impressão em lote**: Imprimir múltiplas etiquetas
5. **Configurações persistentes**: Salvar configurações do usuário