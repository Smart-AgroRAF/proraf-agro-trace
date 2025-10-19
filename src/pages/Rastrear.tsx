import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, MapPin, Calendar, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  trackBatchByCode, 
  TrackingInfo,
  formatDate,
  formatDateTime,
  getProductImageUrl,
  getBatchStatus,
  getStatusColor
} from "@/api/traking";

const Rastrear = () => {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRastrear = async () => {
    if (!codigo.trim()) {
      toast.error("Digite um código de lote");
      return;
    }

    setLoading(true);
    try {
      const data = await trackBatchByCode(codigo.trim());
      setResultado(data);
      toast.success("Lote encontrado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao rastrear lote:", error);
      toast.error(error.message || "Lote não encontrado. Verifique o código e tente novamente.");
      setResultado(null);
    } finally {
      setLoading(false);
    }
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
                  {loading ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5 mr-2" />
                  )}
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
                    <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                      {resultado.product.image ? (
                        <img 
                          src={getProductImageUrl(resultado.product.image)} 
                          alt={resultado.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.querySelector('svg')?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <Package className={`h-12 w-12 text-primary ${resultado.product.image ? 'hidden' : ''}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold">{resultado.product.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getBatchStatus(resultado.batch))}`}>
                          {getBatchStatus(resultado.batch)}
                        </span>
                      </div>
                      {resultado.product.comertial_name && (
                        <p className="text-muted-foreground mb-1">
                          Nome Comercial: {resultado.product.comertial_name}
                        </p>
                      )}
                      {resultado.product.variedade_cultivar && (
                        <p className="text-muted-foreground mb-1">
                          Variedade: {resultado.product.variedade_cultivar}
                        </p>
                      )}
                      {resultado.product.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {resultado.product.description}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <p className="text-sm font-mono bg-muted px-3 py-1 rounded inline-block">
                          Lote: {resultado.batch.code}
                        </p>
                        <p className="text-sm font-mono bg-muted px-3 py-1 rounded inline-block">
                          Produto: {resultado.product.code}
                        </p>
                      </div>
                      {resultado.batch.talhao && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Talhão: {resultado.batch.talhao}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline e Estatísticas */}
              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Histórico do Lote</h3>
                  
                  {/* Estatísticas */}
                  <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{resultado.batch.producao}</p>
                      <p className="text-sm text-muted-foreground">kg Produzidos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{resultado.stats.total_movements}</p>
                      <p className="text-sm text-muted-foreground">Movimentações</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {resultado.stats.days_since_planting !== null ? resultado.stats.days_since_planting : '-'}
                      </p>
                      <p className="text-sm text-muted-foreground">Dias desde Plantio</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-6">
                    {resultado.batch.dt_plantio && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-secondary" />
                          </div>
                          {(resultado.batch.dt_colheita || resultado.batch.dt_expedition) && (
                            <div className="w-0.5 h-full bg-border mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="font-semibold text-secondary">Plantio</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(resultado.batch.dt_plantio)}
                          </p>
                          {resultado.batch.talhao && (
                            <p className="text-sm mt-1">Local: {resultado.batch.talhao}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {resultado.batch.dt_colheita && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          {resultado.batch.dt_expedition && (
                            <div className="w-0.5 h-full bg-border mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="font-semibold text-primary">Colheita</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(resultado.batch.dt_colheita)}
                          </p>
                          <p className="text-sm mt-1">Produção: {resultado.batch.producao} kg</p>
                        </div>
                      </div>
                    )}

                    {resultado.batch.dt_expedition && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-accent" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-accent">Expedição</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(resultado.batch.dt_expedition)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Movimentações */}
                  {resultado.movements.length > 0 && (
                    <div className="mt-8 pt-6 border-t">
                      <h4 className="font-semibold mb-4">Movimentações Registradas</h4>
                      <div className="space-y-3">
                        {resultado.movements.map((movimento) => (
                          <div key={movimento.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                            <div>
                              <p className="font-medium">{movimento.tipo_movimentacao}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDateTime(movimento.created_at)}
                              </p>
                            </div>
                            <p className="font-semibold">{movimento.quantidade} kg</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Produtor Info */}
              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Informações do Produtor</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{resultado.producer.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {resultado.producer.tipo_pessoa === 'F' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <span>Perfil: {resultado.producer.tipo_perfil}</span>
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
