import { useState } from "react";
import { useEthereum } from "@/smartContract/contexts/EthereumContext";
import { useTransactions } from "@/smartContract/contexts/TransactionContext";
import ServiceAPI from "@/smartContract/service/ServiceAPI";
import type { MintRootBatchPayload } from "@/smartContract/types/payloads";
import type { UnitOfMeasure } from "@/smartContract/types/types";
import { useToast } from "@/hooks/use-toast";

// Função para converter unidade de medida da API padrão para blockchain
const convertUnitOfMeasure = (unit: string): UnitOfMeasure => {
  const unitMap: Record<string, UnitOfMeasure> = {
    "kg": "kg",
    "ton": "kg", // convertemos toneladas para kg
    "un": "un",
    "cx": "cn", // caixas para containers
    "g": "g"
  };
  return unitMap[unit] || "kg"; // default para kg
};

export const useSmartContract = () => {
  const [loading, setLoading] = useState(false);
  const { account, connectWallet, metaMaskMissing } = useEthereum();
  const { sendTransactionAndWait } = useTransactions();
  const { toast } = useToast();

  const mintRootBatch = async (payload: {
    productName: string;
    productType: string;
    batchId: string;
    expeditionDate: string;
    quantity: number;
    unitOfMeasure: string;
  }) => {
    if (metaMaskMissing) {
      toast({
        title: "MetaMask necessária",
        description: "Por favor, instale a MetaMask para usar recursos blockchain",
        variant: "destructive",
      });
      return false;
    }

    if (!account) {
      try {
        await connectWallet();
      } catch (error) {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar à MetaMask",
          variant: "destructive",
        });
        return false;
      }
    }

    setLoading(true);

    try {
      const mintPayload: MintRootBatchPayload = {
        from: account,
        to: account, // o próprio usuário será o proprietário do token
        productName: payload.productName,
        productExpeditionDate: payload.expeditionDate,
        productType: payload.productType,
        batchId: payload.batchId,
        unitOfMeasure: convertUnitOfMeasure(payload.unitOfMeasure),
        batchQuantity: Math.floor(payload.quantity), // garantindo que seja um inteiro
      };

      toast({
        title: "Processando transação blockchain...",
        description: "Aguarde enquanto criamos o smart contract",
      });

      const result = await ServiceAPI.mintRootBatchTx(mintPayload);
      
      if (result.hash) {
        toast({
          title: "Sucesso!",
          description: `Lote registrado na blockchain. Hash: ${result.hash.slice(0, 10)}...`,
        });
        return true;
      } else {
        throw new Error("Transação falhou");
      }

    } catch (error: any) {
      console.error("Erro ao registrar na blockchain:", error);
      
      // Se a API estiver offline, mostramos apenas um aviso mas não falha
      if (error.message?.includes("Network Error") || error.code === "ECONNREFUSED") {
        toast({
          title: "API Blockchain indisponível",
          description: "Lote foi salvo no banco de dados, mas não foi possível registrar na blockchain",
        });
        return true; // continuamos o processo
      }

      toast({
        title: "Erro na blockchain",
        description: error.message || "Erro ao registrar lote na blockchain",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    mintRootBatch,
    loading,
    account,
    metaMaskMissing,
    connectWallet
  };
};