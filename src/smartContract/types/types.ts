export type TxStatus = "pending" | "confirmed" | "failed"

export type UnitOfMeasure = "un" | "g" | "kg" | "cn" | "ma" | "dz"

export interface TransactionOutput {
  hash: string
  status: TxStatus
}