// api/auth.ts
// Funções para autenticação

import { apiClient, TokenManager } from './client';
import type { 
  LoginRequest, 
  RegisterRequest, 
  TokenResponse, 
  User 
} from './types';

/**
 * Registra um novo usuário no sistema
 */
export const register = async (data: RegisterRequest): Promise<User> => {
  return apiClient.post<User>('/auth/register', data, { requiresAuth: false });
};

/**
 * Faz login e retorna o token JWT
 * Automaticamente salva o token no localStorage
 */
export const login = async (credentials: LoginRequest): Promise<TokenResponse> => {
  const response = await apiClient.postForm<TokenResponse>('/auth/login', {
    username: credentials.username,
    password: credentials.password,
  });

  // Salva o token automaticamente
  TokenManager.setToken(response.access_token);

  return response;
};

/**
 * Faz logout do usuário
 * Remove o token do localStorage
 */
export const logout = (): void => {
  TokenManager.removeToken();
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  return TokenManager.isAuthenticated();
};

/**
 * Obtém o token atual
 */
export const getToken = (): string | null => {
  return TokenManager.getToken();
};

/**
 * Define o token manualmente
 */
export const setToken = (token: string): void => {
  TokenManager.setToken(token);
};

/**
 * Faz login via Google usando ID token
 */
export const loginWithGoogle = async (idToken: string): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>('/auth/google/verify-token', {
    id_token: idToken,
  });

  // Salva o token automaticamente
  TokenManager.setToken(response.access_token);

  return response;
};