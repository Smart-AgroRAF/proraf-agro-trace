import { apiClient } from './client';

export interface PrintLabelRequest {
  batch_code: string;
  printer_name?: string;
  peso?: string;
  endereco?: string;
  telefone?: string;
  validade_dias?: number;
}

export interface PrintLabelResponse {
  success: boolean;
  message: string;
  batch_info?: {
    batch_code: string;
    product_name: string;
    production: number;
    unit: string;
    planting_date?: string;
    harvest_date?: string;
  };
}

/**
 * Imprime etiqueta para um lote específico
 */
export const printBatchLabel = async (request: PrintLabelRequest): Promise<PrintLabelResponse> => {
  return await apiClient.post<PrintLabelResponse>('/print/batch-label', request);
};