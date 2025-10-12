// contexts/AuthContext.tsx
// Context global para gerenciar autenticação

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, isAuthenticated } from '../api/auth';
import type { LoginRequest, User } from '../api/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega usuário do token ao iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        if (isAuthenticated()) {
          const userData = getUserFromToken();
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      await apiLogin(credentials);
      const userData = getUserFromToken();
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.tipo_perfil === 'admin',
    login,
    logout,
    updateUser,
  };

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

/**
 * Extrai dados do usuário do token JWT
 */
const getUserFromToken = (): User | null => {
  try {
    const token = localStorage.getItem('proraf_token');
    if (!token) return null;

    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    // Monta objeto User a partir do token
    return {
      id: decoded.user_id || 0,
      nome: decoded.nome || '',
      email: decoded.sub || '',
      tipo_pessoa: decoded.tipo_pessoa || 'F',
      tipo_perfil: decoded.tipo_perfil || 'user',
      cpf: decoded.cpf,
      cnpj: decoded.cnpj,
      telefone: decoded.telefone,
      created_at: decoded.created_at || new Date().toISOString(),
      updated_at: decoded.updated_at || new Date().toISOString(),
    };
  } catch {
    return null;
  }
};

export default AuthContext;