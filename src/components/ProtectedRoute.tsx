// components/ProtectedRoute.tsx
// Componente para proteger rotas que requerem autenticação

import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../api/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * Componente que protege rotas
 * Redireciona para login se não autenticado
 * Redireciona para home se não for admin (quando requireAdmin = true)
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const location = useLocation();

  // Verifica autenticação
  if (!isAuthenticated()) {
    // Salva a localização atual para redirecionar após login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se requer admin, verifica permissão
  if (requireAdmin) {
    const userProfile = getUserProfile();
    
    if (userProfile?.tipo_perfil !== 'admin') {
      // Redireciona para home se não for admin
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

/**
 * Hook auxiliar para obter perfil do usuário do token
 * Decodifica JWT sem validar (apenas para UI)
 */
const getUserProfile = (): { tipo_perfil: string } | null => {
  try {
    const token = localStorage.getItem('proraf_token');
    if (!token) return null;

    // Decodifica payload do JWT (parte do meio)
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    
    return decoded;
  } catch {
    return null;
  }
};

export default ProtectedRoute;