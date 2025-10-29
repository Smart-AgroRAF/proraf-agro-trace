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
if (!erc) {
    throw new Error("ERC not defined in .env");
}

export default class ServiceAPI {

    static api = axios.create({
        baseURL: `http://localhost:3000/api/${erc}/`,
        headers: { "Content-Type": "application/json" },
    })

    private static handleError(error: unknown): never {
        const err = error as AxiosError
        console.error("Error sending to the API:", err.response?.data || err.message)
        throw err
    }

    static async mintRootBatchTx(payload: MintRootBatchPayload): Promise<any> {
        try {
            const response = await this.api.post("/mintRootBatchTx", payload)
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

