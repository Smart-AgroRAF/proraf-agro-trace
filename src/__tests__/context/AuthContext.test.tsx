import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import * as authApi from '@/api/auth';
import * as userApi from '@/api/user';
import { mockUser, mockAdminUser } from '@/test/mocks/api';

// Mock das APIs
vi.mock('@/api/auth');
vi.mock('@/api/user');

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('deve iniciar com estado de loading', () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(false);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('deve carregar usuário autenticado ao iniciar', async () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(true);
    vi.mocked(userApi.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  it('deve identificar usuário admin corretamente', async () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(true);
    vi.mocked(userApi.getCurrentUser).mockResolvedValue(mockAdminUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockAdminUser);
    expect(result.current.isAdmin).toBe(true);
  });

  it('deve fazer login com sucesso', async () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(false);
    vi.mocked(authApi.login).mockResolvedValue({
      access_token: 'fake-token',
      token_type: 'bearer',
    });
    vi.mocked(userApi.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.login({
      username: 'teste@exemplo.com',
      password: 'senha123',
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    expect(authApi.login).toHaveBeenCalledWith({
      username: 'teste@exemplo.com',
      password: 'senha123',
    });
    expect(userApi.getCurrentUser).toHaveBeenCalled();
  });

  it('deve propagar erro ao falhar login', async () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(false);
    const mockError = new Error('Credenciais inválidas');
    vi.mocked(authApi.login).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      result.current.login({
        username: 'teste@exemplo.com',
        password: 'senha-errada',
      })
    ).rejects.toThrow('Credenciais inválidas');

    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('deve fazer logout corretamente', async () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(true);
    vi.mocked(userApi.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    result.current.logout();

    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(authApi.logout).toHaveBeenCalled();
  });

  it('deve atualizar usuário', async () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(true);
    vi.mocked(userApi.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    const updatedUser = { ...mockUser, nome: 'Nome Atualizado' };
    result.current.updateUser(updatedUser);

    expect(result.current.user).toEqual(updatedUser);
  });

  it('deve refazer busca do usuário', async () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(true);
    vi.mocked(userApi.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    const updatedUser = { ...mockUser, nome: 'Nome Atualizado da API' };
    vi.mocked(userApi.getCurrentUser).mockResolvedValue(updatedUser);

    await result.current.refreshUser();

    await waitFor(() => {
      expect(result.current.user).toEqual(updatedUser);
    });

    expect(userApi.getCurrentUser).toHaveBeenCalledTimes(2);
  });

  it('deve tratar erro ao carregar usuário inicial', async () => {
    vi.mocked(authApi.isAuthenticated).mockReturnValue(true);
    vi.mocked(userApi.getCurrentUser).mockRejectedValue(
      new Error('Erro ao buscar usuário')
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBe(null);
    expect(authApi.logout).toHaveBeenCalled();
  });

  it('deve lançar erro quando useAuth é usado fora do provider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth deve ser usado dentro de um AuthProvider');
  });
});
