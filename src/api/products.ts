// api/products.ts
// Funções para gerenciamento de produtos

import { apiClient } from './client';
import type { 
  Product, 
  ProductCreate, 
  ProductUpdate, 
  ProductFilters 
} from './types';

/**
 * Cria um novo produto
 */
export const createProduct = async (data: ProductCreate): Promise<Product> => {
  return apiClient.post<Product>('/products/', data);
};

/**
 * Lista todos os produtos com filtros opcionais
 */
export const listProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  const params = new URLSearchParams();
  
  if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
  if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());
  if (filters?.status_filter !== undefined) params.append('status_filter', filters.status_filter.toString());

  const queryString = params.toString();
  const endpoint = queryString ? `/products/?${queryString}` : '/products/';

  return apiClient.get<Product[]>(endpoint);
};

/**
 * Busca um produto por ID
 */
export const getProductById = async (productId: number): Promise<Product> => {
  return apiClient.get<Product>(`/products/${productId}`);
};

/**
 * Atualiza um produto existente
 */
export const updateProduct = async (
  productId: number, 
  data: ProductUpdate
): Promise<Product> => {
  return apiClient.put<Product>(`/products/${productId}`, data);
};

/**
 * Deleta um produto (soft delete)
 */
export const deleteProduct = async (productId: number): Promise<void> => {
  return apiClient.delete<void>(`/products/${productId}`);
};

/**
 * Lista apenas produtos ativos
 */
export const listActiveProducts = async (
  skip?: number, 
  limit?: number
): Promise<Product[]> => {
  return listProducts({ skip, limit, status_filter: true });
};

/**
 * Lista apenas produtos inativos
 */
export const listInactiveProducts = async (
  skip?: number, 
  limit?: number
): Promise<Product[]> => {
  return listProducts({ skip, limit, status_filter: false });
};