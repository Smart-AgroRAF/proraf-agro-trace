import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { createBatch } from "@/api/batches";
import { listProductsByUser } from "@/api/products";
import type { BatchCreate, Product } from "@/api/types";

const NovoLote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [isCustomCode, setIsCustomCode] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    product_id: "",
    dt_expedition: "",
    producao: "",
    unidadeMedida: "kg",
    status: true,
  });

  // Função para gerar código automático do lote
  const generateBatchCode = (productId: string) => {
    if (!productId) return "";
    
    // Busca o produto selecionado para usar no código
    const selectedProduct = produtos.find(p => p.id.toString() === productId);
    const productCode = selectedProduct?.code || "PROD";
    
    // Adiciona timestamp para garantir unicidade
    const timestamp = Date.now().toString().slice(-6);
    
    return `LOTE-${productCode}-${timestamp}`;
  };

  // Gera código automaticamente quando produto muda (se não for código customizado)
  useEffect(() => {
    if (!isCustomCode && formData.product_id) {
      const autoCode = generateBatchCode(formData.product_id);
      setFormData(prev => ({ ...prev, code: autoCode }));
    }
  }, [formData.product_id, isCustomCode, produtos]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await listProductsByUser();
        setProdutos(data);
      } catch (error: any) {
        toast.error("Erro ao carregar produtos");
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const batchData: BatchCreate = {
        code: formData.code,
        product_id: parseInt(formData.product_id),
        dt_expedition: formData.dt_expedition,
        producao: parseFloat(formData.producao),
        unidadeMedida: formData.unidadeMedida,
        status: formData.status,
      };

      await createBatch(batchData);
      toast.success("Lote cadastrado com sucesso!");
      navigate("/lotes");
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar lote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/lotes")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="max-w-2xl mx-auto shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl">Cadastrar Novo Lote</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customCode"
                    checked={isCustomCode}
                    onCheckedChange={(checked) => {
                      setIsCustomCode(checked as boolean);
                      if (!checked && formData.product_id) {
                        // Regenera código automaticamente quando desabilita o modo customizado
                        const autoCode = generateBatchCode(formData.product_id);
                        setFormData(prev => ({ ...prev, code: autoCode }));
                      }
                    }}
                  />
                  <Label htmlFor="customCode" className="text-sm">
                    Definir código manualmente
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code">Código do Lote *</Label>
                  <Input
                    id="code"
                    placeholder={isCustomCode ? "Ex: LOTE-ALF-001" : "Código gerado automaticamente"}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    disabled={!isCustomCode}
                    required
                    className={!isCustomCode ? "bg-gray-50 text-gray-600" : ""}
                  />
                  {!isCustomCode && (
                    <p className="text-xs text-gray-500">
                      O código será gerado automaticamente baseado no produto
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Produto *</Label>
                <Select
                  value={formData.product_id}
                  onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map((produto) => (
                      <SelectItem key={produto.id} value={produto.id.toString()}>
                        {produto.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dt_expedition">Data de Expedição *</Label>
                <Input
                  id="dt_expedition"
                  type="date"
                  value={formData.dt_expedition}
                  onChange={(e) => setFormData({ ...formData, dt_expedition: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="producao">Produção *</Label>
                  <Input
                    id="producao"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 800.75"
                    value={formData.producao}
                    onChange={(e) => setFormData({ ...formData, producao: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unidadeMedida">Unidade de Medida *</Label>
                  <Select
                    value={formData.unidadeMedida}
                    onValueChange={(value) => setFormData({ ...formData, unidadeMedida: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="ton">ton</SelectItem>
                      <SelectItem value="un">un</SelectItem>
                      <SelectItem value="cx">cx</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked as boolean })
                  }
                />
                <Label htmlFor="status" className="cursor-pointer">
                  Lote ativo
                </Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Cadastrando..." : "Cadastrar Lote"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/lotes")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NovoLote;
