const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// Tipos de erro personalizados
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

// Interface para configuração de requisição
interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

// Gerenciamento de token
class TokenManager {
  private static TOKEN_KEY = 'proraf_token';
  private static TOKEN_EXPIRY_KEY = 'proraf_token_expiry';

  static getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    
    // Verificar se o token expirou
    if (token && this.isTokenExpired()) {
      console.warn('Token expirado, removendo...');
      this.removeToken();
      return null;
    }
    
    return token;
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    
    // Calcular e armazenar tempo de expiração (24 horas a partir de agora)
    const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (!expiryTime) {
      return true; // Se não há tempo de expiração, considerar expirado
    }
    
    return Date.now() > parseInt(expiryTime);
  }

  static getTokenExpiry(): number | null {
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    return expiryTime ? parseInt(expiryTime) : null;
  }

  static refreshExpiry(): void {
    // Atualizar o tempo de expiração para mais 24 horas a partir de agora
    const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
}

// Cliente HTTP
class ApiClient {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private getHeaders(requiresAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
    };

    if (requiresAuth) {
      const token = TokenManager.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: response.statusText };
      }

      // Se for erro 401 (não autorizado), significa que o token expirou
      if (response.status === 401) {
        console.error('Token inválido ou expirado, limpando sessão...');
        TokenManager.removeToken();
        
        // Redirecionar para login apenas se não estivermos já na página de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }

      throw new ApiError(response.status, response.statusText, errorData);
    }

    // Requisição bem-sucedida - renovar tempo de expiração do token
    // (similar ao comportamento "remember me" - mantém sessão ativa)
    const currentToken = TokenManager.getToken();
    if (currentToken) {
      TokenManager.refreshExpiry();
    }

    // Para respostas 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = true, ...restConfig } = config;

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(requiresAuth),
      ...restConfig,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = true, ...restConfig } = config;

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(requiresAuth),
      body: JSON.stringify(data),
      ...restConfig,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = true, ...restConfig } = config;

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(requiresAuth),
      body: JSON.stringify(data),
      ...restConfig,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = true, ...restConfig } = config;

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(requiresAuth),
      body: JSON.stringify(data),
      ...restConfig,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = true, ...restConfig } = config;

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(requiresAuth),
      ...restConfig,
    });

    return this.handleResponse<T>(response);
  }

  // Para requisições form-data (login OAuth2)
  async postForm<T>(
    endpoint: string,
    data: Record<string, string>,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = false, ...restConfig } = config;

    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const headers = {
      'X-API-Key': this.apiKey,
    };

    if (requiresAuth) {
      const token = TokenManager.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
      ...restConfig,
    });

    return this.handleResponse<T>(response);
  }
}

// Instância única do cliente
export const apiClient = new ApiClient(API_BASE_URL, API_KEY);
export { TokenManager };