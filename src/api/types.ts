// api/types.ts
// Tipos TypeScript para a API ProRAF

// ============================================
// AUTENTICAÇÃO
// ============================================

export interface LoginRequest {
  username: string; // email do usuário
  password: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  tipo_pessoa: 'F' | 'J';
  cpf?: string;
  cnpj?: string;
  telefone?: string;
  tipo_perfil?: 'user' | 'admin';
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  tipo_pessoa: 'F' | 'J';
  cpf?: string;
  cnpj?: string;
  telefone?: string;
  tipo_perfil: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// ============================================
// PRODUTOS
// ============================================

export interface ProductCreate {
  name: string;
  comertial_name?: string;
  description?: string;
  variedade_cultivar?: string;
  status?: boolean;
  image: string;
  code: string;
}

export interface ProductUpdate {
  name?: string;
  comertial_name?: string;
  description?: string;
  variedade_cultivar?: string;
  status?: boolean;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  comertial_name?: string;
  description?: string;
  variedade_cultivar?: string;
  status: boolean;
  image?: string;
  code: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// LOTES
// ============================================

export interface BatchCreate {
  code: string;
  dt_plantio?: string; // ISO date string
  dt_colheita?: string;
  dt_expedition?: string;
  status?: boolean;
  talhao?: string;
  registro_talhao?: boolean;
  producao?: number;
  product_id: number;
}

export interface BatchUpdate {
  dt_plantio?: string;
  dt_colheita?: string;
  dt_expedition?: string;
  status?: boolean;
  talhao?: string;
  registro_talhao?: boolean;
  producao?: number;
}

export interface Batch {
  id: number;
  code: string;
  dt_plantio?: string;
  dt_colheita?: string;
  dt_expedition?: string;
  status: boolean;
  talhao?: string;
  registro_talhao: boolean;
  producao: number;
  qrcode?: string;
  product_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// MOVIMENTAÇÕES
// ============================================

export interface MovementCreate {
  tipo_movimentacao: string;
  quantidade: number;
  batch_id: number;
  observacoes?: string;
  localizacao?: string;
}

export interface MovementUpdate {
  tipo_movimentacao?: string;
  quantidade?: number;
  observacoes?: string;
  localizacao?: string;
}

export interface Movement {
  id: number;
  tipo_movimentacao: string;
  quantidade: number;
  batch_id: number;
  user_id: number;
  observacoes?: string;
  localizacao?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// ADMIN
// ============================================

export interface UserUpdate {
  nome?: string;
  telefone?: string;
  senha?: string;
}

export interface UsersStats {
  total_users: number;
  total_admins: number;
  total_regular_users: number;
  total_pessoa_fisica: number;
  total_pessoa_juridica: number;
}

export interface DashboardOverview {
  users: {
    total: number;
    admins: number;
    regular: number;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
  };
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
}

export interface RecentActivity {
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
  recent_users: Array<{
    id: number;
    nome: string;
    email: string;
    tipo_perfil: string;
    created_at: string;
  }>;
}

export interface ProductionSummary {
  production: Array<{
    product_name: string;
    product_code: string;
    total_batches: number;
    total_production: number;
  }>;
}

// ============================================
// PAGINAÇÃO E FILTROS
// ============================================

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface ProductFilters extends PaginationParams {
  status_filter?: boolean;
}

export interface BatchFilters extends PaginationParams {
  product_id?: number;
  status_filter?: boolean;
}

export interface MovementFilters extends PaginationParams {
  batch_id?: number;
  tipo_movimentacao?: string;
}

export interface UserFilters extends PaginationParams {
  tipo_perfil?: 'user' | 'admin';
  tipo_pessoa?: 'F' | 'J';
}

// ============================================
// ERROS
// ============================================

export interface ApiErrorResponse {
  detail: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiValidationError {
  detail: ValidationError[];
}