# Guia de Testes

## 📋 Estrutura de Testes

Foi implementado um conjunto completo de testes unitários usando **Vitest** e **Testing Library**.

## 🚀 Como Rodar os Testes

### Instalar Dependências
```bash
npm install
```

### Comandos Disponíveis

```bash
# Rodar todos os testes
npm run test

# Rodar testes em modo watch (desenvolvimento)
npm run test:watch

# Rodar testes com UI interativa
npm run test:ui

# Gerar relatório de cobertura
npm run test:coverage
```

## 📁 Estrutura de Arquivos

```
src/
├── __tests__/              # Testes unitários
│   ├── hooks/
│   │   └── useApi.test.ts
│   ├── context/
│   │   └── AuthContext.test.tsx
│   ├── components/
│   │   └── ProtectedRoute.test.tsx
│   └── lib/
│       └── utils.test.ts
├── test/                   # Utilitários de teste
│   ├── setup.ts           # Configuração global
│   ├── utils.tsx          # Helpers de render
│   └── mocks/
│       └── api.ts         # Mocks de API
└── vitest.config.ts       # Configuração do Vitest
```

## ✅ Testes Implementados

### 1. Hooks (`useApi.test.ts`)
- ✅ `useApi` - Loading, sucesso, erro, re-fetch
- ✅ `useMutation` - Execução de mutações com loading/error
- ✅ `usePagination` - Navegação de páginas, limites
- ✅ `useDebounce` - Debouncing de valores

### 2. Context (`AuthContext.test.tsx`)
- ✅ Estado inicial de loading
- ✅ Carregar usuário autenticado
- ✅ Identificar admin vs usuário comum
- ✅ Login com sucesso
- ✅ Erro no login
- ✅ Logout
- ✅ Atualizar usuário
- ✅ Refresh de dados do usuário

### 3. Componentes (`ProtectedRoute.test.tsx`)
- ✅ Renderizar quando autenticado
- ✅ Redirecionar para login quando não autenticado
- ✅ Validar permissão de admin
- ✅ Tratar token inválido

### 4. Utilitários (`utils.test.ts`)
- ✅ Função `cn()` para combinar classes
- ✅ Remover duplicatas de classes Tailwind
- ✅ Classes condicionais
- ✅ Função `formatNumber()` para formatar números com 2 casas decimais
- ✅ Lidar com valores undefined/null/inválidos

## 🎯 Cobertura de Testes

Metas de cobertura:
- **Hooks**: 90%+
- **Context**: 85%+
- **Components**: 70%+
- **Utils**: 95%+

## 🔧 Configuração

### vitest.config.ts
- Ambiente: jsdom (simula navegador)
- Globals: habilitado para usar `describe`, `it`, `expect` sem import
- Coverage: v8 provider com reports em text/json/html

### test/setup.ts
- Importa `@testing-library/jest-dom` para matchers
- Mock de `localStorage`
- Mock de `window.matchMedia`

### test/utils.tsx
- Wrapper customizado com providers (Router, Auth)
- Re-exporta utilities do Testing Library

### test/mocks/api.ts
- Dados mock para testes (User, Product, Batch, Movement)
- Funções mock da API

## 📝 Exemplos de Uso

### Testar um Hook
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from '@/hooks/useApi';

it('deve carregar dados', async () => {
  const mockFn = vi.fn(() => Promise.resolve({ data: 'test' }));
  const { result } = renderHook(() => useApi(mockFn));

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toEqual({ data: 'test' });
});
```

### Testar um Componente
```typescript
import { render, screen } from '@testing-library/react';

it('deve renderizar botão', () => {
  render(<Button>Clique aqui</Button>);
  expect(screen.getByText('Clique aqui')).toBeInTheDocument();
});
```

## 🐛 Debug

### Modo UI
O Vitest UI oferece interface visual para debug:
```bash
npm run test:ui
```
Acesse: http://localhost:51204/__vitest__/

### Logs
Adicione `console.log` nos testes para debug:
```typescript
it('teste', () => {
  console.log(result.current);
});
```

## 📚 Referências

- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/react)
- [Testing Library - User Events](https://testing-library.com/docs/user-event/intro)
- [Testing Library - Jest DOM](https://github.com/testing-library/jest-dom)

## 🔄 Próximos Passos

Para expandir os testes:
1. Adicionar testes de integração para páginas completas
2. Testar formulários com `@testing-library/user-event`
3. Adicionar testes E2E com Playwright
4. Implementar snapshot testing para componentes UI
5. Adicionar testes de performance
