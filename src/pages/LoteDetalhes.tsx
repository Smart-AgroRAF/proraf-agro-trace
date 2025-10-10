import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Boxes, Calendar, MapPin, Package, Activity } from "lucide-react";

const LoteDetalhes = () => {
  const { id } = useParams();

  // Mock data - substituir por dados reais futuramente
  const lote = {
    id: Number(id),
    code: "LOT2024001",
    product: "Tomate Cereja",
    productId: 1,
    dt_plantio: "2024-01-05",
    dt_colheita: "2024-03-15",
    dt_expedition: null,
    status: "Colheita",
    talhao: "Talhão A1",
    producao: 2500,
    area: "500m²",
    movimentacoes: [
      { id: 1, tipo: "Plantio", data: "2024-01-05", responsavel: "João Silva" },
      { id: 2, tipo: "Tratamento", data: "2024-01-08", responsavel: "Ana Paula" },
      { id: 3, tipo: "Colheita", data: "2024-03-15", responsavel: "João Silva" },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Plantio":
        return "bg-secondary/20 text-secondary";
      case "Colheita":
        return "bg-primary/20 text-primary";
      case "Expedido":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
                      <Link to={`/produtos/${lote.productId}`} className="text-primary hover:underline">
                        {lote.product}
                      </Link>
                    </div>
                  </div>
                  <Badge className={getStatusColor(lote.status)}>{lote.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Talhão</p>
                      <p className="font-medium">{lote.talhao}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Área</p>
                      <p className="font-medium">{lote.area}</p>
                    </div>
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
                <div className="space-y-4">
                  {lote.movimentacoes.map((mov, index) => (
                    <div key={mov.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        {index < lote.movimentacoes.length - 1 && (
                          <div className="w-0.5 h-12 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{mov.tipo}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(mov.data).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Responsável: {mov.responsavel}
                        </p>
                        <Link to={`/movimentacoes/${mov.id}`}>
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            Ver detalhes
                          </Button>
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
                  <span className="font-semibold text-2xl">{lote.producao} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produtividade</span>
                  <span className="font-semibold">
                    {(lote.producao / parseFloat(lote.area)).toFixed(2)} kg/m²
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
