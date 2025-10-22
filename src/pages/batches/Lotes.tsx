import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Plus, Search, Boxes, QrCode } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { listBatches } from "@/api/batches";
import type { Batch } from "@/api/types";
import { toast } from "sonner";

const Lotes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [lotes, setLotes] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await listBatches();
        setLotes(data);
      } catch (error: any) {
        toast.error("Erro ao carregar lotes");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const filteredLotes = lotes.filter((l) =>
    l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.talhao?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (batch: Batch) => {
    if (batch.dt_expedition) return "bg-muted text-muted-foreground";
    if (batch.dt_colheita) return "bg-primary/20 text-primary";
    return "bg-secondary/20 text-secondary";
  };

  const getStatusText = (batch: Batch) => {
    if (batch.dt_expedition) return "Expedido";
    if (batch.dt_colheita) return "Colheita";
    return "Plantio";
  };

  const oldGetStatusColor = (status: string) => {
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lotes</h1>
            <p className="text-muted-foreground">Acompanhe seus lotes de produção</p>
          </div>
          <Link to="/lotes/novo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lote
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar lotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lotes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando lotes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLotes.map((lote) => (
            <Card key={lote.id} className="shadow-soft hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Boxes className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{lote.code}</h3>
                      <p className="text-sm text-muted-foreground">Produto ID: {lote.product_id}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(lote)}>{getStatusText(lote)}</Badge>
                </div>

                <div className="space-y-2 mb-4">
        
                  {lote.dt_expedition && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expedição:</span>
                      <span>{new Date(lote.dt_expedition).toLocaleDateString("pt-BR")}</span>
                    </div>
                  )}
                  {lote.dt_colheita && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Colheita:</span>
                      <span>{new Date(lote.dt_colheita).toLocaleDateString("pt-BR")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Produção:</span>
                    <span className="font-medium">{Number(lote.producao).toFixed(2)} kg</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/lotes/${lote.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {!loading && filteredLotes.length === 0 && (
          <div className="text-center py-12">
            <Boxes className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum lote encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lotes;
