// api/batches.ts
// Funções para gerenciamento de lotes

import { apiClient } from './client';
import type { 
  Batch, 
  BatchCreate, 
  BatchUpdate, 
  BatchFilters 
} from './types';

/**
 * Cria um novo lote
 * QR Code é gerado automaticamente
 */
export const createBatch = async (data: BatchCreate): Promise<Batch> => {
  return apiClient.post<Batch>('/batches/', data);
};

/**
 * Lista todos os lotes com filtros opcionais
 */
export const listBatches = async (filters?: BatchFilters): Promise<Batch[]> => {
  const params = new URLSearchParams();
  
  if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
  if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());
  if (filters?.product_id !== undefined) params.append('product_id', filters.product_id.toString());
  if (filters?.status_filter !== undefined) params.append('status_filter', filters.status_filter.toString());

  const queryString = params.toString();
  const endpoint = queryString ? `/batches/?${queryString}` : '/batches/';

  return apiClient.get<Batch[]>(endpoint);
};

/**
 * Busca um lote por ID
 */
export const getBatchById = async (batchId: number): Promise<Batch> => {
  return apiClient.get<Batch>(`/batches/${batchId}`);
};

/**
 * Busca um lote por código
 * Útil para rastreabilidade via QR Code
 */
export const getBatchByCode = async (batchCode: string): Promise<Batch> => {
  return apiClient.get<Batch>(`/batches/code/${batchCode}`);
};

/**
 * Atualiza um lote existente
 */
export const updateBatch = async (
  batchId: number, 
  data: BatchUpdate
): Promise<Batch> => {
  return apiClient.put<Batch>(`/batches/${batchId}`, data);
};

/**
 * Deleta um lote (soft delete)
 */
export const deleteBatch = async (batchId: number): Promise<void> => {
  return apiClient.delete<void>(`/batches/${batchId}`);
};

/**
 * Lista lotes de um produto específico
 */
export const listBatchesByProduct = async (
  productId: number,
  skip?: number,
  limit?: number
): Promise<Batch[]> => {
  return listBatches({ product_id: productId, skip, limit });
};

/**
 * Lista apenas lotes ativos
 */
export const listActiveBatches = async (
  skip?: number,
  limit?: number
): Promise<Batch[]> => {
  return listBatches({ status_filter: true, skip, limit });
};

/**
 * Lista lotes ativos de um produto específico
 */
export const listActiveBatchesByProduct = async (
  productId: number,
  skip?: number,
  limit?: number
): Promise<Batch[]> => {
  return listBatches({ 
    product_id: productId, 
    status_filter: true, 
    skip, 
    limit 
  });
};