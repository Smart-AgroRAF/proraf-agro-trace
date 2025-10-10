import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, Boxes, ArrowRightLeft, Plus, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { title: "Produtos Cadastrados", value: "24", icon: Package, color: "text-primary" },
    { title: "Lotes Ativos", value: "15", icon: Boxes, color: "text-secondary" },
    { title: "Movimentações (mês)", value: "48", icon: ArrowRightLeft, color: "text-accent" },
    { title: "Produção Total (kg)", value: "12.500", icon: TrendingUp, color: "text-primary" },
  ];

  const recentBatches = [
    { code: "LOT2024001", product: "Tomate Cereja", status: "Colheita", date: "15/01/2024" },
    { code: "LOT2024002", product: "Alface Crespa", status: "Plantio", date: "10/01/2024" },
    { code: "LOT2024003", product: "Cenoura", status: "Expedição", date: "18/01/2024" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua produção</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-soft hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/produtos/novo">
            <Card className="shadow-soft hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Novo Produto</h3>
                <p className="text-muted-foreground text-center text-sm mt-2">
                  Cadastrar novo produto
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/lotes/novo">
            <Card className="shadow-soft hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg">Novo Lote</h3>
                <p className="text-muted-foreground text-center text-sm mt-2">
                  Registrar novo lote
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/movimentacoes/nova">
            <Card className="shadow-soft hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">Nova Movimentação</h3>
                <p className="text-muted-foreground text-center text-sm mt-2">
                  Registrar movimentação
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Batches */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Lotes Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBatches.map((batch, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-card rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{batch.code}</p>
                    <p className="text-sm text-muted-foreground">{batch.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{batch.status}</p>
                    <p className="text-sm text-muted-foreground">{batch.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/lotes">
              <Button variant="outline" className="w-full mt-4">
                Ver Todos os Lotes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
