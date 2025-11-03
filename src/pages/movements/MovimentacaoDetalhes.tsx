import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRightLeft, Calendar, User, Package, MapPin, FileText, Pencil, Trash2 } from "lucide-react";
import { getMovementById, updateMovement, deleteMovement } from "@/api/movements";
import { useApi, useMutation } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const MovimentacaoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movementId = Number(id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    tipo_movimentacao: "",
    quantidade: 0,
    observacoes: "",
    localizacao: ""
  });

  const { data: movimentacao, loading, error } = useApi(
    () => getMovementById(movementId),
    [movementId]
  );

  const { mutate: updateMutation, loading: updateLoading } = useMutation(
    (data: any) => updateMovement(movementId, data)
  );

  const { mutate: deleteMutation, loading: deleteLoading } = useMutation(
    (_: void) => deleteMovement(movementId)
  );

  const handleEdit = () => {
    if (movimentacao) {
      setEditData({
        tipo_movimentacao: movimentacao.tipo_movimentacao,
        quantidade: movimentacao.quantidade,
        observacoes: movimentacao.observacoes || "",
        localizacao: movimentacao.localizacao || ""
      });
      setIsEditOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateMutation(editData);
      toast({
        title: "Sucesso",
        description: "Movimentação atualizada com sucesso",
      });
      setIsEditOpen(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar movimentação",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation(undefined);
      toast({
        title: "Sucesso",
        description: "Movimentação excluída com sucesso",
      });
      navigate("/movimentacoes");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir movimentação",
        variant: "destructive",
      });
    }
  };

  const getTipoColor = (tipo: string) => {
    const normalizedTipo = tipo?.toLowerCase();
    switch (normalizedTipo) {
      case "plantio":
        return "bg-secondary/20 text-secondary";
      case "colheita":
        return "bg-primary/20 text-primary";
      case "expedição":
      case "expedicao":
        return "bg-accent/20 text-accent";
      case "tratamento":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
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

  if (error || !movimentacao) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-destructive">Erro ao carregar a movimentação</p>
            <Link to="/movimentacoes">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Movimentações
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/movimentacoes">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Movimentações
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Informações principais */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ArrowRightLeft className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <CardTitle className="text-xl md:text-2xl break-words">Movimentação #{movimentacao.id}</CardTitle>
                        <Badge className={getTipoColor(movimentacao.tipo_movimentacao)}>{movimentacao.tipo_movimentacao}</Badge>
                      </div>
                      <Link to={`/lotes/${movimentacao.batch_id}`} className="text-primary hover:underline text-sm md:text-base break-words">
                        Lote #{movimentacao.batch_id}
                      </Link>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleEdit} className="flex-1 sm:flex-none">
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Movimentação</DialogTitle>
                          <DialogDescription>
                            Atualize as informações da movimentação
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="tipo">Tipo de Movimentação</Label>
                            <Select
                              value={editData.tipo_movimentacao}
                              onValueChange={(value) => setEditData({ ...editData, tipo_movimentacao: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="plantio">Plantio</SelectItem>
                                <SelectItem value="colheita">Colheita</SelectItem>
                                <SelectItem value="expedição">Expedição</SelectItem>
                                <SelectItem value="tratamento">Tratamento</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quantidade">Quantidade (kg)</Label>
                            <Input
                              id="quantidade"
                              type="number"
                              value={editData.quantidade}
                              onChange={(e) => setEditData({ ...editData, quantidade: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="localizacao">Localização</Label>
                            <Input
                              id="localizacao"
                              value={editData.localizacao}
                              onChange={(e) => setEditData({ ...editData, localizacao: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="observacoes">Observações</Label>
                            <Textarea
                              id="observacoes"
                              value={editData.observacoes}
                              onChange={(e) => setEditData({ ...editData, observacoes: e.target.value })}
                              rows={4}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveEdit} disabled={updateLoading}>
                            {updateLoading ? "Salvando..." : "Salvar"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="flex-1 sm:flex-none">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta movimentação? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} disabled={deleteLoading}>
                            {deleteLoading ? "Excluindo..." : "Excluir"}
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
                    <Package className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Quantidade</p>
                      <p className="font-semibold text-base md:text-lg break-words">{Number(movimentacao.quantidade).toFixed(2)} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Localização</p>
                      <p className="font-medium break-words">{movimentacao.localizacao || "Não informado"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{movimentacao.observacoes || "Sem observações"}</p>
              </CardContent>
            </Card>

          </div>

          {/* Informações técnicas */}
          <div className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Movimentação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Data de Criação</p>
                    <p className="font-medium break-words">
                      {new Date(movimentacao.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Tipo de Operação</p>
                    <Badge className={getTipoColor(movimentacao.tipo_movimentacao)}>{movimentacao.tipo_movimentacao}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to={`/lotes/${movimentacao.batch_id}`} className="w-full">
                  <Button variant="outline" className="w-full">Ver Lote Completo</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovimentacaoDetalhes;
