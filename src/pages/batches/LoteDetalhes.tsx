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
import { formatDateTime, trackBatchByCode, type TrackingInfo } from "@/api/traking";
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

  const handlePrint = async () => {
    if (!lote || !trackingData || !user) return;

    try {
      // Usar os mesmos dados automatizados do PDF
      const produtoData = getProdutoData();
      
      const request: PrintLabelRequest = {
        batch_code: lote.code,
        printer_name: printForm.printer_name || "ZDesigner ZT230-200dpi ZPL",
        peso: produtoData.pesoLiquido,
        endereco: produtoData.endereco,
        telefone: produtoData.telefone,
        validade_dias: 30,
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Informações principais */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Boxes className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-xl md:text-2xl mb-2 break-words">{lote.code}</CardTitle>
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
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {getStatusBadge()}
                    <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" title="Gerar PDF da Etiqueta" className="h-9 w-9">
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
                      {/* <DialogTrigger asChild>
                        <Button variant="outline" size="icon" title="Imprimir Etiqueta" className="h-9 w-9">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </DialogTrigger> */}
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Imprimir Etiqueta do Lote</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="printer_name">Nome da Impressora</Label>
                            <Input
                              id="printer_name"
                              value={printForm.printer_name}
                              onChange={(e) => setPrintForm({ ...printForm, printer_name: e.target.value })}
                              placeholder="ZDesigner ZT230-200dpi ZPL"
                            />
                          </div>
                          
                          {/* Preview das informações que serão impressas automaticamente */}
                          <div className="bg-muted/20 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">Informações da etiqueta (automáticas):</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Produto:</span>
                                <span className="font-medium">{trackingData ? (trackingData.product.comertial_name || trackingData.product.name) : "Carregando..."}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Peso:</span>
                                <span className="font-medium">{lote?.producao ? `${Number(lote.producao).toFixed(2)} ${lote.unidadeMedida || 'kg'}` : "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Produtor:</span>
                                <span className="font-medium">{user?.nome || "Carregando..."}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Endereço:</span>
                                <span className="font-medium">Alegrete - RS, Brasil</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Telefone:</span>
                                <span className="font-medium">{user?.telefone || "(55) 0000-0000"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Validade:</span>
                                <span className="font-medium">30 dias</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsPrintOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handlePrint} disabled={printLoading}>
                              <Printer className="mr-2 h-4 w-4" />
                              {printLoading ? "Imprimindo..." : "Imprimir Etiqueta"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" title="Editar Lote" className="h-9 w-9">
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
                         
                          {/* <div>
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
                              // value={editForm.producao}
                              onChange={(e) => setEditForm({ ...editForm, producao: Number(e.target.value) })}
                            />
                          </div> */}
                          <Button type="submit" disabled={updateLoading} className="w-full">
                            {updateLoading ? "Salvando..." : "Salvar"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      {/* <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="h-9 w-9">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger> */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Talhão</p>
                      <p className="font-medium break-words">{lote.talhao || "Não informado"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Produção</p>
                      <p className="font-medium break-words">{lote.producao ? `${Number(lote.producao).toFixed(2)} kg` : "Não informado"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center pt-4 border-t">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-muted-foreground text-center">QR Code para Rastreamento</p>
                    <div className="p-3 md:p-4 bg-white rounded-lg">
                      <QRCodeSVG 
                        value={`${window.location.origin}/rastrear/${lote.code}`}
                        size={120}
                        className="md:w-[160px] md:h-[160px]"
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
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
                {trackingData && trackingData.movements.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    {trackingData.movements.map((movement, index: number) => (
                      <Link to={`/movimentacoes/${movement.id}`} key={movement.id} className="no-underline hover:underline">
                      <div key={movement.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-muted/10 rounded-lg">
                        <div className="min-w-0">
                          <p className="font-medium break-words">{movement.tipo_movimentacao}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(movement.created_at)}
                          </p>
                        </div>
                        <p className="font-semibold">{movement.quantidade} kg</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma movimentação registrada para este lote
                </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Informações técnicas */}
          <div className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Datas Importantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {lote.dt_colheita && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Data de Colheita</p>
                      <p className="font-medium break-words">
                        {new Date(lote.dt_colheita).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}
                {lote.dt_expedition && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Data de Expedição</p>
                      <p className="font-medium break-words">
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
