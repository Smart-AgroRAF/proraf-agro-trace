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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Movimentações</h1>
            <p className="text-muted-foreground text-sm md:text-base">Histórico de movimentações dos lotes</p>
          </div>
          <Link to="/movimentacoes/nova" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
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
          <div className="space-y-3 md:space-y-4">
            {filteredMovimentacoes.map((mov) => (
            <Card key={mov.id} className="shadow-soft hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ArrowRightLeft className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm md:text-base break-words">Lote ID: {mov.batch_id}</h3>
                        <Badge className={getTipoColor(mov.tipo_movimentacao)}>{mov.tipo_movimentacao}</Badge>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Usuário ID: {mov.user_id}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
                    <div className="flex gap-4 sm:gap-6">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Quantidade</p>
                        <p className="font-semibold text-sm md:text-base">{Number(mov.quantidade).toFixed(2)} kg</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Data</p>
                        <p className="font-semibold text-sm md:text-base">
                          {new Date(mov.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <Link to={`/movimentacoes/${mov.id}`} className="w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
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
