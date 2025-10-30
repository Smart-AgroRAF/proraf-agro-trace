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

    let currentAccount = account;
    
    if (!currentAccount) {
      try {
        await connectWallet();
        // Aguardar um pouco para a conta ser atualizada
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Tentar obter a conta novamente
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
          currentAccount = accounts[0];
          console.log('Accounts obtidas:', accounts);
        }
        
        if (!currentAccount) {
          throw new Error("Não foi possível obter endereço da carteira");
        }
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
        from: currentAccount,
        to: currentAccount, // o próprio usuário será o proprietário do token
        productName: payload.productName,
        productExpeditionDate: payload.expeditionDate,
        productType: payload.productType,
        batchId: payload.batchId,
        unitOfMeasure: convertUnitOfMeasure(payload.unitOfMeasure),
        batchQuantity: Math.floor(payload.quantity), // garantindo que seja um inteiro
      };

      console.log('Payload para blockchain:', mintPayload);
      console.log('Account atual:', currentAccount);

      toast({
        title: "Processando transação blockchain...",
        description: "Preparando transação para a blockchain",
      });

      const result = await ServiceAPI.mintRootBatchTx(mintPayload);
      
      console.log('Resultado da API blockchain:', result);
      
      // Verificar se temos uma transação para assinar
      if (result && result.from && result.to && result.data) {
        console.log('Recebida transação não assinada, enviando para MetaMask...');
        
        toast({
          title: "Aguardando assinatura...",
          description: "Por favor, confirme a transação na MetaMask",
        });
        
        try {
          // Enviar transação via MetaMask
          const txHash = await window.ethereum!.request({
            method: 'eth_sendTransaction',
            params: [{
              from: result.from,
              to: result.to,
              data: result.data,
              value: result.value || '0x0'
            }]
          }) as string;
          
          console.log('Transação enviada! Hash:', txHash);
          
          toast({
            title: "Sucesso!",
            description: `Lote registrado na blockchain. Hash: ${txHash.slice(0, 10)}...`,
          });
          return true;
          
        } catch (txError: any) {
          console.error('Erro ao enviar transação:', txError);
          throw new Error(`Erro ao assinar transação: ${txError.message}`);
        }
      }
      
      // Verificar formatos alternativos de sucesso
      if (result && (result.hash || result.transactionHash || result.success)) {
        const hash = result.hash || result.transactionHash;
        toast({
          title: "Sucesso!",
          description: hash ? `Lote registrado na blockchain. Hash: ${hash.slice(0, 10)}...` : "Lote registrado na blockchain com sucesso!",
        });
        return true;
      }
      
      console.error("Resposta inesperada da API:", result);
      throw new Error(`Formato de resposta não reconhecido: ${JSON.stringify(result)}`);
      

    } catch (error: any) {
      console.error("Erro ao registrar na blockchain:", error);
      
      // Se a API estiver offline ou endpoint não existir, mostramos apenas um aviso mas não falha
      if (
        error.message?.includes("Network Error") || 
        error.code === "ECONNREFUSED" ||
        error.response?.status === 404 ||
        error.message?.includes("Cannot GET") ||
        error.message?.includes("Cannot POST")
      ) {
        toast({
          title: "API Blockchain indisponível",
          description: "Lote foi salvo no banco de dados. A API blockchain pode estar offline ou em manutenção.",
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