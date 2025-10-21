import { vi } from 'vitest';
import type { User, Product, Batch, Movement } from '@/api/types';

export const mockUser: User = {
  id: 1,
  nome: 'Usuário Teste',
  email: 'teste@exemplo.com',
  tipo_pessoa: 'F',
  cpf: '12345678900',
  tipo_perfil: 'user',
  telefone: '51999999999',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockAdminUser: User = {
  ...mockUser,
  id: 2,
  tipo_perfil: 'admin',
  email: 'admin@exemplo.com',
};

export const mockProduct: Product = {
  id: 1,
  name: 'Produto Teste',
  comertial_name: 'Produto Comercial',
  description: 'Descrição do produto teste',
  variedade_cultivar: 'Variedade A',
  status: true,
  image: 'https://exemplo.com/image.jpg',
  code: 'PROD001',
  user_id: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockBatch: Batch = {
  id: 1,
  code: 'LOTE001',
  product_id: 1,
  user_id: 1,
  dt_plantio: '2024-01-01',
  dt_colheita: '2024-06-01',
  dt_expedition: '2024-06-15',
  status: true,
  talhao: 'Talhão A',
  registro_talhao: true,
  producao: 100,
  qrcode: 'https://exemplo.com/qr/LOTE001',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockMovement: Movement = {
  id: 1,
  batch_id: 1,
  user_id: 1,
  tipo_movimentacao: 'entrada',
  quantidade: 50,
  observacoes: 'Observação teste',
  localizacao: 'Armazém A',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Mock das funções de API
export const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  postForm: vi.fn(),
};

export const mockAuthApi = {
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  isAuthenticated: vi.fn(),
  getToken: vi.fn(),
};

export const mockUserApi = {
  getCurrentUser: vi.fn(),
  updateUser: vi.fn(),
  getUsers: vi.fn(),
};

export const mockProductsApi = {
  getProducts: vi.fn(),
  getProductById: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
};

export const mockBatchesApi = {
  getBatches: vi.fn(),
  getBatchById: vi.fn(),
  createBatch: vi.fn(),
  updateBatch: vi.fn(),
  deleteBatch: vi.fn(),
};

export const mockMovementsApi = {
  getMovements: vi.fn(),
  getMovementById: vi.fn(),
  createMovement: vi.fn(),
  updateMovement: vi.fn(),
  deleteMovement: vi.fn(),
};
