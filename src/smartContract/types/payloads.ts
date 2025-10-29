import type { UnitOfMeasure } from "./types"

export interface MintRootBatchPayload {
  from: string // endereço Ethereum de quem assina a transação
  to: string // endereço do proprietário do token
  productName: string
  productExpeditionDate: string // formato ISO date
  productType: string
  batchId: string
  unitOfMeasure: UnitOfMeasure
  batchQuantity: number
}

export interface SplitBatchPayload {
  // Implementar se necessário posteriormente
}

export interface SetProductIsActivePayload {
  // Implementar se necessário posteriormente
}

export interface AddStatusPayload {
  // Implementar se necessário posteriormente
}

export interface GetUsersBatchesPayload {
  // Implementar se necessário posteriormente
}

export interface GetBatchProductsPayload {
  // Implementar se necessário posteriormente
}

export interface GetBatchHistoriesPayload {
  // Implementar se necessário posteriormente
}

export interface GetTokensByBatchIdPayload {
  // Implementar se necessário posteriormente
}