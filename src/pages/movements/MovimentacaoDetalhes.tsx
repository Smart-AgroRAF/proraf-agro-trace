import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRightLeft, Calendar, User, Package, MapPin, FileText } from "lucide-react";

const MovimentacaoDetalhes = () => {
  const { id } = useParams();

  // Mock data - substituir por dados reais futuramente
  const movimentacao = {
    id: Number(id),
    lote: "LOT2024001",
    loteId: 1,
    tipo: "Colheita",
    quantidade: 2500,
    data: "2024-01-15",
    hora: "08:30",
    responsavel: "João Silva",
    observacoes: "Colheita realizada com sucesso. Produto de excelente qualidade, sem perdas significativas.",
    localizacao: "Talhão A1",
    produto: "Tomate Cereja",
    condicoes_climaticas: "Ensolarado, 25°C",
    equipamentos: ["Caixas de colheita", "Carrinho de transporte"],
  };

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
        <Link to="/movimentacoes">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Movimentações
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
                      <ArrowRightLeft className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-2xl">Movimentação #{movimentacao.id}</CardTitle>
                        <Badge className={getTipoColor(movimentacao.tipo)}>{movimentacao.tipo}</Badge>
                      </div>
                      <Link to={`/lotes/${movimentacao.loteId}`} className="text-primary hover:underline">
                        {movimentacao.lote} - {movimentacao.produto}
                      </Link>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Quantidade</p>
                      <p className="font-semibold text-lg">{movimentacao.quantidade} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Localização</p>
                      <p className="font-medium">{movimentacao.localizacao}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{movimentacao.observacoes}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes Operacionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Condições Climáticas</h4>
                  <p className="text-muted-foreground">{movimentacao.condicoes_climaticas}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Equipamentos Utilizados</h4>
                  <div className="flex flex-wrap gap-2">
                    {movimentacao.equipamentos.map((eq, index) => (
                      <Badge key={index} variant="outline">{eq}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações técnicas */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Movimentação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">
                      {new Date(movimentacao.data).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Horário</p>
                    <p className="font-medium">{movimentacao.hora}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável</p>
                    <p className="font-medium">{movimentacao.responsavel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Operação</p>
                    <Badge className={getTipoColor(movimentacao.tipo)}>{movimentacao.tipo}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to={`/lotes/${movimentacao.loteId}`} className="w-full">
                  <Button variant="outline" className="w-full">Ver Lote Completo</Button>
                </Link>
                <Button variant="outline" className="w-full">Exportar PDF</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovimentacaoDetalhes;
