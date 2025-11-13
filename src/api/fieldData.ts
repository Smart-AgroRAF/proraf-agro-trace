// api/fieldData.ts
// Requisições para gerenciamento de dados de campos

import { apiClient } from './client';

// ============================================
// TIPOS
// ============================================

export interface FieldDataBase {
  latitude?: string;
  longitude?: string;
  mapa?: string;
  imagem_aerea?: string;
  imagem_perfil?: string;
  imagem_fundo?: string;
  observacoes?: string;
}

export interface FieldDataCreate extends FieldDataBase {}

export interface FieldDataUpdate {
  latitude?: string;
  longitude?: string;
  mapa?: string;
  imagem_aerea?: string;
  imagem_perfil?: string;
  imagem_fundo?: string;
  observacoes?: string;
}

export interface FieldData extends FieldDataBase {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface FieldDataPaginatedResponse {
  total: number;
  items: FieldData[];
}

// ============================================
// FUNÇÕES DA API
// ============================================

/**
 * Cria um novo dado de campo
 */
export async function createFieldData(data: FieldDataCreate): Promise<FieldData> {
  return apiClient.post<FieldData>('/field-data/', data);
}

/**
 * Lista dados de campo com paginação
 */
export async function listFieldData(
  skip: number = 0,
  limit: number = 10
): Promise<FieldDataPaginatedResponse> {
  return apiClient.get<FieldDataPaginatedResponse>(
    `/field-data/?skip=${skip}&limit=${limit}`
  );
}

/**
 * Obtém um dado de campo específico pelo ID
 */
export async function getFieldData(fieldDataId: number): Promise<FieldData> {
  return apiClient.get<FieldData>(`/field-data/${fieldDataId}`);
}

/**
 * Atualiza um dado de campo
 */
export async function updateFieldData(
  fieldDataId: number,
  data: FieldDataUpdate
): Promise<FieldData> {
  return apiClient.put<FieldData>(`/field-data/${fieldDataId}`, data);
}

/**
 * Deleta um dado de campo
 */
export async function deleteFieldData(fieldDataId: number): Promise<void> {
  return apiClient.delete<void>(`/field-data/${fieldDataId}`);
}
