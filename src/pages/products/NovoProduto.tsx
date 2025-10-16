import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { createProduct } from "@/api/products";
import type { ProductCreate } from "@/api/types";

const NovoProduto = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCustomCode, setIsCustomCode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    comertial_name: "",
    description: "",
    variedade_cultivar: "",
    image: "",
    code: "",
  });

  // Função para gerar código automático
  const generateProductCode = (name: string) => {
    if (!name) return "";
    
    // Remove acentos e caracteres especiais
    const cleanName = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toUpperCase();
    
    // Pega as primeiras letras das palavras
    const words = cleanName.split(" ").filter(word => word.length > 0);
    let code = "";
    
    if (words.length === 1) {
      code = words[0].substring(0, 4);
    } else {
      code = words.map(word => word.charAt(0)).join("").substring(0, 4);
    }
    
    // Adiciona timestamp para garantir unicidade
    const timestamp = Date.now().toString().slice(-3);
    return `${code}${timestamp}`;
  };

  // Gera código automaticamente quando o nome muda (se não for código customizado)
  useEffect(() => {
    if (!isCustomCode && formData.name) {
      const autoCode = generateProductCode(formData.name);
      setFormData(prev => ({ ...prev, code: autoCode }));
    }
  }, [formData.name, isCustomCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData: ProductCreate = {
        name: formData.name,
        code: formData.code,
        comertial_name: formData.comertial_name || undefined,
        description: formData.description || undefined,
        image: formData.image || undefined,
        variedade_cultivar: formData.variedade_cultivar || undefined,
      };

      await createProduct(productData);
      toast.success("Produto cadastrado com sucesso!");
      navigate("/produtos");
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/produtos")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="max-w-2xl mx-auto shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl">Cadastrar Novo Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Tomate Cereja"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comertial_name">Nome Comercial</Label>
                <Input
                  id="comertial_name"
                  placeholder="Ex: Tomate Sweet"
                  value={formData.comertial_name}
                  onChange={(e) => setFormData({ ...formData, comertial_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="variedade_cultivar">Variedade/Cultivar</Label>
                <Input
                  id="variedade_cultivar"
                  placeholder="Ex: Sweet Million"
                  value={formData.variedade_cultivar}
                  onChange={(e) => setFormData({ ...formData, variedade_cultivar: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="img">Imagem do Produto</Label>
                  <div className="text-sm text-gray-500 mb-1">Formatos aceitos: JPG, PNG, GIF.</div>
                  <input
                    type="file"
                    id="img"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, img: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customCode"
                    checked={isCustomCode}
                    onCheckedChange={(checked) => {
                      setIsCustomCode(checked as boolean);
                      if (!checked && formData.name) {
                        // Regenera código automaticamente quando desabilita o modo customizado
                        const autoCode = generateProductCode(formData.name);
                        setFormData(prev => ({ ...prev, code: autoCode }));
                      }
                    }}
                  />
                  <Label htmlFor="customCode" className="text-sm">
                    Definir código manualmente
                  </Label>
                </div>
                

                <div className="space-y-2">
                  <Label htmlFor="code">Código do Produto *</Label>
                  <Input
                    id="code"
                    placeholder={isCustomCode ? "Ex: PROD001" : "Código gerado automaticamente"}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    disabled={!isCustomCode}
                    required
                    className={!isCustomCode ? "bg-gray-50 text-gray-600" : ""}
                  />
                  {!isCustomCode && (
                    <p className="text-xs text-gray-500">
                      O código será gerado automaticamente baseado no nome do produto
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o produto..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Cadastrando..." : "Cadastrar Produto"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/produtos")}
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

export default NovoProduto;
