import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, MapPin, Calendar, User } from "lucide-react";
import { toast } from "sonner";

const Rastrear = () => {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRastrear = async () => {
    if (!codigo) {
      toast.error("Digite um código de lote");
      return;
    }

    setLoading(true);

    // Simulação de busca
    setTimeout(() => {
      setResultado({
        code: "LOT2024001",
        product: "Tomate Cereja",
        variedade: "Sweet Million",
        produtor: "João Silva - Fazenda Boa Vista",
        talhao: "Talhão A1",
        dt_plantio: "2024-01-05",
        dt_colheita: "2024-03-15",
        dt_expedition: "2024-03-18",
        producao: 2500,
        localizacao: "São Paulo, SP",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Rastreie seu Produto</h1>
            <p className="text-xl text-muted-foreground">
              Digite o código do lote para ver todas as informações de rastreabilidade
            </p>
          </div>

          <Card className="shadow-soft mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Digite o código do lote (ex: LOT2024001)"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleRastrear()}
                  className="text-lg"
                />
                <Button onClick={handleRastrear} disabled={loading} size="lg">
                  <Search className="h-5 w-5 mr-2" />
                  {loading ? "Buscando..." : "Rastrear"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {resultado && (
            <div className="space-y-6 animate-fade-in">
              {/* Produto Info */}
              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{resultado.product}</h2>
                      <p className="text-muted-foreground mb-1">
                        Variedade: {resultado.variedade}
                      </p>
                      <p className="text-sm font-mono bg-muted px-3 py-1 rounded inline-block">
                        {resultado.code}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Histórico do Lote</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-secondary" />
                        </div>
                        <div className="w-0.5 h-full bg-border mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="font-semibold text-secondary">Plantio</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(resultado.dt_plantio).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-sm mt-1">Local: {resultado.talhao}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="w-0.5 h-full bg-border mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="font-semibold text-primary">Colheita</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(resultado.dt_colheita).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-sm mt-1">Produção: {resultado.producao} kg</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-accent" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-accent">Expedição</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(resultado.dt_expedition).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Produtor Info */}
              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Informações do Produtor</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span>{resultado.produtor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>{resultado.localizacao}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rastrear;
