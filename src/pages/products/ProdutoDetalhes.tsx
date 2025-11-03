import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calendar, Hash, Tag, Edit, Trash2, Loader2 } from "lucide-react";
import { getProductById, updateProduct, deleteProduct } from "@/api/products";
import { listBatchesByProduct } from "@/api/batches";
import type { Product, Batch, ProductUpdate } from "@/api/types";
import { useToast } from "@/hooks/use-toast";
import { get } from "http";

const ProdutoDetalhes = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [produto, setProduto] = useState<Product | null>(null);
  const [lotes, setLotes] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [imageError, setImageError] = useState(false);
          {console.log(produto)}
  
const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    
    // Se já é uma URL completa, retorna como está
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Se é um caminho relativo, constrói a URL completa
    // Use import.meta.env para Vite ou configure a variável de ambiente
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    return `${baseURL}${imagePath}`;
  };

  useEffect(() => {
    setImageError(false);
  }, [produto?.image]);
  // Form state for editing
  const [editForm, setEditForm] = useState<ProductUpdate>({
    name: "",
    comertial_name: "",
    description: "",
    variedade_cultivar: "",
    status: true,
    image: ""
  });

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError("ID do produto não encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [productData, batchesData] = await Promise.all([
          getProductById(Number(id)),
          listBatchesByProduct(Number(id))
        ]);
        
        setProduto(productData);
        setLotes(batchesData);
        
        // Initialize edit form with current data
        setEditForm({
          name: productData.name,
          comertial_name: productData.comertial_name || "",
          description: productData.description || "",
          variedade_cultivar: productData.variedade_cultivar || "",
          status: productData.status,
          image: productData.image || ""
        });
        
      } catch (err: any) {
        console.error("Erro ao carregar produto:", err);
        setError(err.message || "Erro ao carregar dados do produto");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produto) return;

    try {
      setUpdateLoading(true);
      const updatedProduct = await updateProduct(produto.id, editForm);
      setProduto(updatedProduct);
      setEditModalOpen(false);
      toast({
        title: "Produto atualizado",
        description: "As informações do produto foram atualizadas com sucesso.",
      });
    } catch (err: any) {
      console.error("Erro ao atualizar produto:", err);
      toast({
        title: "Erro ao atualizar",
        description: err.message || "Não foi possível atualizar o produto.",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };
  
  // Handle product deletion
  const handleDelete = async () => {
    if (!produto) return;

    try {
      setDeleteLoading(true);
      await deleteProduct(produto.id);
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso.",
      });
      navigate("/produtos");
    } catch (err: any) {
      console.error("Erro ao excluir produto:", err);
      toast({
        title: "Erro ao excluir",
        description: err.message || "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Helper function to get batch status display
  const getBatchStatus = (batch: Batch) => {
    if (!batch.status) return "Inativo";
    
    if (batch.dt_expedition) return "Expedido";
    if (batch.dt_colheita) return "Colhido";
    if (batch.dt_plantio) return "Plantado";
    
    return "Cadastrado";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando produto...</span>
        </div>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link to="/produtos">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Produtos
            </Button>
          </Link>
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  {error || "Produto não encontrado"}
                </p>
                <Link to="/produtos">
                  <Button>Voltar para Produtos</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Link to="/produtos">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Produtos
            </Button>
          </Link>
          
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            {/* Edit Button */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Editar Produto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="comertial_name">Nome Comercial</Label>
                    <Input
                      id="comertial_name"
                      value={editForm.comertial_name}
                      onChange={(e) => setEditForm({ ...editForm, comertial_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="variedade_cultivar">Variedade/Cultivar</Label>
                    <Input
                      id="variedade_cultivar"
                      value={editForm.variedade_cultivar}
                      onChange={(e) => setEditForm({ ...editForm, variedade_cultivar: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">URL da Imagem</Label>
                    <Input
                      id="image"
                      value={editForm.image}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={editForm.status}
                      onCheckedChange={(checked) => setEditForm({ ...editForm, status: checked })}
                    />
                    <Label htmlFor="status">Produto Ativo</Label>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={updateLoading}>
                      {updateLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Salvar
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1 sm:flex-none">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o produto "{produto.name}"? 
                    Esta ação não pode ser desfeita e todos os lotes relacionados também serão afetados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Informações principais */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {produto.image && !imageError ? (
                        <img 
                          src={getImageUrl(produto.image)}
                          alt={produto.name}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                          onLoad={() => console.log('Imagem carregada:', getImageUrl(produto.image))}
                        />
                      ) : (
                        <Package className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-xl md:text-2xl mb-2 break-words">{produto.name}</CardTitle>
                      <p className="text-muted-foreground text-sm break-words">{produto.comertial_name}</p>

                    </div>
                  </div>
                  <Badge className={produto.status ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"}>
                    {produto.status ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Descrição</h3>
                  <p className="text-muted-foreground">
                    {produto.description || "Nenhuma descrição disponível"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Lotes relacionados */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle>Lotes deste Produto</CardTitle>
                  <Link to={`/lotes/novo?product_id=${produto.id}`}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Novo Lote
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {lotes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Nenhum lote cadastrado para este produto
                    </p>
                    <Link to={`/lotes/novo?product_id=${produto.id}`}>
                      <Button>Criar Primeiro Lote</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lotes.map((lote) => (
                      <div key={lote.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium break-words">{lote.code}</p>
                          <p className="text-sm text-muted-foreground">
                            Produção: {Number(lote.producao).toFixed(2) || 0} kg
                          </p>
                          {lote.talhao && (
                            <p className="text-sm text-muted-foreground break-words">
                              Talhão: {lote.talhao}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                          <Badge variant={lote.status ? "default" : "secondary"}>
                            {getBatchStatus(lote)}
                          </Badge>
                          <Link to={`/lotes/${lote.id}`}>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">Ver Lote</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Informações técnicas */}
          <div className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Código</p>
                    <p className="font-mono font-medium break-all">{produto.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Variedade/Cultivar</p>
                    <p className="font-medium break-words">
                      {produto.variedade_cultivar || "Não informado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                    <p className="font-medium break-words">
                      {new Date(produto.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Última Atualização</p>
                    <p className="font-medium">
                      {new Date(produto.updated_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas dos Lotes */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{lotes.length}</p>
                    <p className="text-sm text-muted-foreground">Total de Lotes</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-secondary">
                      {lotes.filter(l => l.status).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Lotes Ativos</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {lotes.map(
                        l => l.producao ? Number(l.producao) : 0
                      ).reduce((a, b) => a + b, 0).toFixed(2)} kg
                    </p>
                    <p className="text-sm text-muted-foreground">Produção Total</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {lotes.filter(l => l.dt_expedition).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Lotes Expedidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdutoDetalhes;
