// api/user.ts
// Funções para gerenciar perfil do usuário logado

import { apiClient } from './client';
import type { User, UserUpdate } from './types';

/**
 * Obtém dados do usuário logado
 */
export const getCurrentUser = async (): Promise<User> => {
  return apiClient.get<User>('/user/me');
};

/**
 * Atualiza dados do usuário logado
 */
export const updateCurrentUser = async (data: UserUpdate): Promise<User> => {
  return apiClient.put<User>('/user/me', data);
};

/**
 * Obtém estatísticas do usuário logado
 */
export const getUserStats = async (): Promise<UserStats> => {
  return apiClient.get<UserStats>('/user/me/stats');
};

/**
 * Obtém todos os lotes do usuário logado
 */
export const getUserBatches = async (
  skip?: number,
  limit?: number
): Promise<Batch[]> => {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append('skip', skip.toString());
  if (limit !== undefined) params.append('limit', limit.toString());

  const queryString = params.toString();
  const endpoint = queryString ? `/user/me/batches?${queryString}` : '/user/me/batches';

  return apiClient.get<Batch[]>(endpoint);
};

/**
 * Obtém todas as movimentações do usuário logado
 */
export const getUserMovements = async (
  skip?: number,
  limit?: number
): Promise<Movement[]> => {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append('skip', skip.toString());
  if (limit !== undefined) params.append('limit', limit.toString());

  const queryString = params.toString();
  const endpoint = queryString ? `/user/me/movements?${queryString}` : '/user/me/movements';

  return apiClient.get<Movement[]>(endpoint);
};

/**
 * Obtém atividade recente do usuário
 */
export const getUserRecentActivity = async (
  limit: number = 10
): Promise<UserRecentActivity> => {
  return apiClient.get<UserRecentActivity>(`/user/me/recent-activity?limit=${limit}`);
};

/**
 * Deleta a própria conta do usuário
 * ATENÇÃO: Esta ação é irreversível!
 */
export const deleteOwnAccount = async (): Promise<void> => {
  return apiClient.delete<void>('/user/me');
};

/**
 * Atualiza apenas a senha do usuário
 */
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<User> => {
  return updateCurrentUser({ senha: newPassword });
};

/**
 * Atualiza apenas o telefone do usuário
 */
export const updatePhone = async (telefone: string): Promise<User> => {
  return updateCurrentUser({ telefone });
};

/**
 * Atualiza apenas o nome do usuário
 */
export const updateName = async (nome: string): Promise<User> => {
  return updateCurrentUser({ nome });
};

// ============================================
// TIPOS ADICIONAIS
// ============================================

interface UserStats {
  batches: {
    total: number;
    active: number;
    inactive: number;
  };
  movements: {
    total: number;
    by_type: Array<{
      type: string;
      count: number;
    }>;
  };
  production: {
    total: number;
  };
  products: {
    unique_products: number;
  };
}

interface UserRecentActivity {
  recent_movements: Array<{
    id: number;
    type: string;
    quantity: number;
    batch_id: number;
    created_at: string;
  }>;
  recent_batches: Array<{
    id: number;
    code: string;
    product_id: number;
    created_at: string;
  }>;
}

// Importações de tipos
import type { Batch } from './types';
import type { Movement } from './types';

// Exporta tipos para uso externo
export type { UserStats, UserRecentActivity };