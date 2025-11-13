import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import prorafLogo from "@/assets/proraf-logo.png";
import { useToast } from "@/hooks/use-toast";


export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem("proraf_auth");
    navigate("/login");
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={prorafLogo} alt="ProRAF" className="h-10" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
              <>
                <Link to="/rastrear" className="text-foreground hover:text-primary transition-colors">
                  Rastrear Lote
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="sm">Entrar</Button>
                </Link>
                <Link to="/cadastro">
                  <Button size="sm">Cadastrar</Button>
                </Link>
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
                  to="/rastrear"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rastrear Lote
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Entrar</Button>
                </Link>
                <Link to="/cadastro" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">Cadastrar</Button>
                </Link>
              </div>
          </div>
        )}
      </div>
    </nav>
  );
};
