import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import type { Produto } from '../types/produto';
import './EtiquetaProduto.css';

interface EtiquetaProdutoProps {
  produto: Produto;
}

export const EtiquetaProduto: React.FC<EtiquetaProdutoProps> = ({ produto }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const gerarQRCode = async () => {
      try {
        const url = await QRCode.toDataURL(produto.urlRastreio, {
          width: 120,
          margin: 1,
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
      }
    };

    gerarQRCode();
  }, [produto.urlRastreio]);
  return (
    <div 
      id="etiqueta" 
      style={{
        width: '583px',
        height: '384px',
        border: '1px solid #000',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff',
        position: 'relative',
        color: '#000000',
        colorScheme: 'light' // Forçar esquema claro
      }}
    >
      {/* Título principal */}
      <div style={{ 
        fontSize: '48px', 
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
        color: '#000000'
      }}>
        {produto.nome}
      </div>

      {/* Peso líquido */}
      <div style={{ 
        fontSize: '28px',
        marginBottom: '15px',
        textAlign: 'center',
        color: '#000'
      }}>
        Peso Liquido ({produto.pesoLiquido})
      </div>

      {/* Informações da empresa */}
      <div style={{ 
        fontSize: '18px',
        lineHeight: '1.3',
        marginBottom: '5px',        
        textAlign: 'left',
        color: '#000'
      }}>
        {produto.empresa}
      </div>

      <div style={{ 
        fontSize: '18px',
        lineHeight: '1.3',
        marginBottom: '5px',
        textAlign: 'left',
        color: '#000'
      }}>
        {produto.endereco}
      </div>

      <div style={{ 
        fontSize: '18px',
        lineHeight: '1.3',
        marginBottom: '5px',
        textAlign: 'left',
        color: '#000'
      }}>
        CPF: {produto.cpf}
      </div>

      <div style={{ 
        fontSize: '18px',
        lineHeight: '1.3',
        marginBottom: '5px',
        textAlign: 'left',
        color: '#000'
      }}>
        Tel: {produto.telefone}
      </div>

      <div style={{ 
        fontSize: '18px',
        lineHeight: '1.3',
        marginBottom: '5px',
        textAlign: 'left',
        color: '#000'
      }}>
        Val: {produto.validadeAte}
      </div>

      <div style={{ 
        fontSize: '18px',
        lineHeight: '1.3',
        marginBottom: '5px',
        textAlign: 'left',
        color: '#000'
      }}>
        Código Produto: {produto.codigoProduto}
      </div>

      <div style={{ 
        fontSize: '18px',
        lineHeight: '1.3',
        marginBottom: '10px',
        textAlign: 'left',
        color: '#000'
      }}>
        Código Lote: {produto.codigoLote}
      </div>

      {/* Logos acima do QR Code */}
      <div style={{
        position: 'absolute',
        bottom: '160px',
        right: '20px',
        width: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px'
      }}>
        <img 
          src="/ProdutoOrganico.png" 
          alt="Produto Orgânico" 
          style={{ 
            width: '50px', 
            height: 'auto',
            maxHeight: '25px',
            objectFit: 'contain'
          }}
        />
        <img 
          src="/proraf.png" 
          alt="ProRAF" 
          style={{ 
            width: '70px', 
            height: 'auto',
            maxHeight: '30px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* QR Code */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '120px',
        height: '120px',
      }}>
        {qrCodeUrl ? (
          <img 
            src={qrCodeUrl} 
            alt="QR Code para rastreamento" 
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            border: '2px solid #000',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            fontSize: '8px',
            textAlign: 'left',
            backgroundColor: '#f0f0f0',
            color: '#000'
          }}>
            Carregando...
          </div>
        )}
      </div>
    </div>
  );
};