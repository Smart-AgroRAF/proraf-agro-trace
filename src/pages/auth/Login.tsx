import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import prorafLogo from "@/assets/proraf-logo.png";
import loginBg from "@/assets/login-bg.jpg";
import { login, loginWithGoogle } from "@/api/auth";

declare global {
  interface Window {
    google?: any;
  }
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleButtonKey, setGoogleButtonKey] = useState(0);
  
  // Flag para desabilitar Google Auth em caso de problemas
  const isGoogleAuthEnabled = import.meta.env.VITE_GOOGLE_AUTH_ENABLED !== 'false';

  // Verificar se chegou por token expirado
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === 'true') {
      toast.error('Sua sessão expirou. Por favor, faça login novamente.');
      // Limpar o parâmetro da URL
      window.history.replaceState({}, '', '/login');
    }
    
    // Forçar reinicialização do botão Google quando a página for carregada/recarregada
    setGoogleButtonKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    console.log('Inicializando botão Google, key:', googleButtonKey);
    
    let attempts = 0;
    const maxAttempts = 10;
    
    const initializeGoogleButton = () => {
      attempts++;
      console.log(`Tentativa ${attempts} de inicializar botão Google`);
      
      // Verificar se Google API está disponível
      if (isGoogleAuthEnabled && window.google?.accounts?.id) {
        try {
          console.log('Google API disponível, inicializando...');
          
          // Limpar qualquer inicialização anterior
          try {
            window.google.accounts.id.cancel();
          } catch (e) {
            console.log('Sem inicialização anterior para cancelar');
          }
          
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "149795163999-vd3lf5uf5u0od7i2msjj0pkp3nlfm217.apps.googleusercontent.com",
            callback: handleGoogleLogin,
          });

          const buttonDiv = document.getElementById("google-signin-button");
          if (buttonDiv) {
            console.log('Renderizando botão Google...');
            // Limpar conteúdo anterior
            buttonDiv.innerHTML = '';
            
            window.google.accounts.id.renderButton(
              buttonDiv,
              { 
                theme: "outline", 
                size: "large",
                width: "100%",
                text: "signin_with",
                locale: "pt-BR"
              }
            );
            console.log('Botão Google renderizado com sucesso');
          } else {
            console.error('Elemento google-signin-button não encontrado no DOM');
          }
        } catch (error) {
          console.error('Erro ao inicializar Google Sign-In:', error);
        }
      } else if (attempts < maxAttempts) {
        // Tentar novamente após um delay
        console.warn(`Google API ainda não disponível, tentando novamente em 300ms...`);
        setTimeout(initializeGoogleButton, 300);
      } else {
        console.error('Google API não foi carregada após múltiplas tentativas');
      }
    };
    
    // Iniciar após um pequeno delay
    const timer = setTimeout(initializeGoogleButton, 200);

    return () => {
      clearTimeout(timer);
      // Cleanup do Google Sign-In ao desmontar
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.cancel();
        } catch (e) {
          console.log('Erro ao cancelar Google Sign-In no cleanup');
        }
      }
    };
  }, [isGoogleAuthEnabled, googleButtonKey]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ username: email, password: senha });
      toast.success("Login realizado com sucesso!");
      
      // Forçar reload completo para garantir que todos os dados sejam atualizados
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response: any) => {
    try {
      setLoading(true);
      await loginWithGoogle(response.credential);
      toast.success("Login com Google realizado com sucesso!");
      
      // Forçar reload completo para garantir que todos os dados sejam atualizados
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login com Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${loginBg})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>
      </div>
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md shadow-soft">
          <CardHeader className="text-center">
            <img src={prorafLogo} alt="ProRAF" className="h-16 mx-auto mb-4" />
            <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
            <CardDescription>Entre com suas credenciais para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>

              <div className="relative my-4">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  OU
                </span>
              </div>

              {isGoogleAuthEnabled ? (
                <div key={googleButtonKey} id="google-signin-button" className="w-full"></div>
              ) : (
                <div className="w-full p-3 border rounded-md text-center text-muted-foreground">
                  Google Sign-In temporariamente desabilitado
                </div>
              )}

              <div className="text-center text-sm text-muted-foreground mt-4">
                Não tem uma conta?{" "}
                <Link to="/cadastro" className="text-primary hover:underline">
                  Cadastre-se
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
