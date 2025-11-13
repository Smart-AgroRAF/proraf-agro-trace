import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Wallet, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import prorafLogo from "@/assets/proraf-logo.png";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateCurrentUserCpfCnpj, getCurrentUser } from "@/api/user";
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/api/types";

export const NavbarLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Tentar usar o contexto com fallback de erro
  let user: User | null = null;
  let isAuthenticated = false;
  let isLoading = false;
  let logout = () => {};
  let updateUser = (user: User) => {};
  
  try {
    const authContext = useAuth();
    user = authContext.user;
    isAuthenticated = authContext.isAuthenticated;
    isLoading = authContext.isLoading;
    logout = authContext.logout;
    updateUser = authContext.updateUser;
  } catch (error) {
    console.error('Erro ao acessar AuthContext:', error);
    // Continuar com valores padrão
  }
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCpfCnpjModal, setShowCpfCnpjModal] = useState(false);
  const [documentType, setDocumentType] = useState<"cpf" | "cnpj">("cpf");
  const [documentValue, setDocumentValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Aguardar o carregamento dos dados do usuário antes de verificar
    if (isLoading) {
      console.log("Aguardando carregamento dos dados do usuário...");
      return;
    }

    // Verificar se o usuário está autenticado mas não tem CPF/CNPJ
    if (isAuthenticated && user) {
      const needsDocument = !user.cpf && !user.cnpj;
      console.log("Verificação de documento:", { 
        cpf: user.cpf, 
        cnpj: user.cnpj, 
        needsDocument 
      });
      
      if (needsDocument) {
        console.log("Usuário autenticado sem CPF/CNPJ - Abrindo modal");
        setShowCpfCnpjModal(true);
      } else {
        console.log("Usuário já possui CPF/CNPJ cadastrado");
        setShowCpfCnpjModal(false);
      }
    } else {
      setShowCpfCnpjModal(false);
    }
  }, [isAuthenticated, user, isLoading]);



  const handleLogout = () => {
    console.log("Realizando logout...");
    
    // Limpar estado local
    setShowCpfCnpjModal(false);
    setDocumentValue("");
    setDocumentType("cpf");
    setMobileMenuOpen(false);
    
    // Executar logout do contexto
    logout();
    
    // Forçar reload completo da página para limpar todo o estado
    // Isso garante que não haja resquícios da sessão anterior
    window.location.href = "/login";
  };

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  // Função para formatar CNPJ
  const formatCNPJ = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  // Validar CPF
  const isValidCPF = (cpf: string) => {
    const numericCPF = cpf.replace(/\D/g, '');
    if (numericCPF.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(numericCPF)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numericCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numericCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numericCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numericCPF.charAt(10))) return false;
    
    return true;
  };

  // Validar CNPJ
  const isValidCNPJ = (cnpj: string) => {
    const numericCNPJ = cnpj.replace(/\D/g, '');
    if (numericCNPJ.length !== 14) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(numericCNPJ)) return false;
    
    // Validação do primeiro dígito verificador
    let length = numericCNPJ.length - 2;
    let numbers = numericCNPJ.substring(0, length);
    let digits = numericCNPJ.substring(length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;
    
    // Validação do segundo dígito verificador
    length = length + 1;
    numbers = numericCNPJ.substring(0, length);
    sum = 0;
    pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
  };

  const handleDocumentChange = (value: string) => {
    if (documentType === "cpf") {
      setDocumentValue(formatCPF(value));
    } else {
      setDocumentValue(formatCNPJ(value));
    }
  };

  const handleSaveDocument = async () => {
    console.log("Iniciando salvamento do documento...");
    console.log("Dados atuais:", { user, documentType, documentValue });
    
    // Verificar se há dados mínimos
    if (!documentValue.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite o documento.",
        variant: "destructive",
      });
      return;
    }

    // Validar documento
    if (documentType === "cpf" && !isValidCPF(documentValue)) {
      toast({
        title: "CPF inválido",
        description: "Por favor, digite um CPF válido.",
        variant: "destructive",
      });
      return;
    }

    if (documentType === "cnpj" && !isValidCNPJ(documentValue)) {
      toast({
        title: "CNPJ inválido",
        description: "Por favor, digite um CNPJ válido.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("Validação passou, enviando para API...");
      
      const cleanDocument = documentValue.replace(/\D/g, '');
      console.log("Documento limpo:", cleanDocument);
      
      const updateData = documentType === "cpf" 
        ? { cpf: cleanDocument, cnpj: null }
        : { cnpj: cleanDocument, cpf: null };

      console.log("Dados para envio:", updateData);
      const cpfouCnpj = documentType === "cpf" ? updateData.cpf : updateData.cnpj;
      // Tentar salvar via API
      const updatedUser = await updateCurrentUserCpfCnpj(
        cpfouCnpj ,
        documentType === "cpf" ? "F" : "J"
      );
      
      console.log("Usuário atualizado com sucesso:", updatedUser);
      
      // Atualizar o usuário no contexto - isso vai fazer o modal fechar automaticamente
      updateUser(updatedUser);
      
      // Fechar modal explicitamente
      setShowCpfCnpjModal(false);
      
      // Limpar form
      setDocumentValue("");
      setDocumentType("cpf");
      
      toast({
        title: "Documento salvo",
        description: `${documentType.toUpperCase()} cadastrado com sucesso!`,
      });
      
    } catch (error: any) {
      console.error("Erro ao salvar documento:", error);
      
      // Tratar diferentes tipos de erro
      let errorMessage = "Não foi possível salvar o documento.";
      
      if (error.response?.status === 401) {
        errorMessage = "Sessão expirada. Faça login novamente.";
      } else if (error.response?.status === 400) {
        errorMessage = "Dados inválidos. Verifique o documento digitado.";
      } else if (error.response?.status === 409) {
        errorMessage = "Este documento já está cadastrado por outro usuário.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full mt-2">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modal obrigatório para CPF/CNPJ */}
      {console.log("showCpfCnpjModal:", showCpfCnpjModal, "isLoading:", isLoading)}
      <Dialog open={showCpfCnpjModal && !isLoading} onOpenChange={() => {}}>
        <DialogContent 
          className="sm:max-w-[425px]"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <DialogTitle>Documento Obrigatório</DialogTitle>
              </div>
              <DialogDescription>
                Para continuar utilizando o sistema, é necessário cadastrar seu CPF ou CNPJ.
                Esta informação é obrigatória para a rastreabilidade dos produtos.
              </DialogDescription>
            </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Tipo de documento</Label>
              <RadioGroup 
                value={documentType} 
                onValueChange={(value: "cpf" | "cnpj") => {
                  setDocumentType(value);
                  setDocumentValue("");
                }}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cpf" id="cpf" />
                  <Label htmlFor="cpf">CPF (Pessoa Física)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cnpj" id="cnpj" />
                  <Label htmlFor="cnpj">CNPJ (Pessoa Jurídica)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="document">
                {documentType === "cpf" ? "CPF" : "CNPJ"}
                {documentValue && (
                  <span className="ml-2">
                    {(documentType === "cpf" && isValidCPF(documentValue)) || 
                     (documentType === "cnpj" && isValidCNPJ(documentValue)) ? (
                      <span className="text-green-600 text-sm">✓ Válido</span>
                    ) : (
                      <span className="text-red-500 text-sm">✗ Inválido</span>
                    )}
                  </span>
                )}
              </Label>
              <Input
                id="document"
                value={documentValue}
                onChange={(e) => handleDocumentChange(e.target.value)}
                placeholder={documentType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
                maxLength={documentType === "cpf" ? 14 : 18}
                className={
                  documentValue && documentValue.length > 5 ? (
                    (documentType === "cpf" && isValidCPF(documentValue)) || 
                    (documentType === "cnpj" && isValidCNPJ(documentValue))
                      ? "border-green-500 focus:border-green-500"
                      : "border-red-500 focus:border-red-500"
                  ) : ""
                }
                required
              />
              {documentValue && documentValue.length > 5 && (
                <p className="text-sm mt-1">
                  {(documentType === "cpf" && isValidCPF(documentValue)) || 
                   (documentType === "cnpj" && isValidCNPJ(documentValue)) ? (
                    <span className="text-green-600">Documento válido e pronto para cadastrar</span>
                  ) : (
                    <span className="text-red-500">
                      {documentType === "cpf" ? "CPF inválido" : "CNPJ inválido"}
                    </span>
                  )}
                </p>
              )}
            </div>

            <Button 
              onClick={handleSaveDocument}
              disabled={
                loading || 
                !documentValue || 
                (documentType === "cpf" && documentValue.length < 14) ||
                (documentType === "cnpj" && documentValue.length < 18)
              }
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </div>
              ) : (
                "Cadastrar Documento"
              )}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Seus dados são protegidos e utilizados apenas para fins de rastreabilidade.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};