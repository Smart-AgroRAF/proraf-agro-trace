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
 * Cria um novo produto com upload de imagem
 */
export const createProductWithImage = async (
  data: ProductCreateWithImage
): Promise<Product> => {
  const formData = new FormData();
  
  // Adiciona campos obrigatórios
  formData.append('name', data.name);
  formData.append('code', data.code);
  
  // Adiciona campos opcionais
  if (data.comertial_name) formData.append('comertial_name', data.comertial_name);
  if (data.description) formData.append('description', data.description);
  if (data.variedade_cultivar) formData.append('variedade_cultivar', data.variedade_cultivar);
  if (data.status !== undefined) formData.append('status', String(data.status));
  
  // Adiciona arquivo de imagem
  if (data.image) {
    formData.append('image', data.image);
  }
  
  // Faz requisição com FormData
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/with-image`, {
    method: 'POST',
    headers: {
      'X-API-Key': import.meta.env.VITE_API_KEY,
      'Authorization': `Bearer ${localStorage.getItem('proraf_token')}`,
      // NÃO adicione Content-Type, o browser define automaticamente com boundary
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || 'Erro ao criar produto');
  }

  return response.json();
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

// ============================================
// TIPOS ADICIONAIS
// ============================================

export interface ProductCreateWithImage {
  name: string;
  code: string;
  comertial_name?: string;
  description?: string;
  variedade_cultivar?: string;
  status?: boolean;
  image?: File; // Arquivo de imagem
}