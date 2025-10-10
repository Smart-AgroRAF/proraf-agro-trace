import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Sprout, Eye, ShieldCheck, BarChart3 } from "lucide-react";
import pampatecLogo from "@/assets/pampatec-logo.png";
import ppgesLogo from "@/assets/ppges-logo.png";
import unipampaLogo from "@/assets/unipampa-logo.png";
import alegreteLogo from "@/assets/alegrete-logo.png";
import lamapLogo from "@/assets/lamap-logo.png";
import leaLogo from "@/assets/lea-logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import featuresBg from "@/assets/features-bg.png";
import ctaBg from "@/assets/cta-bg.jpeg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background"></div>
        </div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-slide-in">
              Rastreabilidade Agrícola Completadsa
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Gerencie seus produtos, lotes e movimentações com total transparência e controle. Do plantio à expedição,
              tudo registrado e rastreável.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Link to="/cadastro">
                <Button size="lg" className="w-full sm:w-auto hover-scale">
                  Começar Agora
                </Button>
              </Link>
              <Link to="/rastrear">
                <Button size="lg" variant="outline" className="w-full sm:w-auto hover-scale">
                  Rastrear Lote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${featuresBg})` }}
        ></div>
        <div className="absolute inset-0 bg-card/95"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
            Funcionalidades Principais
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              className="text-center p-6 rounded-lg bg-gradient-card shadow-soft hover:shadow-lg hover:-translate-y-2 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                <Sprout className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gestão de Produtos</h3>
              <p className="text-muted-foreground">
                Cadastre e gerencie todos os seus produtos agrícolas com facilidade.
              </p>
            </div>

            <div
              className="text-center p-6 rounded-lg bg-gradient-card shadow-soft hover:shadow-lg hover:-translate-y-2 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                <Eye className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Controle de Lotes</h3>
              <p className="text-muted-foreground">Acompanhe cada lote desde o plantio até a expedição.</p>
            </div>

            <div
              className="text-center p-6 rounded-lg bg-gradient-card shadow-soft hover:shadow-lg hover:-translate-y-2 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rastreabilidade</h3>
              <p className="text-muted-foreground">QR Code único para cada lote, garantindo total rastreabilidade.</p>
            </div>

            <div
              className="text-center p-6 rounded-lg bg-gradient-card shadow-soft hover:shadow-lg hover:-translate-y-2 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Relatórios</h3>
              <p className="text-muted-foreground">Visualize dados e acompanhe a produção com relatórios detalhados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-fade-in">Nossos Parceiros</h2>
          <p className="text-center text-muted-foreground mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Desenvolvido em parceria com instituições de excelência
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            <div
              className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <img
                src={unipampaLogo}
                alt="Unipampa"
                className="max-h-20 w-auto grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div
              className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <img
                src={pampatecLogo}
                alt="PampaTec"
                className="max-h-20 w-auto grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div
              className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <img src={ppgesLogo} alt="PPGES" className="max-h-20 w-auto grayscale hover:grayscale-0 transition-all" />
            </div>
            <div
              className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <img src={lamapLogo} alt="LAMAP" className="max-h-20 w-auto grayscale hover:grayscale-0 transition-all" />
            </div>
            <div
              className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <img src={leaLogo} alt="LEA" className="max-h-20 w-auto grayscale hover:grayscale-0 transition-all" />
            </div>
            <div
              className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <img
                src={alegreteLogo}
                alt="Prefeitura de Alegrete"
                className="max-h-20 w-auto grayscale hover:grayscale-0 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div
            className="max-w-3xl mx-auto text-center rounded-2xl p-12 shadow-soft hover:shadow-lg transition-shadow animate-fade-in relative overflow-hidden"
            style={{ backgroundImage: `url(${ctaBg})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-secondary/80 to-primary/90"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-slide-in">Pronto para começar?</h2>
              <p className="text-white/90 text-lg mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Junte-se a centenas de produtores que já usam o ProRAF para gerenciar sua produção.
              </p>
              <Link to="/cadastro">
                <Button
                  size="lg"
                  variant="secondary"
                  className="hover-scale animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  Criar Conta Gratuita
                </Button>
              </Link>
            </div>
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
