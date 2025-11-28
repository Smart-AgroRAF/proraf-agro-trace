// contexts/AuthContext.tsx
// Context global para gerenciar autenticação

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, isAuthenticated } from '../api/auth';
import { getCurrentUser } from '../api/user';
import type { LoginRequest, User } from '../api/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('AuthProvider iniciando...');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega usuário da API ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('Verificando autenticação no AuthContext...');
        const authenticated = isAuthenticated();
        console.log('isAuthenticated:', authenticated);
        
        if (authenticated) {
          console.log('Carregando dados do usuário...');
          const userData = await getCurrentUser();
          console.log('Usuário carregado:', userData);
          setUser(userData);
        } else {
          console.log('Usuário não autenticado');
          
          // Modo de desenvolvimento: simular usuário para teste
          if (import.meta.env.DEV) {
            console.log('Modo desenvolvimento: simulando usuário');
            const mockUser: User = {
              id: 1,
              nome: "Usuário Teste",
              email: "teste@teste.com",
              tipo_pessoa: "F",
              tipo_perfil: "user",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUser(mockUser);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        // Se der erro, limpa o token
        console.log('Limpando token devido a erro');
        apiLogout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Verificar periodicamente se o token expirou (a cada 1 minuto)
    const tokenCheckInterval = setInterval(() => {
      const authenticated = isAuthenticated();
      
      if (!authenticated && user !== null) {
        console.warn('Token expirado detectado, fazendo logout...');
        apiLogout();
        setUser(null);
        
        // Redirecionar para login
        window.location.href = '/login?expired=true';
      }
    }, 60000); // Verificar a cada 1 minuto

    return () => clearInterval(tokenCheckInterval);
  }, [user]);

  const login = async (credentials: LoginRequest) => {
    try {
      console.log('Iniciando login...');
      setIsLoading(true);
      
      await apiLogin(credentials);
      
      // Busca dados do usuário após login
      console.log('Login bem-sucedido, carregando dados do usuário...');
      const userData = await getCurrentUser();
      console.log('Dados do usuário carregados:', userData);
      
      setUser(userData);
    } catch (error) {
      console.error('Erro no login:', error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Executando logout no AuthContext...');
    
    // Limpar token
    apiLogout();
    
    // Limpar estado do usuário
    setUser(null);
    setIsLoading(false);
    
    // Limpar qualquer outro dado em cache
    sessionStorage.clear();
    
    // Cancelar Google Sign-In se estiver ativo
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    console.log('Logout concluído - Recarregando página...');
    
    // Forçar reload completo da página para limpar cache e estado
    window.location.href = '/login';
    window.location.reload();
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.tipo_perfil === 'admin',
    login,
    logout,
    updateUser,
    refreshUser,
  };

  console.log('AuthProvider value:', { 
    user: user?.nome || 'null', 
    isAuthenticated: !!user, 
    isLoading 
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar o contexto de autenticação
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;