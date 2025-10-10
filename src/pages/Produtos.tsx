import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Plus, Search, Package } from "lucide-react";
import { useState } from "react";

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const produtos = [
    {
      id: 1,
      name: "Tomate Cereja",
      comertial_name: "Tomate Sweet",
      variedade_cultivar: "Sweet Million",
      code: "PROD001",
      status: true,
    },
    {
      id: 2,
      name: "Alface Crespa",
      comertial_name: "Alface Fresh",
      variedade_cultivar: "Crespa Verde",
      code: "PROD002",
      status: true,
    },
    {
      id: 3,
      name: "Cenoura",
      comertial_name: "Cenoura Premium",
      variedade_cultivar: "Nantes",
      code: "PROD003",
      status: true,
    },
    {
      id: 4,
      name: "Rúcula",
      comertial_name: "Rúcula Selvagem",
      variedade_cultivar: "Cultivada",
      code: "PROD004",
      status: false,
    },
  ];

  const filteredProdutos = produtos.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.comertial_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Produtos</h1>
            <p className="text-muted-foreground">Gerencie seus produtos cadastrados</p>
          </div>
          <Link to="/produtos/novo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProdutos.map((produto) => (
            <Card key={produto.id} className="shadow-soft hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      produto.status
                        ? "bg-secondary/20 text-secondary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {produto.status ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{produto.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{produto.comertial_name}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Variedade: {produto.variedade_cultivar}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {produto.code}
                  </span>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProdutos.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Produtos;
