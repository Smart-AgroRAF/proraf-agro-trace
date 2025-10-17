import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, FileText, Plus, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser, updateCurrentUser } from "@/api/user";
import type { User } from "@/api/types";
// import { useAuth } from "@/context/AuthContext";


export default function Perfil() {
  const navigate = useNavigate();
  // const { refreshUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  
  const [editData, setEditData] = useState({
    nome: "",
    telefone: "",
  });

  // Dados mockados dos campos
  const [campos, setCampos] = useState([
    {
      id: 1,
      latitude: "-23.5505",
      longitude: "-46.6333",
      observacoes: "Campo principal de cultivo de hortaliças",
      created_at: "2024-01-15",
    },
    {
      id: 2,
      latitude: "-23.5520",
      longitude: "-46.6350",
      observacoes: "Área de cultivo orgânico certificado",
      created_at: "2024-02-20",
    },
  ]);

  const [novoCampo, setNovoCampo] = useState({
    latitude: "",
    longitude: "",
    observacoes: "",
  });

  // Carrega dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await getCurrentUser();
        setUserData(user);
        setEditData({
          nome: user.nome,
          telefone: user.telefone || "",
        });
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        toast.error("Erro ao carregar dados do usuário");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatedUser = await updateCurrentUser({
        nome: editData.nome,
        telefone: editData.telefone,
      });
      
      setUserData(updatedUser);
      // await refreshUser();
      setIsEditModalOpen(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
    }
  };

  const handleAddCampo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novoCampo.latitude || !novoCampo.longitude) {
      toast.error("Preencha latitude e longitude");
      return;
    }

    const campo = {
      id: campos.length + 1,
      ...novoCampo,
      created_at: new Date().toISOString().split('T')[0],
    };

    setCampos([...campos, campo]);
    setNovoCampo({ latitude: "", longitude: "", observacoes: "" });
    setIsModalOpen(false);
    toast.success("Campo adicionado com sucesso!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Erro ao carregar dados do usuário</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Dados do Usuário */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Meu Perfil</CardTitle>
                <CardDescription>Informações da sua conta</CardDescription>
              </div>
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                    <DialogDescription>
                      Atualize suas informações pessoais
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEditProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-nome">Nome *</Label>
                      <Input
                        id="edit-nome"
                        value={editData.nome}
                        onChange={(e) => setEditData({...editData, nome: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-telefone">Telefone</Label>
                      <Input
                        id="edit-telefone"
                        placeholder="(00) 00000-0000"
                        value={editData.telefone}
                        onChange={(e) => setEditData({...editData, telefone: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Salvar Alterações
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="text-lg font-medium">{userData.nome}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-lg font-medium">{userData.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    {userData.tipo_pessoa === "F" ? "CPF" : "CNPJ"}
                  </Label>
                  <p className="text-lg font-medium">{userData.cpf || userData.cnpj}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="text-lg font-medium">{userData.telefone || "Não informado"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campos do Usuário */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Meus Campos</CardTitle>
                <CardDescription>Gerencie as informações dos seus campos</CardDescription>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Campo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Campo</DialogTitle>
                    <DialogDescription>
                      Insira as informações do campo que deseja cadastrar
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddCampo} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude *</Label>
                        <Input
                          id="latitude"
                          placeholder="-23.5505"
                          value={novoCampo.latitude}
                          onChange={(e) => setNovoCampo({...novoCampo, latitude: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude *</Label>
                        <Input
                          id="longitude"
                          placeholder="-46.6333"
                          value={novoCampo.longitude}
                          onChange={(e) => setNovoCampo({...novoCampo, longitude: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        placeholder="Descreva características do campo..."
                        rows={4}
                        value={novoCampo.observacoes}
                        onChange={(e) => setNovoCampo({...novoCampo, observacoes: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Adicionar Campo
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {campos.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhum campo cadastrado</h3>
                  <p className="text-muted-foreground">Adicione seu primeiro campo clicando no botão acima</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campos.map((campo) => (
                    <Card key={campo.id} className="border-2">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          Campo #{campo.id}
                        </CardTitle>
                        <CardDescription>
                          Cadastrado em {new Date(campo.created_at).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Coordenadas</p>
                            <p className="text-sm text-muted-foreground">
                              {campo.latitude}, {campo.longitude}
                            </p>
                          </div>
                        </div>
                        {campo.observacoes && (
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Observações</p>
                              <p className="text-sm text-muted-foreground">
                                {campo.observacoes}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
