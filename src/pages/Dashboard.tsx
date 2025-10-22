import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, Boxes, ArrowRightLeft, Plus } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { getUserStats, getUserRecentActivity } from "@/api/user";
import { formatNumber } from "@/lib/utils";
import { format } from "date-fns";

const Dashboard = () => {
  const { data: stats, loading: statsLoading } = useApi(getUserStats);
  const { data: recentActivity, loading: activityLoading } = useApi(() => getUserRecentActivity(3));

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
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
                <p className="text-muted-foreground text-center text-sm mt-2">Cadastrar novo produto</p>
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
                <p className="text-muted-foreground text-center text-sm mt-2">Registrar novo lote</p>
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
                <p className="text-muted-foreground text-center text-sm mt-2">Registrar movimentação</p>
              </CardContent>
            </Card>
          </Link>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Produtos Cadastrados</CardTitle>
              <Package className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statsLoading ? "..." : stats?.products?.unique_products || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lotes Cadastrados</CardTitle>
              <Boxes className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statsLoading ? "..." : stats?.batches?.total || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Movimentações Totais</CardTitle>
              <ArrowRightLeft className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statsLoading ? "..." : stats?.movements?.total || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Batches */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Lotes Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <p className="text-muted-foreground text-center py-4">Carregando...</p>
            ) : recentActivity?.recent_batches && recentActivity.recent_batches.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.recent_batches.map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg">
                    <div>
                      <p className="font-semibold">{batch.code}</p>
                      <p className="text-sm text-muted-foreground">Produto ID: {batch.product_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(batch.created_at), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Nenhum lote cadastrado ainda</p>
            )}
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
