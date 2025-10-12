// hooks/useApi.ts
// Hooks customizados para facilitar uso da API

import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../api/client';
import toast from 'react-hot-toast';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

/**
 * Hook para fazer requisições à API com loading e error states
 */
export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction();
        if (isMounted) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error as ApiError,
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}

/**
 * Hook para mutations (POST, PUT, DELETE) com loading state
 */
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await mutationFn(variables);
        setLoading(false);
        return result;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        setLoading(false);
        throw apiError;
      }
    },
    [mutationFn]
  );

  return { mutate, loading, error };
}

/**
 * Hook para fazer requisições com retry automático
 */
export function useApiWithRetry<T>(
  apiFunction: () => Promise<T>,
  retries: number = 3,
  dependencies: any[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    let attempts = 0;

    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      while (attempts < retries) {
        try {
          const result = await apiFunction();
          if (isMounted) {
            setState({ data: result, loading: false, error: null });
          }
          return;
        } catch (error) {
          attempts++;
          if (attempts >= retries) {
            if (isMounted) {
              setState({
                data: null,
                loading: false,
                error: error as ApiError,
              });
            }
          } else {
            // Aguarda antes de tentar novamente
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
          }
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}

/**
 * Hook para paginação
 */
export function usePagination(initialPage: number = 0, initialLimit: number = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
  const goToPage = useCallback((newPage: number) => setPage(Math.max(0, newPage)), []);
  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(0); // Reset para primeira página
  }, []);

  const skip = page * limit;

  return {
    page,
    limit,
    skip,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
  };
}

/**
 * Hook para tratar erros da API automaticamente
 */
export function useApiErrorHandler() {
  const handleError = useCallback((error: ApiError) => {
    const message = error.data?.detail || error.statusText || 'Erro ao processar requisição';

    if (error.status === 401) {
      toast.error('Sessão expirada. Faça login novamente.');
      // Redirecionar para login
      window.location.href = '/login';
    } else if (error.status === 403) {
      toast.error('Você não tem permissão para realizar esta ação.');
    } else if (error.status === 404) {
      toast.error('Recurso não encontrado.');
    } else if (error.status === 400) {
      // Erro de validação
      if (Array.isArray(error.data?.detail)) {
        // Erro de validação do Pydantic
        const validationErrors = error.data.detail
          .map((err: any) => `${err.loc.join('.')}: ${err.msg}`)
          .join(', ');
        toast.error(`Erro de validação: ${validationErrors}`);
      } else {
        toast.error(message);
      }
    } else if (error.status >= 500) {
      toast.error('Erro no servidor. Tente novamente mais tarde.');
    } else {
      toast.error(message);
    }
  }, []);

  return { handleError };
}

/**
 * Hook para debounce de valores
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}