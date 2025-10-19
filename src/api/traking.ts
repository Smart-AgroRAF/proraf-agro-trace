// api/tracking.ts
// Funções para rastreamento público de lotes (não requer login)

import { apiClient } from './client';

/**
 * Rastreia um lote pelo código
 * NÃO requer autenticação de usuário, apenas API Key
 * 
 * @example
 * const tracking = await trackBatchByCode('LOTE-2025-001');
 * console.log(tracking.product.name); // "Tomate Cereja"
 */
export const trackBatchByCode = async (batchCode: string): Promise<TrackingInfo> => {
  return apiClient.get<TrackingInfo>(`/tracking/${batchCode}`, { 
    requiresAuth: false 
  });
};

/**
 * Rastreia um lote pelo QR Code
 * NÃO requer autenticação de usuário, apenas API Key
 * 
 * @example
 * const tracking = await trackBatchByQRCode('QR-abc123');
 * console.log(tracking.producer.nome); // "João Silva"
 */
export const trackBatchByQRCode = async (qrcode: string): Promise<TrackingInfo> => {
  return apiClient.get<TrackingInfo>(`/tracking/qr/${qrcode}`, { 
    requiresAuth: false 
  });
};

// ============================================
// TIPOS
// ============================================

export interface TrackingInfo {
  batch: {
    id: number;
    code: string;
    dt_plantio: string | null;
    dt_colheita: string | null;
    dt_expedition: string | null;
    producao: number;
    talhao: string | null;
    qrcode: string | null;
    status: boolean;
    created_at: string;
  };
  product: {
    id: number;
    name: string;
    comertial_name: string | null;
    description: string | null;
    variedade_cultivar: string | null;
    image: string | null;
    code: string;
  };
  producer: {
    nome: string;
    tipo_pessoa: 'F' | 'J';
    tipo_perfil: string;
    // Dados sensíveis NÃO são retornados (email, cpf, cnpj, telefone)
  };
  movements: Array<{
    id: number;
    tipo_movimentacao: string;
    quantidade: number;
    created_at: string;
  }>;
  stats: {
    total_movements: number;
    days_since_planting: number | null;
    total_production: number;
  };
}

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Formata data para exibição em português
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Não informado';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formata data e hora para exibição
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Obtém URL completa da imagem do produto
 */
export const getProductImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return '/images/no-product.png';
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return `${baseUrl}${imagePath}`;
};

/**
 * Calcula status do lote baseado nas datas
 */
export const getBatchStatus = (batch: TrackingInfo['batch']): BatchStatus => {
  if (!batch.status) return 'Inativo';
  
  if (batch.dt_expedition) return 'Expedido';
  if (batch.dt_colheita) return 'Colhido';
  if (batch.dt_plantio) return 'Em Cultivo';
  
  return 'Registrado';
};

/**
 * Obtém cor do status para UI
 */
export const getStatusColor = (status: BatchStatus): string => {
  const colors: Record<BatchStatus, string> = {
    'Expedido': 'text-green-600 bg-green-100',
    'Colhido': 'text-blue-600 bg-blue-100',
    'Em Cultivo': 'text-yellow-600 bg-yellow-100',
    'Registrado': 'text-gray-600 bg-gray-100',
    'Inativo': 'text-red-600 bg-red-100'
  };
  
  return colors[status];
};

/**
 * Calcula percentual de perda (opcional)
 */
export const calculateLossPercentage = (movements: TrackingInfo['movements']): number => {
  if (movements.length === 0) return 0;
  
  const firstMovement = movements[0];
  const lastMovement = movements[movements.length - 1];
  
  if (!firstMovement || !lastMovement) return 0;
  
  const initialQuantity = firstMovement.quantidade;
  const finalQuantity = lastMovement.quantidade;
  
  if (initialQuantity === 0) return 0;
  
  const loss = ((initialQuantity - finalQuantity) / initialQuantity) * 100;
  return Math.max(0, loss);
};

/**
 * Agrupa movimentações por tipo
 */
export const groupMovementsByType = (
  movements: TrackingInfo['movements']
): Record<string, number> => {
  return movements.reduce((acc, movement) => {
    const type = movement.tipo_movimentacao;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

// ============================================
// TIPOS ADICIONAIS
// ============================================

export type BatchStatus = 
  | 'Expedido' 
  | 'Colhido' 
  | 'Em Cultivo' 
  | 'Registrado' 
  | 'Inativo';

export interface TrackingSummary {
  batchCode: string;
  productName: string;
  producerName: string;
  status: BatchStatus;
  totalMovements: number;
  daysSincePlanting: number | null;
}

/**
 * Cria resumo simplificado do rastreamento
 */
export const createTrackingSummary = (info: TrackingInfo): TrackingSummary => {
  return {
    batchCode: info.batch.code,
    productName: info.product.name,
    producerName: info.producer.nome,
    status: getBatchStatus(info.batch),
    totalMovements: info.stats.total_movements,
    daysSincePlanting: info.stats.days_since_planting
  };
};