import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, Calendar, Hash, Tag } from "lucide-react";

const ProdutoDetalhes = () => {
  const { id } = useParams();

  // Mock data - substituir por dados reais futuramente
  const produto = {
    id: Number(id),
    name: "Tomate Cereja",
    comertial_name: "Tomate Sweet",
    variedade_cultivar: "Sweet Million",
    code: "PROD001",
    status: true,
    created_at: "2024-01-05",
    description: "Tomate cereja de alta qualidade, cultivado em estufa com controle de temperatura e umidade.",
    lotes: [
      { id: 1, code: "LOT2024001", status: "Colheita", producao: 2500 },
      { id: 2, code: "LOT2024005", status: "Plantio", producao: 0 },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/produtos">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Produtos
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
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">{produto.name}</CardTitle>
                      <p className="text-muted-foreground">{produto.comertial_name}</p>
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
                  <p className="text-muted-foreground">{produto.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Lotes relacionados */}
            <Card>
              <CardHeader>
                <CardTitle>Lotes deste Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {produto.lotes.map((lote) => (
                    <div key={lote.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{lote.code}</p>
                        <p className="text-sm text-muted-foreground">Produção: {lote.producao} kg</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge>{lote.status}</Badge>
                        <Link to={`/lotes/${lote.id}`}>
                          <Button variant="outline" size="sm">Ver Lote</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações técnicas */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Código</p>
                    <p className="font-mono font-medium">{produto.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Variedade/Cultivar</p>
                    <p className="font-medium">{produto.variedade_cultivar}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                    <p className="font-medium">
                      {new Date(produto.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Lotes</span>
                  <span className="font-semibold">{produto.lotes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produção Total</span>
                  <span className="font-semibold">
                    {produto.lotes.reduce((sum, l) => sum + l.producao, 0)} kg
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

export default ProdutoDetalhes;
