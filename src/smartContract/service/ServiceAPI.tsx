import axios, { AxiosError } from "axios"

import type {
    MintRootBatchPayload,
    SplitBatchPayload,
    SetProductIsActivePayload,
    AddStatusPayload,
    GetUsersBatchesPayload,
    GetBatchProductsPayload,
    GetBatchHistoriesPayload,
    GetTokensByBatchIdPayload,
} from "../types/payloads"

// Import environment variables from .env file
const erc = import.meta.env.VITE_ERC
const blockchainApiUrl = import.meta.env.VITE_BLOCKCHAIN_API_URL || 'http://localhost:3000'

if (!erc) {
    throw new Error("ERC not defined in .env");
}

export default class ServiceAPI {

    static api = axios.create({
        baseURL: `${blockchainApiUrl}/api/${erc}/`,
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
    })

    private static handleError(error: unknown): never {
        const err = error as AxiosError
        console.error("Error details:", {
            message: err.message,
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            config: {
                url: err.config?.url,
                method: err.config?.method,
                baseURL: err.config?.baseURL
            }
        });
        throw err
    }

    static async mintRootBatchTx(payload: MintRootBatchPayload): Promise<any> {
        try {
            console.log('Dados enviados para a API blockchain:', payload);
            
            // Validações básicas antes do envio
            if (!payload.productName || !payload.batchId) {
                throw new Error("Nome do produto e código do lote são obrigatórios");
            }

            if (!payload.batchQuantity || payload.batchQuantity <= 0) {
                throw new Error("Quantidade deve ser maior que zero");
            }

            // Validar formato da data
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(payload.productExpeditionDate)) {
                throw new Error("Data deve estar no formato YYYY-MM-DD");
            }

            if (!payload.from || !payload.to) {
                throw new Error("Endereços from e to são obrigatórios");
            }

            const response = await this.api.post("/mintRootBatchTx", payload)
            console.log('Resposta da API blockchain:', response.data);
            return response.data
        } catch (error) {
            this.handleError(error)
        }
    }

    static async splitBatch(payload: SplitBatchPayload): Promise<any> {
        try {
            const response = await this.api.post("/splitBatchTx", payload)
            return response.data
        } catch (error) {
            this.handleError(error)
        }
    }

    static async setProductIsActiveTx(payload: SetProductIsActivePayload): Promise<any> {
        try {
            const response = await this.api.post("/setProductIsActiveTx", payload)
            return response.data
        } catch (error) {
            this.handleError(error)
        }
    }

    static async addStatusTx(payload: AddStatusPayload): Promise<any> {
        try {
            const response = await this.api.post("/addStatusTx", payload)
            return response.data
        } catch (error) {
            this.handleError(error)
        }
    }

    static async getUsersBatches(payload: GetUsersBatchesPayload): Promise<any> {
        try {
            const response = await this.api.post("/getUsersBatches", payload)
            return response.data
        } catch (error) {
            this.handleError(error)
        }
    }

    static async getTokensByBatchId(payload: GetTokensByBatchIdPayload): Promise<any> {
        try {
            const response = await this.api.post("/getTokensByBatchId", payload)
            return response.data
        } catch (error) {
            this.handleError(error)
        }
    }

    static async getBatchProducts(payload: GetBatchProductsPayload): Promise<any> {
        try {
            const response = await this.api.post("/getBatchProducts", payload)
            return response.data
        } catch (error) {
            this.handleError(error)
        }
    }

    static async getBatchHistories(payload: GetBatchHistoriesPayload): Promise<any> {
        try {
            const response = await this.api.post("/getBatchHistories", payload)
            return response.data
        } catch (error) {
            this.handleError(error)
        }
    }
}

