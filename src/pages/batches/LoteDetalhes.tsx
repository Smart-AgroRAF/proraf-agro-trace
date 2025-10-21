import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Boxes, Calendar, MapPin, Package, Activity, Pencil, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useApi, useMutation } from "@/hooks/useApi";
import { getBatchById, deleteBatch, updateBatch } from "@/api/batches";
import { useToast } from "@/hooks/use-toast";
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
import { useState } from "react";

const LoteDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    dt_colheita: "",
    dt_expedition: "",
    producao: 0,
    talhao: "",
  });

  // Buscar dados do lote
  const { data: lote, loading, error } = useApi(
    () => getBatchById(Number(id)),
    [id]
  );

  // Mutation para deletar
  const { mutate: deleteBatchMutation, loading: deleteLoading } = useMutation(deleteBatch);

  // Mutation para atualizar
  const { mutate: updateBatchMutation, loading: updateLoading } = useMutation(
    (data: { batchId: number; updateData: any }) => updateBatch(data.batchId, data.updateData)
  );

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        
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
                      <Link to={`/produtos/${lote.product_id}`} className="text-primary hover:underline">
                        Produto #{lote.product_id}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge()}
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
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
                            <Label htmlFor="dt_colheita">Data de Colheita</Label>
                            <Input
                              id="dt_colheita"
                              type="date"
                              value={editForm.dt_colheita}
                              onChange={(e) => setEditForm({ ...editForm, dt_colheita: e.target.value })}
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
                      <p className="font-medium">{lote.producao ? `${lote.producao} kg` : "Não informado"}</p>
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
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Plantio</p>
                    <p className="font-medium">
                      {new Date(lote.dt_plantio).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
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
                    {lote.producao ? `${lote.producao} kg` : "Não informado"}
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
