import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Boxes, Calendar, MapPin, Package, Activity, Pencil, Trash2, Printer, FileDown } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useApi, useMutation } from "@/hooks/useApi";
import { getBatchById, deleteBatch, updateBatch } from "@/api/batches";
import { printBatchLabel, type PrintLabelRequest } from "@/api/print";
import { trackBatchByCode, type TrackingInfo } from "@/api/traking";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EtiquetaProduto } from "@/components/EtiquetaProduto";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import type { Produto } from "@/types/produto";
import { useState } from "react";

const LoteDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    dt_colheita: "",
    dt_expedition: "",
    producao: 0,
    talhao: "",
  });
  const [printForm, setPrintForm] = useState({
    printer_name: "ZDesigner ZT230-200dpi ZPL",
    peso: "",
    endereco: "",
    telefone: "",
    validade_dias: 30,
  });

  // Buscar dados do lote
  const { data: lote, loading, error } = useApi(
    () => getBatchById(Number(id)),
    [id]
  );

  // Buscar dados completos de rastreamento
  const { data: trackingData, loading: trackingLoading } = useApi(
    () => lote ? trackBatchByCode(lote.code) : Promise.reject("Lote não encontrado"),
    [lote?.code]
  );

  // Mutation para deletar
  const { mutate: deleteBatchMutation, loading: deleteLoading } = useMutation(deleteBatch);

  // Mutation para atualizar
  const { mutate: updateBatchMutation, loading: updateLoading } = useMutation(
    (data: { batchId: number; updateData: any }) => updateBatch(data.batchId, data.updateData)
  );

  // Mutation para impressão
  const { mutate: printLabelMutation, loading: printLoading } = useMutation(printBatchLabel);

  // Hook para geração de PDF
  const { gerarPDF } = usePDFGenerator();

  const handleDelete = async () => {
    try {
      await deleteBatchMutation(Number(id));
      toast({
        title: "Lote deletado",
        description: "O lote foi removido com sucesso.",
      });
      navigate("/lotes");
    } catch (error) {
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar o lote.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBatchMutation({
        batchId: Number(id),
        updateData: {
          dt_colheita: editForm.dt_colheita || undefined,
          dt_expedition: editForm.dt_expedition || undefined,
          producao: editForm.producao || undefined,
          talhao: editForm.talhao || undefined,
        },
      });
      
      toast({
        title: "Lote atualizado",
        description: "As informações foram atualizadas com sucesso.",
      });
      setIsEditOpen(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o lote.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lote) return;

    try {
      const request: PrintLabelRequest = {
        batch_code: lote.code,
        printer_name: printForm.printer_name || undefined,
        peso: printForm.peso || undefined,
        endereco: printForm.endereco || undefined,
        telefone: printForm.telefone || undefined,
        validade_dias: printForm.validade_dias || undefined,
      };

      const response = await printLabelMutation(request);
      
      toast({
        title: "Etiqueta impressa!",
        description: response.message,
      });
      setIsPrintOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro ao imprimir",
        description: error.message || "Não foi possível imprimir a etiqueta.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const sucesso = await gerarPDF('etiqueta-pdf', `etiqueta-lote-${lote?.code}.pdf`);
      
      if (sucesso) {
        toast({
          title: "PDF gerado!",
          description: "A etiqueta foi salva como PDF com sucesso.",
        });
        setIsPdfOpen(false);
      } else {
        toast({
          title: "Erro ao gerar PDF",
          description: "Não foi possível gerar o PDF da etiqueta.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  // Função para truncar nome a máximo 10 caracteres
  const truncateName = (name: string, maxLength: number = 10): string => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength).trim();
  };

  // Mapear dados do lote para o formato da etiqueta (automático com dados reais)
  const getProdutoData = (): Produto => {
    if (!lote || !trackingData || !user) {
      return {
        nome: "",
        pesoLiquido: "",
        empresa: "",
        endereco: "",
        cpf: "",
        telefone: "",
        validadeAte: "",
        codigoProduto: "",
        codigoLote: "",
        urlRastreio: "",
      };
    }

    const validadeDate = new Date();
    validadeDate.setDate(validadeDate.getDate() + 30); // 30 dias de validade padrão

    // Usar nome comercial se disponível, senão nome do produto, limitado a 10 caracteres
    const productName = trackingData.product.comertial_name || trackingData.product.name;
    const truncatedName = truncateName(productName);

    // Formatação do CPF/CNPJ baseado no tipo de pessoa
    const formatCpfCnpj = (documento?: string, tipoPessoa?: 'F' | 'J'): string => {
      if (!documento) return "Não informado";
      
      if (tipoPessoa === 'F') {
        // CPF: 000.000.000-00
        const cpf = documento.replace(/\D/g, '');
        if (cpf.length === 11) {
          return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
      } else if (tipoPessoa === 'J') {
        // CNPJ: 00.000.000/0000-00
        const cnpj = documento.replace(/\D/g, '');
        if (cnpj.length === 14) {
          return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
      }
      
      return documento;
    };

    return {
      nome: truncatedName, // Nome da fruta/produto com máximo 10 caracteres
      pesoLiquido: lote.producao ? `${Number(lote.producao).toFixed(2)} ${lote.unidadeMedida}` : "N/A",
      empresa: user.nome, // Nome do usuário produtor logado
      endereco: "Alegrete - RS, Brasil", // Endereço padrão do sistema
      cpf: formatCpfCnpj(user.cpf || user.cnpj, user.tipo_pessoa), // CPF/CNPJ real formatado
      telefone: user.telefone || "(55) 0000-0000", // Telefone real ou padrão
      validadeAte: validadeDate.toLocaleDateString("pt-BR"),
      codigoProduto: trackingData.product.code,
      codigoLote: lote.code,
      urlRastreio: `${window.location.origin}/rastrear/${lote.code}`,
    };
  };

  if (loading || trackingLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        {/* <Navbar /> */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lote) {
    return (
      <div className="min-h-screen bg-background">
        {/* <Navbar /> */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-destructive">Erro ao carregar o lote</p>
            <Button onClick={() => navigate("/lotes")}>Voltar para Lotes</Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (lote.dt_expedition) return <Badge className="bg-muted text-muted-foreground">Expedido</Badge>;
    if (lote.dt_colheita) return <Badge className="bg-primary/20 text-primary">Colheita</Badge>;
    return <Badge className="bg-secondary/20 text-secondary">Plantio</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-8">
        <Link to="/lotes">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Lotes
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações principais */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Boxes className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">{lote.code}</CardTitle>
                      {trackingData ? (
                        <div>
                          <Link to={`/produtos/${lote.product_id}`} className="text-primary hover:underline text-lg font-medium">
                            {trackingData.product.name}
                          </Link>
                          {trackingData.product.comertial_name && (
                            <p className="text-sm text-muted-foreground">
                              {trackingData.product.comertial_name}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Link to={`/produtos/${lote.product_id}`} className="text-primary hover:underline">
                          Produto #{lote.product_id}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge()}
                    <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" title="Gerar PDF da Etiqueta">
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                          <DialogTitle>Gerar PDF da Etiqueta</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Preview da etiqueta */}
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-4">
                              Preview da etiqueta que será gerada automaticamente:
                            </p>
                            <div className="flex justify-center bg-gray-50 p-6 rounded-lg">
                              <div style={{ transform: 'scale(0.7)', transformOrigin: 'center' }}>
                                <EtiquetaProduto produto={getProdutoData()} />
                              </div>
                            </div>
                          </div>

                          {/* Hidden full-size version for PDF generation */}
                          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                            <div id="etiqueta-pdf">
                              <EtiquetaProduto produto={getProdutoData()} />
                            </div>
                          </div>

                          {/* Botões de ação */}
                          <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsPdfOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleGeneratePDF}>
                              <FileDown className="mr-2 h-4 w-4" />
                              Gerar PDF
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={isPrintOpen} onOpenChange={setIsPrintOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" title="Imprimir Etiqueta">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Imprimir Etiqueta do Lote</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handlePrint} className="space-y-4">
                          <div>
                            <Label htmlFor="printer_name">Nome da Impressora</Label>
                            <Input
                              id="printer_name"
                              value={printForm.printer_name}
                              onChange={(e) => setPrintForm({ ...printForm, printer_name: e.target.value })}
                              placeholder="ZDesigner ZT230-200dpi ZPL"
                            />
                          </div>
                          <div>
                            <Label htmlFor="peso">Peso (opcional)</Label>
                            <Input
                              id="peso"
                              value={printForm.peso}
                              onChange={(e) => setPrintForm({ ...printForm, peso: e.target.value })}
                              placeholder="Ex: 1.5kg"
                            />
                          </div>
                          <div>
                            <Label htmlFor="endereco">Endereço (opcional)</Label>
                            <Textarea
                              id="endereco"
                              value={printForm.endereco}
                              onChange={(e) => setPrintForm({ ...printForm, endereco: e.target.value })}
                              placeholder="Endereço para impressão na etiqueta"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label htmlFor="telefone">Telefone (opcional)</Label>
                            <Input
                              id="telefone"
                              value={printForm.telefone}
                              onChange={(e) => setPrintForm({ ...printForm, telefone: e.target.value })}
                              placeholder="(00) 00000-0000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="validade_dias">Validade (dias)</Label>
                            <Input
                              id="validade_dias"
                              type="number"
                              value={printForm.validade_dias}
                              onChange={(e) => setPrintForm({ ...printForm, validade_dias: Number(e.target.value) })}
                              placeholder="30"
                              min="1"
                            />
                          </div>
                          <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsPrintOpen(false)}>
                              Cancelar
                            </Button>
                            <Button type="submit" disabled={printLoading}>
                              {printLoading ? "Imprimindo..." : "Imprimir Etiqueta"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" title="Editar Lote">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Lote</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                          <div>
                            <Label htmlFor="talhao">Talhão</Label>
                            <Input
                              id="talhao"
                              type="text"
                              value={editForm.talhao}
                              onChange={(e) => setEditForm({ ...editForm, talhao: e.target.value })}
                              placeholder="Ex: Talhão A1"
                            />
                          </div>
                         
                          <div>
                            <Label htmlFor="dt_expedition">Data de Expedição</Label>
                            <Input
                              id="dt_expedition"
                              type="date"
                              value={editForm.dt_expedition}
                              onChange={(e) => setEditForm({ ...editForm, dt_expedition: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="producao">Produção (kg)</Label>
                            <Input
                              id="producao"
                              type="number"
                              value={editForm.producao}
                              onChange={(e) => setEditForm({ ...editForm, producao: Number(e.target.value) })}
                            />
                          </div>
                          <Button type="submit" disabled={updateLoading} className="w-full">
                            {updateLoading ? "Salvando..." : "Salvar"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O lote será removido permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} disabled={deleteLoading}>
                            {deleteLoading ? "Deletando..." : "Deletar"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Talhão</p>
                      <p className="font-medium">{lote.talhao || "Não informado"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Produção</p>
                      <p className="font-medium">{lote.producao ? `${Number(lote.producao).toFixed(2)} kg` : "Não informado"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center pt-4 border-t">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-muted-foreground">QR Code para Rastreamento</p>
                    <div className="p-4 bg-white rounded-lg">
                      <QRCodeSVG 
                        value={`${window.location.origin}/rastrear/${lote.code}`}
                        size={160}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Escaneie para rastrear
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline de movimentações */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Movimentações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  As movimentações serão exibidas quando vinculadas ao lote
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Informações técnicas */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Datas Importantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {lote.dt_colheita && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Colheita</p>
                      <p className="font-medium">
                        {new Date(lote.dt_colheita).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}
                {lote.dt_expedition && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Expedição</p>
                      <p className="font-medium">
                        {new Date(lote.dt_expedition).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Produção</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Produzido</span>
                  <span className="font-semibold text-2xl">
                    {lote.producao ? `${Number(lote.producao).toFixed(2)} kg` : "Não informado"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold">
                    {lote.status ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoteDetalhes;
