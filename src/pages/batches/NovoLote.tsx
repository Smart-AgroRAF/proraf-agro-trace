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
import { listProducts } from "@/api/products";
import type { BatchCreate, Product } from "@/api/types";

const NovoLote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [isCustomCode, setIsCustomCode] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    product_id: "",
    dt_plantio: "",
    talhao: "",
    registro_talhao: false,
  });

  // Função para gerar código automático do lote
  const generateBatchCode = (productId: string, dtPlantio: string) => {
    if (!productId || !dtPlantio) return "";
    
    // Busca o produto selecionado para usar no código
    const selectedProduct = produtos.find(p => p.id.toString() === productId);
    const productCode = selectedProduct?.code || "PROD";
    
    // Formatar a data (YYMMDD)
    const date = new Date(dtPlantio);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Adiciona timestamp para garantir unicidade
    const timestamp = Date.now().toString().slice(-3);
    
    return `LOT${productCode}${year}${month}${day}${timestamp}`;
  };

  // Gera código automaticamente quando produto ou data mudam (se não for código customizado)
  useEffect(() => {
    if (!isCustomCode && formData.product_id && formData.dt_plantio) {
      const autoCode = generateBatchCode(formData.product_id, formData.dt_plantio);
      setFormData(prev => ({ ...prev, code: autoCode }));
    }
  }, [formData.product_id, formData.dt_plantio, isCustomCode, produtos]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await listProducts();
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
        dt_plantio: formData.dt_plantio || undefined,
        talhao: formData.talhao || undefined,
        registro_talhao: formData.registro_talhao,
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
                      if (!checked && formData.product_id && formData.dt_plantio) {
                        // Regenera código automaticamente quando desabilita o modo customizado
                        const autoCode = generateBatchCode(formData.product_id, formData.dt_plantio);
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
                    placeholder={isCustomCode ? "Ex: LOT2024001" : "Código gerado automaticamente"}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    disabled={!isCustomCode}
                    required
                    className={!isCustomCode ? "bg-gray-50 text-gray-600" : ""}
                  />
                  {!isCustomCode && (
                    <p className="text-xs text-gray-500">
                      O código será gerado automaticamente baseado no produto e data de plantio
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
                <Label htmlFor="dt_plantio">Data de Plantio *</Label>
                <Input
                  id="dt_plantio"
                  type="date"
                  value={formData.dt_plantio}
                  onChange={(e) => setFormData({ ...formData, dt_plantio: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="talhao">Talhão *</Label>
                <Input
                  id="talhao"
                  placeholder="Ex: Talhão A1"
                  value={formData.talhao}
                  onChange={(e) => setFormData({ ...formData, talhao: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="registro_talhao"
                  checked={formData.registro_talhao}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, registro_talhao: checked as boolean })
                  }
                />
                <Label htmlFor="registro_talhao" className="cursor-pointer">
                  Possui registro do talhão
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
