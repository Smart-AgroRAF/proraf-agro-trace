import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Sprout, Eye, ShieldCheck, BarChart3 } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Rastreabilidade Agrícola Completa
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Gerencie seus produtos, lotes e movimentações com total transparência e controle. 
              Do plantio à expedição, tudo registrado e rastreável.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro">
                <Button size="lg" className="w-full sm:w-auto">
                  Começar Agora
                </Button>
              </Link>
              <Link to="/rastrear">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Rastrear Lote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Funcionalidades Principais
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-card shadow-soft hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gestão de Produtos</h3>
              <p className="text-muted-foreground">
                Cadastre e gerencie todos os seus produtos agrícolas com facilidade.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card shadow-soft hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Controle de Lotes</h3>
              <p className="text-muted-foreground">
                Acompanhe cada lote desde o plantio até a expedição.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card shadow-soft hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rastreabilidade</h3>
              <p className="text-muted-foreground">
                QR Code único para cada lote, garantindo total rastreabilidade.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card shadow-soft hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Relatórios</h3>
              <p className="text-muted-foreground">
                Visualize dados e acompanhe a produção com relatórios detalhados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-hero rounded-2xl p-12 shadow-soft">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para começar?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Junte-se a centenas de produtores que já usam o ProRAF para gerenciar sua produção.
            </p>
            <Link to="/cadastro">
              <Button size="lg" variant="secondary">
                Criar Conta Gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 ProRAF - Sistema de Rastreabilidade Agrícola. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
