import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Plus, Search, ArrowRightLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { listMovements } from "@/api/movements";
import type { Movement } from "@/api/types";
import { toast } from "sonner";

const Movimentacoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movimentacoes, setMovimentacoes] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const data = await listMovements();
        setMovimentacoes(data);
      } catch (error: any) {
        toast.error("Erro ao carregar movimentações");
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  const filteredMovimentacoes = movimentacoes.filter((m) =>
    m.tipo_movimentacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Plantio":
        return "bg-secondary/20 text-secondary";
      case "Colheita":
        return "bg-primary/20 text-primary";
      case "Expedição":
        return "bg-accent/20 text-accent";
      case "Tratamento":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Movimentações</h1>
            <p className="text-muted-foreground">Histórico de movimentações dos lotes</p>
          </div>
          <Link to="/movimentacoes/nova">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Movimentação
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar movimentações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Movimentações List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando movimentações...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMovimentacoes.map((mov) => (
            <Card key={mov.id} className="shadow-soft hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ArrowRightLeft className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">Lote ID: {mov.batch_id}</h3>
                        <Badge className={getTipoColor(mov.tipo_movimentacao)}>{mov.tipo_movimentacao}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Usuário ID: {mov.user_id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Quantidade</p>
                      <p className="font-semibold">{mov.quantidade} kg</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Data</p>
                      <p className="font-semibold">
                        {new Date(mov.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Link to={`/movimentacoes/${mov.id}`}>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {!loading && filteredMovimentacoes.length === 0 && (
          <div className="text-center py-12">
            <ArrowRightLeft className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma movimentação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movimentacoes;
