import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import * as authApi from '@/api/auth';

vi.mock('@/api/auth');

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('deve renderizar children quando autenticado', () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(true);

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Conteúdo Protegido</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
  });

  it('deve redirecionar para /login quando não autenticado', () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(false);

    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Conteúdo Protegido</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Página de Login')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo Protegido')).not.toBeInTheDocument();
  });

  it('deve renderizar quando admin e requireAdmin=true', () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(true);

    // Mock token com perfil admin
    const adminToken = btoa(
      JSON.stringify({
        tipo_perfil: 'admin',
      })
    );
    localStorage.setItem('proraf_token', `header.${adminToken}.signature`);

    render(
      <BrowserRouter>
        <ProtectedRoute requireAdmin>
          <div>Área Admin</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Área Admin')).toBeInTheDocument();
  });

  it('deve redirecionar para / quando não é admin e requireAdmin=true', () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(true);

    // Mock token com perfil produtor
    const produtorToken = btoa(
      JSON.stringify({
        tipo_perfil: 'produtor',
      })
    );
    localStorage.setItem('proraf_token', `header.${produtorToken}.signature`);

    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <div>Área Admin</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Página Inicial</div>} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Página Inicial')).toBeInTheDocument();
    expect(screen.queryByText('Área Admin')).not.toBeInTheDocument();
  });

  it('deve lidar com token inválido', () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(true);
    localStorage.setItem('proraf_token', 'token-invalido');

    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <div>Área Admin</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Página Inicial</div>} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Página Inicial')).toBeInTheDocument();
  });
});
