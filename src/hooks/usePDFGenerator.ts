import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const usePDFGenerator = () => {
  const gerarPDF = async (elementId: string, nomeArquivo: string = 'etiqueta-produto.pdf') => {
    try {
      const elemento = document.getElementById(elementId);
      if (!elemento) {
        throw new Error('Elemento não encontrado');
      }

      // Captura o elemento como canvas
      const canvas = await html2canvas(elemento, {
        scale: 2, // Melhor qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Dimensões da etiqueta em pixels
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Converter para formato adequado para PDF
      const imgData = canvas.toDataURL('image/png');

      // Criar PDF com dimensões proporcionais
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });

      // Adicionar imagem ao PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Fazer download do PDF
      pdf.save(nomeArquivo);

      return true;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      return false;
    }
  };

  return { gerarPDF };
};