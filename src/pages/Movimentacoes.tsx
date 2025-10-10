import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Plus, Search, ArrowRightLeft } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const Movimentacoes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const movimentacoes = [
    {
      id: 1,
      lote: "LOT2024001",
      tipo: "Colheita",
      quantidade: 2500,
      data: "2024-01-15",
      responsavel: "João Silva",
    },
    {
      id: 2,
      lote: "LOT2024002",
      tipo: "Plantio",
      quantidade: 1000,
      data: "2024-01-10",
      responsavel: "Maria Santos",
    },
    {
      id: 3,
      lote: "LOT2024003",
      tipo: "Expedição",
      quantidade: 3200,
      data: "2024-01-18",
      responsavel: "Pedro Costa",
    },
    {
      id: 4,
      lote: "LOT2024001",
      tipo: "Tratamento",
      quantidade: 2500,
      data: "2024-01-08",
      responsavel: "Ana Paula",
    },
  ];

  const filteredMovimentacoes = movimentacoes.filter((m) =>
    m.lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <h3 className="font-semibold">{mov.lote}</h3>
                        <Badge className={getTipoColor(mov.tipo)}>{mov.tipo}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Responsável: {mov.responsavel}
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
                        {new Date(mov.data).toLocaleDateString("pt-BR")}
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

        {filteredMovimentacoes.length === 0 && (
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
