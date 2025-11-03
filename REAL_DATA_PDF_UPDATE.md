# Melhorias na Geração de PDF - Dados Reais do Produto

## Alterações Implementadas

### 🎯 **Integração com API de Rastreamento**

A página de detalhes do lote agora utiliza a mesma API da página de Rastreamento para obter **dados completos e reais** do produto.

### 📋 **Dados Reais Utilizados:**

#### Informações do Produto (da API):
- **Nome**: Nome real da fruta/produto (máximo 10 caracteres)
- **Nome Comercial**: Se disponível, usado como alternativa
- **Código do Produto**: Código real do sistema
- **Descrição**: Informações detalhadas do produto
- **Variedade/Cultivar**: Especificação da variedade

#### Informações do Produtor (da API):
- **Nome da Empresa**: Nome real do produtor/empresa
- **Tipo de Pessoa**: Física ou Jurídica
- **Tipo de Perfil**: Perfil do usuário no sistema

### 🎨 **Melhorias na Etiqueta:**

#### Título Otimizado:
- **Limitado a 10 caracteres máximo**
- **Nome real da fruta/produto** em vez de "Lote [código]"
- **Truncagem inteligente** preservando legibilidade
- **Prioriza nome comercial** quando disponível

#### Exemplo de Títulos:
```
Antes: "Lote LOT-2024-001" (16 caracteres)
Depois: "Tomate" (6 caracteres) ✅
        "Alface" (6 caracteres) ✅
        "Cenoura Ro" (10 caracteres, truncado) ✅
```

### 🔄 **Fluxo de Busca de Dados:**

1. **Busca dados do lote** (API autenticada)
2. **Busca dados de rastreamento** usando código do lote (API pública)
3. **Combina informações** para gerar etiqueta completa
4. **Aplica regras** de formatação e truncagem

### 🚀 **Interface Aprimorada:**

#### Na Página de Detalhes:
- **Título mostra nome real do produto**
- **Nome comercial como subtítulo** (quando disponível)
- **Carregamento inteligente** aguarda ambas as APIs

#### Na Etiqueta PDF:
- **Nome curto e claro** (máximo 10 chars)
- **Empresa real do produtor**
- **Dados consistentes** com página de rastreamento

### 🔧 **Implementação Técnica:**

#### Nova Integração:
```typescript
// Busca dados completos como no Rastrear.tsx
const { data: trackingData } = useApi(
  () => lote ? trackBatchByCode(lote.code) : Promise.reject("Lote não encontrado"),
  [lote?.code]
);

// Função de truncagem
const truncateName = (name: string, maxLength: number = 10): string => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength).trim();
};
```

#### Dados Automáticos Inteligentes:
```typescript
nome: truncateName(productName), // Ex: "Tomate" ou "Alface Cre"
empresa: trackingData.producer.nome, // Nome real do produtor
codigoProduto: trackingData.product.code, // Código real
```

### 📊 **Benefícios das Melhorias:**

- **Dados Reais**: Informações precisas do sistema
- **Título Legível**: Máximo 10 caracteres, fácil leitura
- **Consistência**: Mesmos dados da página de rastreamento
- **Profissionalismo**: Etiquetas com informações corretas
- **Automatização**: Zero configuração manual necessária

### 🎯 **Resultado Final:**

As etiquetas PDF agora exibem:
- ✅ **Nome real da fruta** (ex: "Tomate", "Alface")
- ✅ **Empresa real do produtor**
- ✅ **Códigos corretos do sistema**
- ✅ **Título limitado a 10 caracteres**
- ✅ **Informações consistentes** com rastreamento público

A funcionalidade está **totalmente integrada** com o sistema de rastreamento, garantindo que as etiquetas PDF contenham dados **reais e atualizados** diretamente da base de dados.