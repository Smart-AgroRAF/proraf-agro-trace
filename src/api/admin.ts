// api/admin.ts
// Funções administrativas (apenas para usuários admin)

import { apiClient } from './client';
import type { 
  User, 
  RegisterRequest, 
  UserUpdate, 
  UserFilters,
  UsersStats,
  DashboardOverview,
  RecentActivity,
  ProductionSummary
} from './types';

// ============================================
// GERENCIAMENTO DE USUÁRIOS
// ============================================

/**
 * [ADMIN] Cria um novo usuário
 */
export const adminCreateUser = async (data: RegisterRequest): Promise<User> => {
  return apiClient.post<User>('/admin/users/', data);
};

/**
 * [ADMIN] Lista todos os usuários com filtros
 */
export const adminListUsers = async (filters?: UserFilters): Promise<User[]> => {
  const params = new URLSearchParams();
  
  if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
  if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());
  if (filters?.tipo_perfil) params.append('tipo_perfil', filters.tipo_perfil);
  if (filters?.tipo_pessoa) params.append('tipo_pessoa', filters.tipo_pessoa);

  const queryString = params.toString();
  const endpoint = queryString ? `/admin/users/?${queryString}` : '/admin/users/';

  return apiClient.get<User[]>(endpoint);
};

/**
 * [ADMIN] Busca usuário por ID
 */
export const adminGetUserById = async (userId: number): Promise<User> => {
  return apiClient.get<User>(`/admin/users/${userId}`);
};

/**
 * [ADMIN] Busca usuário por email
 */
export const adminGetUserByEmail = async (email: string): Promise<User> => {
  return apiClient.get<User>(`/admin/users/email/${email}`);
};

/**
 * [ADMIN] Atualiza um usuário
 */
export const adminUpdateUser = async (
  userId: number, 
  data: UserUpdate
): Promise<User> => {
  return apiClient.put<User>(`/admin/users/${userId}`, data);
};

/**
 * [ADMIN] Deleta um usuário permanentemente
 */
export const adminDeleteUser = async (userId: number): Promise<void> => {
  return apiClient.delete<void>(`/admin/users/${userId}`);
};

/**
 * [ADMIN] Promove usuário a administrador
 */
export const adminPromoteUser = async (userId: number): Promise<User> => {
  return apiClient.patch<User>(`/admin/users/${userId}/promote`);
};

/**
 * [ADMIN] Rebaixa administrador a usuário comum
 */
export const adminDemoteUser = async (userId: number): Promise<User> => {
  return apiClient.patch<User>(`/admin/users/${userId}/demote`);
};

/**
 * [ADMIN] Obtém estatísticas de usuários
 */
export const adminGetUsersStats = async (): Promise<UsersStats> => {
  return apiClient.get<UsersStats>('/admin/users/stats/overview');
};

/**
 * [ADMIN] Lista apenas administradores
 */
export const adminListAdmins = async (
  skip?: number,
  limit?: number
): Promise<User[]> => {
  return adminListUsers({ tipo_perfil: 'admin', skip, limit });
};

/**
 * [ADMIN] Lista apenas usuários comuns
 */
export const adminListRegularUsers = async (
  skip?: number,
  limit?: number
): Promise<User[]> => {
  return adminListUsers({ tipo_perfil: 'user', skip, limit });
};

/**
 * [ADMIN] Lista usuários pessoa física
 */
export const adminListPessoaFisica = async (
  skip?: number,
  limit?: number
): Promise<User[]> => {
  return adminListUsers({ tipo_pessoa: 'F', skip, limit });
};

/**
 * [ADMIN] Lista usuários pessoa jurídica
 */
export const adminListPessoaJuridica = async (
  skip?: number,
  limit?: number
): Promise<User[]> => {
  return adminListUsers({ tipo_pessoa: 'J', skip, limit });
};

// ============================================
// DASHBOARD
// ============================================

/**
 * [ADMIN] Obtém visão geral do dashboard
 */
export const adminGetDashboardOverview = async (): Promise<DashboardOverview> => {
  return apiClient.get<DashboardOverview>('/admin/dashboard/overview');
};

/**
 * [ADMIN] Obtém atividades recentes do sistema
 */
export const adminGetRecentActivity = async (
  limit: number = 10
): Promise<RecentActivity> => {
  return apiClient.get<RecentActivity>(
    `/admin/dashboard/recent-activity?limit=${limit}`
  );
};

/**
 * [ADMIN] Obtém resumo de produção
 */
export const adminGetProductionSummary = async (): Promise<ProductionSummary> => {
  return apiClient.get<ProductionSummary>('/admin/dashboard/production-summary');
};