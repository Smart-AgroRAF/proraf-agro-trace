import { createContext, useContext, useState, type ReactNode } from "react"
import { ethers } from "ethers"

// Internal imports
import { useEthereum } from "./EthereumContext"
import { type TxStatus } from "../types/types"

export type TrackedTransaction = {
    hash: string
    description?: string
    status: TxStatus
}

interface TransactionContextType {
    transactions: TrackedTransaction[]
    sendTransaction: (tx: Record<string, any>, description: string) => Promise<string>
    sendTransactionAndWait: (tx: Record<string, any>, description: string) => Promise<TxStatus>
}

interface TransactionProviderProps {
    children: ReactNode
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export const TransactionProvider = (props: TransactionProviderProps) => {

    const { ethereum } = useEthereum()

    const [transactions, setTransactions] = useState<TrackedTransaction[]>([])

    const updateTxStatus = (hash: string, status: TxStatus) => {
        setTransactions((prev) =>
            prev.map((tx) => (tx.hash === hash ? { ...tx, status } : tx))
        )
    }

    const _sendTx = async (tx: Record<string, any>): Promise<string> => {
        const txHash = await ethereum.request({
            method: "eth_sendTransaction",
            params: [tx],
        });
        return txHash as string;
    }

    const _trackTx = async (hash: string, description?: string): Promise<TxStatus> => {
        setTransactions((prev) => {
            // Avoid adding duplicates if already there
            if (prev.find(t => t.hash === hash)) return prev;
            return [{ hash, description, status: "pending" }, ...prev.slice(0, 49)];
        });

        try {
            const provider = new ethers.BrowserProvider(ethereum);
            const receipt = await provider.waitForTransaction(hash);
            const status: TxStatus = receipt?.status === 1 ? "confirmed" : "failed";
            updateTxStatus(hash, status);
            return status;
        } catch (e) {
            console.error("Error monitoring transaction:", e);
            updateTxStatus(hash, "failed");
            return "failed";
        }
    };

    const sendTransaction = async (tx: Record<string, any>, description: string): Promise<string> => {
        try {
            const txHash = await _sendTx(tx);
            _trackTx(txHash, description); // Fire-and-forget
            return txHash;
        } catch (error) {
            console.error("Error sending transaction:", error);
            throw error;
        }
    };

    const sendTransactionAndWait = async (tx: Record<string, any>, description: string): Promise<TxStatus> => {
        try {
            const txHash = await _sendTx(tx);
            return await _trackTx(txHash, description);
        } catch (error) {
            console.error("Error sending transaction and waiting:", error);
            return "failed";
        }
    };


    return (
        <TransactionContext.Provider value={{ transactions, sendTransaction, sendTransactionAndWait }}>
            {props.children}
        </TransactionContext.Provider>
    )
}

export const useTransactions = () => {
    const context = useContext(TransactionContext)
    if (!context) throw new Error("useTransactions must be used within TransactionProvider")
    return context
}
