import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useApi, useMutation, usePagination, useDebounce } from '@/hooks/useApi';

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar loading inicial como true', () => {
    const apiFunction = vi.fn(() => Promise.resolve({ data: 'test' }));
    const { result } = renderHook(() => useApi(apiFunction));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('deve retornar dados após sucesso', async () => {
    const mockData = { data: 'test' };
    const apiFunction = vi.fn(() => Promise.resolve(mockData));
    const { result } = renderHook(() => useApi(apiFunction));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(apiFunction).toHaveBeenCalledTimes(1);
  });

  it('deve retornar erro após falha', async () => {
    const mockError = new Error('API Error');
    const apiFunction = vi.fn(() => Promise.reject(mockError));
    const { result } = renderHook(() => useApi(apiFunction));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toEqual(mockError);
  });

  it('deve refazer requisição quando dependencies mudam', async () => {
    const apiFunction = vi.fn(() => Promise.resolve({ data: 'test' }));
    const { result, rerender } = renderHook(
      ({ deps }) => useApi(apiFunction, deps),
      { initialProps: { deps: [1] } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(apiFunction).toHaveBeenCalledTimes(1);

    // Muda dependencies
    rerender({ deps: [2] });

    await waitFor(() => {
      expect(apiFunction).toHaveBeenCalledTimes(2);
    });
  });
});

describe('useMutation', () => {
  it('deve iniciar com loading false', () => {
    const mutationFn = vi.fn(() => Promise.resolve({ data: 'test' }));
    const { result } = renderHook(() => useMutation(mutationFn));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('deve executar mutação com sucesso', async () => {
    const mockData = { data: 'test' };
    const mutationFn = vi.fn(() => Promise.resolve(mockData));
    const { result } = renderHook(() => useMutation(mutationFn));

    let response;
    await waitFor(async () => {
      response = await result.current.mutate({ input: 'test' });
    });

    expect(response).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mutationFn).toHaveBeenCalledWith({ input: 'test' });
  });

  it('deve tratar erro na mutação', async () => {
    const mockError = new Error('Mutation Error');
    const mutationFn = vi.fn(() => Promise.reject(mockError));
    const { result } = renderHook(() => useMutation(mutationFn));

    await expect(
      result.current.mutate({ input: 'test' })
    ).rejects.toThrow('Mutation Error');

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual(mockError);
    });
  });
});

describe('usePagination', () => {
  it('deve inicializar com valores padrão', () => {
    const { result } = renderHook(() => usePagination());

    expect(result.current.page).toBe(0);
    expect(result.current.limit).toBe(10);
    expect(result.current.skip).toBe(0);
  });

  it('deve inicializar com valores customizados', () => {
    const { result } = renderHook(() => usePagination(2, 20));

    expect(result.current.page).toBe(2);
    expect(result.current.limit).toBe(20);
    expect(result.current.skip).toBe(40);
  });

  it('deve avançar página', () => {
    const { result } = renderHook(() => usePagination());

    expect(result.current.page).toBe(0);

    result.current.nextPage();
    expect(result.current.page).toBe(1);
    expect(result.current.skip).toBe(10);

    result.current.nextPage();
    expect(result.current.page).toBe(2);
    expect(result.current.skip).toBe(20);
  });

  it('deve voltar página sem ir abaixo de 0', () => {
    const { result } = renderHook(() => usePagination(2));

    result.current.prevPage();
    expect(result.current.page).toBe(1);

    result.current.prevPage();
    expect(result.current.page).toBe(0);

    result.current.prevPage();
    expect(result.current.page).toBe(0); // Não vai abaixo de 0
  });

  it('deve ir para página específica', () => {
    const { result } = renderHook(() => usePagination());

    result.current.goToPage(5);
    expect(result.current.page).toBe(5);
    expect(result.current.skip).toBe(50);
  });

  it('deve mudar limite e resetar página', () => {
    const { result } = renderHook(() => usePagination(3, 10));

    expect(result.current.page).toBe(3);
    expect(result.current.limit).toBe(10);

    result.current.changeLimit(20);

    expect(result.current.page).toBe(0); // Resetou
    expect(result.current.limit).toBe(20);
    expect(result.current.skip).toBe(0);
  });
});

describe('useDebounce', () => {
  it('deve retornar valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('test', 500));

    expect(result.current).toBe('test');
  });

  it('deve debouncar valor após delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );

    expect(result.current).toBe('initial');

    // Muda o valor
    rerender({ value: 'updated', delay: 100 });

    // Valor ainda é o antigo
    expect(result.current).toBe('initial');

    // Aguarda o delay
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 200 }
    );
  });

  it('deve cancelar timeout anterior ao mudar valor rapidamente', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 'first' } }
    );

    rerender({ value: 'second' });
    rerender({ value: 'third' });

    // Aguarda o delay
    await waitFor(
      () => {
        expect(result.current).toBe('third');
      },
      { timeout: 200 }
    );
  });
});
