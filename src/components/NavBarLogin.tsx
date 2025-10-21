import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import prorafLogo from "@/assets/proraf-logo.png";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  isAuthenticated?: boolean;
}

export const NavbarLogin = ({ isAuthenticated = false }: NavbarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const isAuth = isAuthenticated || localStorage.getItem("proraf_auth") === "true";

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
        setWalletAddress(accounts[0]);
        toast({
          title: "Carteira conectada",
          description: `Conectado: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      } catch (error) {
        toast({
          title: "Erro ao conectar",
          description: "Não foi possível conectar à MetaMask",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "MetaMask não encontrada",
        description: "Por favor, instale a extensão MetaMask",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("proraf_auth");
    navigate("/login");
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={prorafLogo} alt="ProRAF" className="h-10" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
              <>
                <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/produtos" className="text-foreground hover:text-primary transition-colors">
                  Produtos
                </Link>
                <Link to="/lotes" className="text-foreground hover:text-primary transition-colors">
                  Lotes
                </Link>
                <Link to="/movimentacoes" className="text-foreground hover:text-primary transition-colors">
                  Movimentações
                </Link>
                <Link to="/perfil" className="text-foreground hover:text-primary transition-colors">
                  Perfil
                </Link>
                <Button onClick={connectMetaMask} variant="outline" size="sm">
                  <Wallet className="h-4 w-4 mr-2" />
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "MetaMask"}
                </Button>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-in">
         
              <div className="flex flex-col gap-3">
                <Link
                  to="/dashboard"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/produtos"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Produtos
                </Link>
                <Link
                  to="/lotes"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Lotes
                </Link>
                <Link
                  to="/movimentacoes"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Movimentações
                </Link>
                <Link
                  to="/perfil"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Perfil
                </Link>
                <Button onClick={connectMetaMask} variant="outline" size="sm" className="w-full mt-2">
                  <Wallet className="h-4 w-4 mr-2" />
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "MetaMask"}
                </Button>
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full mt-2">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            
          </div>
        )}
      </div>
    </nav>
  );
};
