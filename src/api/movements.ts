// api/movements.ts
// Funções para gerenciamento de movimentações

import { apiClient } from './client';
import type { 
  Movement, 
  MovementCreate, 
  MovementUpdate, 
  MovementFilters 
} from './types';

/**
 * Registra uma nova movimentação
 */
export const createMovement = async (data: MovementCreate): Promise<Movement> => {
  return apiClient.post<Movement>('/movements/', data);
};

/**
 * Lista todas as movimentações com filtros opcionais
 */
export const listMovements = async (filters?: MovementFilters): Promise<Movement[]> => {
  const params = new URLSearchParams();
  
  if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
  if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());
  if (filters?.batch_id !== undefined) params.append('batch_id', filters.batch_id.toString());
  if (filters?.tipo_movimentacao) params.append('tipo_movimentacao', filters.tipo_movimentacao);

  const queryString = params.toString();
  const endpoint = queryString ? `/movements/?${queryString}` : '/movements/';

  return apiClient.get<Movement[]>(endpoint);
};

/**
 * Busca uma movimentação por ID
 */
export const getMovementById = async (movementId: number): Promise<Movement> => {
  return apiClient.get<Movement>(`/movements/${movementId}`);
};

/**
 * Lista todas as movimentações de um lote específico
 * Útil para rastreabilidade completa
 */
export const getMovementsByBatch = async (batchId: number): Promise<Movement[]> => {
  return apiClient.get<Movement[]>(`/movements/batch/${batchId}`);
};

/**
 * Atualiza uma movimentação existente
 */
export const updateMovement = async (
  movementId: number, 
  data: MovementUpdate
): Promise<Movement> => {
  return apiClient.put<Movement>(`/movements/${movementId}`, data);
};

/**
 * Deleta uma movimentação (hard delete)
 */
export const deleteMovement = async (movementId: number): Promise<void> => {
  return apiClient.delete<void>(`/movements/${movementId}`);
};

/**
 * Lista movimentações por tipo
 */
export const listMovementsByType = async (
  tipo: string,
  skip?: number,
  limit?: number
): Promise<Movement[]> => {
  return listMovements({ tipo_movimentacao: tipo, skip, limit });
};

/**
 * Lista movimentações de plantio
 */
export const listPlantioMovements = async (
  skip?: number,
  limit?: number
): Promise<Movement[]> => {
  return listMovementsByType('plantio', skip, limit);
};

/**
 * Lista movimentações de colheita
 */
export const listColheitaMovements = async (
  skip?: number,
  limit?: number
): Promise<Movement[]> => {
  return listMovementsByType('colheita', skip, limit);
};

/**
 * Lista movimentações de expedição
 */
export const listExpedicaoMovements = async (
  skip?: number,
  limit?: number
): Promise<Movement[]> => {
  return listMovementsByType('expedição', skip, limit);
};

/**
 * Obtém histórico completo de um lote (rastreabilidade)
 */
export const getBatchHistory = async (batchId: number): Promise<Movement[]> => {
  return getMovementsByBatch(batchId);
};