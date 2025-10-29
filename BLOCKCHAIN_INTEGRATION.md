# Integração Blockchain - Smart Contracts

## Visão Geral

Esta integração permite que usuários do tipo "Blockchain" registrem seus lotes tanto no banco de dados tradicional quanto na blockchain usando smart contracts.

## Como Funciona

### 1. Tipos de Usuário
- **Usuário Comum**: Registra lotes apenas no banco de dados
- **Usuário Blockchain**: Registra lotes no banco de dados E na blockchain

### 2. Fluxo de Cadastro de Lote

#### Usuário Comum:
1. Preenche formulário
2. Dados são salvos no banco de dados
3. Processo concluído

#### Usuário Blockchain:
1. Preenche formulário
2. **Primeira etapa**: Dados são salvos no banco de dados
3. **Segunda etapa**: Sistema tenta registrar na blockchain via smart contract
4. Se blockchain falhar, lote ainda fica salvo no banco
5. Usuário recebe feedback sobre ambos os processos

### 3. Requisitos para Blockchain

- MetaMask instalada no navegador
- Carteira conectada
- API de Smart Contract rodando (atualmente offline)

### 4. Conversão de Dados

O sistema converte automaticamente entre os formatos:

| Sistema Local | Blockchain |
|---------------|------------|
| kg            | kg         |
| ton           | kg         |
| un            | un         |
| cx            | cn         |
| g             | g          |

### 5. Estrutura de Dados para Blockchain

```typescript
interface MintRootBatchPayload {
  from: string          // Endereço da carteira do usuário
  to: string           // Mesmo endereço (proprietário do token)
  productName: string  // Nome do produto
  productExpeditionDate: string // Data de expedição
  productType: string  // Tipo/variedade do produto
  batchId: string      // Código do lote
  unitOfMeasure: UnitOfMeasure // Unidade de medida
  batchQuantity: number // Quantidade (inteiro)
}
```

### 6. Tratamento de Erros

- **API Blockchain offline**: Aviso ao usuário, mas processo continua
- **MetaMask não conectada**: Solicita conexão automática
- **Erro na transação**: Rollback não afeta o banco de dados

## Arquivos Modificados

### Novos Arquivos:
- `src/smartContract/types/types.ts` - Tipos básicos
- `src/smartContract/types/payloads.ts` - Payloads para API
- `src/smartContract/types/Ethereum.ts` - Tipos MetaMask
- `src/hooks/useSmartContract.ts` - Hook principal

### Arquivos Modificados:
- `src/App.tsx` - Adicionados providers de contexto
- `src/pages/batches/NovoLote.tsx` - Lógica de integração
- `.env` - Variável VITE_ERC

### Contextos Existentes:
- `EthereumContext` - Gerencia conexão MetaMask
- `TransactionContext` - Monitora transações blockchain
- `ToastContext` - Notificações (não usado atualmente)

## Configuração

1. Configure a variável `VITE_ERC` no arquivo `.env`
2. Certifique-se que a API de Smart Contract está rodando em `localhost:3000`
3. Usuários precisam ter MetaMask instalada

## Como Testar

1. Acesse o sistema como usuário normal - deve funcionar normalmente
2. Mude para usuário Blockchain no perfil
3. Tente cadastrar um lote - deve mostrar as duas etapas
4. Verifique os toasts/notificações durante o processo

## Status Atual

- ✅ Integração implementada e funcionando
- ✅ Fallback quando API blockchain está offline
- ✅ Interface visual indica status blockchain
- ⚠️ API de Smart Contract não está rodando (simulação ativa)

## Próximos Passos

1. Configurar e testar com API de Smart Contract real
2. Implementar outras operações (splitBatch, addStatus, etc.)
3. Adicionar histórico de transações blockchain
4. Melhorar UX para transações pending/confirmed/failed