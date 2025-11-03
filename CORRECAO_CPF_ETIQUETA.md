# Correção: CPF/CNPJ na Etiqueta de Produto

## Problema Identificado
O CPF/CNPJ não estava sendo exibido corretamente na etiqueta do produto, mostrando sempre um valor genérico "000.000.000-00" em vez dos dados reais do usuário.

## Causa do Problema
1. **API de Rastreamento**: A API `trackBatchByCode` não retorna dados sensíveis como CPF/CNPJ por questões de segurança
2. **Dados Fixos**: O sistema estava usando dados genéricos hardcoded em vez de buscar informações do usuário autenticado

## Solução Implementada

### 1. Importação do Context de Autenticação
```tsx
import { useAuth } from "@/context/AuthContext";
```

### 2. Acesso aos Dados do Usuário
```tsx
const { user } = useAuth();
```

### 3. Função de Formatação de CPF/CNPJ
Criada função para formatar corretamente o documento baseado no tipo de pessoa:
- **Pessoa Física (F)**: CPF no formato `000.000.000-00`
- **Pessoa Jurídica (J)**: CNPJ no formato `00.000.000/0000-00`

### 4. Uso de Dados Reais na Etiqueta
- **Nome da Empresa**: `user.nome` (nome do produtor logado)
- **CPF/CNPJ**: Formatado corretamente baseado em `user.cpf`, `user.cnpj` e `user.tipo_pessoa`
- **Telefone**: `user.telefone` ou valor padrão se não informado

### 5. Validações de Segurança
- Aguarda carregamento do usuário antes de renderizar
- Verificação de existência dos dados necessários
- Tratamento de erro caso dados não estejam disponíveis

## Resultado
Agora a etiqueta exibe corretamente:
- ✅ **Nome real do produtor** na empresa
- ✅ **CPF ou CNPJ formatado** do usuário autenticado
- ✅ **Telefone real** do usuário (quando disponível)
- ✅ **Validação de dados** antes da geração

## Arquivos Modificados
- `src/pages/batches/LoteDetalhes.tsx` - Integração com contexto de autenticação e formatação de dados

## Dependências
- Context de Autenticação (`AuthContext`)
- Dados do usuário logado disponíveis
- Tipos TypeScript atualizados (`User` interface)

## Teste
1. Faça login com um usuário que tenha CPF/CNPJ cadastrado
2. Acesse detalhes de um lote
3. Gere o PDF da etiqueta
4. Verifique se o CPF/CNPJ aparece formatado corretamente na etiqueta