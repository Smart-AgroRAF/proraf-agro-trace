import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { MapPin, FileText, Plus, Edit, Loader2, Crown, Trash2 } from "lucide-react";
import { getCurrentUser, updateCurrentUser } from "@/api/user";
import type { User } from "@/api/types";
import { useToast } from "@/hooks/use-toast";
import { 
  createFieldData, 
  listFieldData, 
  updateFieldData, 
  deleteFieldData,
  type FieldData,
  type FieldDataCreate 
} from "@/api/fieldData";

// import { useAuth } from "@/context/AuthContext";


export default function Perfil() {
  const navigate = useNavigate();
  // const { refreshUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditFieldModalOpen, setIsEditFieldModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isSavingField, setIsSavingField] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<number | null>(null);
  const [fieldToEdit, setFieldToEdit] = useState<FieldData | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const { toast } = useToast();

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
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
  const disconnectMetaMask = () => {
    setWalletAddress(null);
    toast({
      title: "Carteira desconectada",
      description: "MetaMask foi desconectada",
    });
  }
  
  const [editData, setEditData] = useState({
    nome: "",
    telefone: "",
  });

  // Estado para campos dinâmicos da API
  const [campos, setCampos] = useState<FieldData[]>([]);
  const [totalCampos, setTotalCampos] = useState(0);

  const [novoCampo, setNovoCampo] = useState<FieldDataCreate>({
    latitude: "",
    longitude: "",
    mapa: "",
    imagem_aerea: "",
    imagem_perfil: "",
    imagem_fundo: "",
    observacoes: "",
  });

  const [editingCampo, setEditingCampo] = useState<FieldDataCreate>({
    latitude: "",
    longitude: "",
    mapa: "",
    imagem_aerea: "",
    imagem_perfil: "",
    imagem_fundo: "",
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
        toast({
          title: "Erro",
          description: "Erro ao carregar dados do usuário",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Carrega campos dinâmicos
  useEffect(() => {
    loadFieldData();
  }, []);

  const loadFieldData = async () => {
    try {
      setIsLoadingFields(true);
      const response = await listFieldData(0, 100); // Carrega até 100 campos
      setCampos(response.items);
      setTotalCampos(response.total);
    } catch (error) {
      console.error("Erro ao carregar campos:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar campos dinâmicos",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFields(false);
    }
  };

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
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil",
        variant: "destructive",
      });
    }
  };
  const changeProfileType = async (type: string) => {
    try {
      if (!userData) return;
      
      setIsUpdatingProfile(true);
      
      // Mostrar loading (opcional)
      toast({
        title: "Atualizando...",
        description: "Atualizando tipo de perfil...",
      });
      
      const updatedUser = await updateCurrentUser({
        tipo_perfil: type,
      });
      
      // Atualizar o estado local
      setUserData(updatedUser);
      
      // Se mudou para Blockchain e MetaMask não está conectado, solicitar conexão
      if (type === "Blockchain" && !walletAddress) {
        toast({
          title: "Perfil atualizado!",
          description: "Agora conecte sua MetaMask para usar os recursos Pro.",
        });
        
        // Tentar conectar automaticamente após um pequeno delay
        setTimeout(() => {
          connectMetaMask();
        }, 1500);
      } else {
        // Mostrar sucesso
        toast({
          title: "Sucesso!",
          description: "Tipo de perfil atualizado com sucesso!",
        });
      }
      
    } catch (error) {
      console.error("Erro ao atualizar tipo de perfil:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tipo de perfil",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddCampo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novoCampo.latitude?.trim() && !novoCampo.longitude?.trim() && !novoCampo.observacoes?.trim()) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos um campo",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSavingField(true);
      const createdField = await createFieldData(novoCampo);
      setCampos([...campos, createdField]);
      setTotalCampos(totalCampos + 1);
      setNovoCampo({ 
        latitude: "",
        longitude: "",
        mapa: "",
        imagem_aerea: "",
        imagem_perfil: "",
        imagem_fundo: "",
        observacoes: "",
      });
      setIsModalOpen(false);
      toast({
        title: "Sucesso!",
        description: "Campo adicionado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao criar campo:", error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar campo",
        variant: "destructive",
      });
    } finally {
      setIsSavingField(false);
    }
  };

  const handleEditCampo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fieldToEdit) {
      return;
    }

    try {
      setIsSavingField(true);
      const updatedField = await updateFieldData(fieldToEdit.id, editingCampo);
      setCampos(campos.map(c => c.id === fieldToEdit.id ? updatedField : c));
      setIsEditFieldModalOpen(false);
      setFieldToEdit(null);
      toast({
        title: "Sucesso!",
        description: "Campo atualizado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar campo:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar campo",
        variant: "destructive",
      });
    } finally {
      setIsSavingField(false);
    }
  };

  const confirmDeleteCampo = async () => {
    if (!fieldToDelete) return;

    try {
      await deleteFieldData(fieldToDelete);
      setCampos(campos.filter(c => c.id !== fieldToDelete));
      setTotalCampos(totalCampos - 1);
      setIsDeleteDialogOpen(false);
      setFieldToDelete(null);
      toast({
        title: "Sucesso!",
        description: "Campo deletado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao deletar campo:", error);
      toast({
        title: "Erro",
        description: "Erro ao deletar campo",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (campo: FieldData) => {
    setFieldToEdit(campo);
    setEditingCampo({
      latitude: campo.latitude || "",
      longitude: campo.longitude || "",
      mapa: campo.mapa || "",
      imagem_aerea: campo.imagem_aerea || "",
      imagem_perfil: campo.imagem_perfil || "",
      imagem_fundo: campo.imagem_fundo || "",
      observacoes: campo.observacoes || "",
    });
    setIsEditFieldModalOpen(true);
  };

  const openDeleteDialog = (campoId: number) => {
    setFieldToDelete(campoId);
    setIsDeleteDialogOpen(true);
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
                <div>
                  <Label className="text-muted-foreground">Tipo de Perfil</Label>
                  <p className="text-lg font-medium">{userData.tipo_perfil === "Blockchain" ? "Usuário Pro!" : "Usuário Comum"}</p>
                  {
                    userData.tipo_perfil !== "Blockchain" && (
                      <Button 
                        className="mt-2 bg-primary hover:bg-primary/90"
                        onClick={() => changeProfileType('Blockchain')}
                        disabled={isUpdatingProfile}
                      >
                        {isUpdatingProfile ? "Atualizando..." : "Mudar para Usuário Pro!"}
                      </Button>
                    )
                  }
                  {
                    userData.tipo_perfil === "Blockchain" && (
                      <Button 
                        className="mt-2 bg-primary hover:bg-primary/90"
                        onClick={() => changeProfileType('user')}
                        disabled={isUpdatingProfile}
                      >
                        {isUpdatingProfile ? "Atualizando..." : "Mudar para Usuário Comum"}
                      </Button>
                    )
                  }
                </div>
                {userData.tipo_perfil === "Blockchain" && (
                  <div>
                    <Label className="text-muted-foreground">Status da MetaMask</Label>
                    <div className="flex items-center gap-3 mt-2">
                      {walletAddress ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600">
                              Conectado: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            </span>
                          </div>

                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-red-600">Desconectado</span>
                          </div>
                          <Button 
                            onClick={connectMetaMask}
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            Conectar MetaMask
                          </Button>
                        </div>
                      )}
                        
                    </div>
                    <div>
                          {walletAddress && (
                          <Button
                            onClick={disconnectMetaMask}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white mt-2"
                          >
                            Desconectar
                          </Button>
                          )}
                        </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Campos do Usuário */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Meus Campos</CardTitle>
                <CardDescription>Gerencie as informações geográficas e imagens dos seus campos</CardDescription>
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
                      Crie um campo personalizado para armazenar informações específicas
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddCampo} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          placeholder="-29.123456"
                          value={novoCampo.latitude}
                          onChange={(e) => setNovoCampo({...novoCampo, latitude: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          placeholder="-53.123456"
                          value={novoCampo.longitude}
                          onChange={(e) => setNovoCampo({...novoCampo, longitude: e.target.value})}
                        />
                      </div>
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="mapa">URL do Mapa</Label>
                      <Input
                        type="file"
                        id="mapa"
                        placeholder="https://exemplo.com/mapa.jpg"
                        value={novoCampo.mapa}
                        onChange={(e) => setNovoCampo({...novoCampo, mapa: e.target.value})}
                      />
        
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imagem_aerea">URL Imagem Aérea</Label>
                      <Input
                        id="imagem_aerea"
                        placeholder="https://exemplo.com/aerea.jpg"
                        value={novoCampo.imagem_aerea}
                        onChange={(e) => setNovoCampo({...novoCampo, imagem_aerea: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imagem_perfil">URL Imagem Perfil</Label>
                      <Input
                        id="imagem_perfil"
                        placeholder="https://exemplo.com/perfil.jpg"
                        value={novoCampo.imagem_perfil}
                        onChange={(e) => setNovoCampo({...novoCampo, imagem_perfil: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imagem_fundo">URL Imagem Fundo</Label>
                      <Input
                        id="imagem_fundo"
                        placeholder="https://exemplo.com/fundo.jpg"
                        value={novoCampo.imagem_fundo}
                        onChange={(e) => setNovoCampo({...novoCampo, imagem_fundo: e.target.value})}
                      />
                    </div> */}
                    <div className="space-y-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        placeholder="Descreva características do campo..."
                        rows={3}
                        value={novoCampo.observacoes}
                        onChange={(e) => setNovoCampo({...novoCampo, observacoes: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSavingField}>
                        {isSavingField ? "Salvando..." : "Adicionar Campo"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoadingFields ? (
                <div className="text-center py-12">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground">Carregando campos...</p>
                </div>
              ) : campos.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhum campo cadastrado</h3>
                  <p className="text-muted-foreground">Adicione seu primeiro campo clicando no botão acima</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campos.map((campo) => (
                    <Card key={campo.id} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-primary" />
                              Campo #{campo.id}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Criado em {new Date(campo.created_at).toLocaleDateString('pt-BR')}
                            </CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditModal(campo)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => openDeleteDialog(campo.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {(campo.latitude || campo.longitude) && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Coordenadas</p>
                              <p className="text-sm text-muted-foreground">
                                {campo.latitude || 'N/A'}, {campo.longitude || 'N/A'}
                              </p>
                            </div>
                          </div>
                        )}
                        {campo.observacoes && (
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Observações</p>
                              <p className="text-sm text-muted-foreground break-words">
                                {campo.observacoes}
                              </p>
                            </div>
                          </div>
                        )}
                        {(campo.mapa || campo.imagem_aerea || campo.imagem_perfil || campo.imagem_fundo) && (
                          <div className="pt-2 border-t">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Imagens anexadas:</p>
                            <div className="flex flex-wrap gap-1">
                              {campo.mapa && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Mapa</span>}
                              {campo.imagem_aerea && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Aérea</span>}
                              {campo.imagem_perfil && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Perfil</span>}
                              {campo.imagem_fundo && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Fundo</span>}
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

          {/* Dialog de Edição de Campo */}
          <Dialog open={isEditFieldModalOpen} onOpenChange={setIsEditFieldModalOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Campo</DialogTitle>
                <DialogDescription>
                  Atualize as informações do campo
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditCampo} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-latitude">Latitude</Label>
                    <Input
                      id="edit-latitude"
                      placeholder="-29.123456"
                      value={editingCampo.latitude}
                      onChange={(e) => setEditingCampo({...editingCampo, latitude: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-longitude">Longitude</Label>
                    <Input
                      id="edit-longitude"
                      placeholder="-53.123456"
                      value={editingCampo.longitude}
                      onChange={(e) => setEditingCampo({...editingCampo, longitude: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-mapa">URL do Mapa</Label>
                  <Input
                    id="edit-mapa"
                    placeholder="https://exemplo.com/mapa.jpg"
                    value={editingCampo.mapa}
                    onChange={(e) => setEditingCampo({...editingCampo, mapa: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-imagem_aerea">URL Imagem Aérea</Label>
                  <Input
                    id="edit-imagem_aerea"
                    placeholder="https://exemplo.com/aerea.jpg"
                    value={editingCampo.imagem_aerea}
                    onChange={(e) => setEditingCampo({...editingCampo, imagem_aerea: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-imagem_perfil">URL Imagem Perfil</Label>
                  <Input
                    id="edit-imagem_perfil"
                    placeholder="https://exemplo.com/perfil.jpg"
                    value={editingCampo.imagem_perfil}
                    onChange={(e) => setEditingCampo({...editingCampo, imagem_perfil: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-imagem_fundo">URL Imagem Fundo</Label>
                  <Input
                    id="edit-imagem_fundo"
                    placeholder="https://exemplo.com/fundo.jpg"
                    value={editingCampo.imagem_fundo}
                    onChange={(e) => setEditingCampo({...editingCampo, imagem_fundo: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-observacoes">Observações</Label>
                  <Textarea
                    id="edit-observacoes"
                    placeholder="Descreva características do campo..."
                    rows={3}
                    value={editingCampo.observacoes}
                    onChange={(e) => setEditingCampo({...editingCampo, observacoes: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsEditFieldModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSavingField}>
                    {isSavingField ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Dialog de Confirmação de Exclusão */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este campo? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDeleteCampo}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
}
