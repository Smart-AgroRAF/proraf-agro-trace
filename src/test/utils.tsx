import { ReactElement, ReactNode } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

interface AllProvidersProps {
  children: ReactNode;
}

/**
 * Wrapper com todos os providers necessários
 */
const AllProviders = ({ children }: AllProvidersProps) => {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
};

/**
 * Função customizada de render que inclui providers
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => rtlRender(ui, { wrapper: AllProviders, ...options });

// Re-exporta tudo do testing library
export * from '@testing-library/react';

// Sobrescreve render com nossa versão customizada
export { customRender as render };
