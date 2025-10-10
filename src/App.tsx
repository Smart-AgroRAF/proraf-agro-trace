import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import NovoProduto from "./pages/NovoProduto";
import Lotes from "./pages/Lotes";
import NovoLote from "./pages/NovoLote";
import Movimentacoes from "./pages/Movimentacoes";
import NovaMovimentacao from "./pages/NovaMovimentacao";
import Rastrear from "./pages/Rastrear";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/rastrear" element={<Rastrear />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/produtos" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />
          <Route path="/produtos/novo" element={<ProtectedRoute><NovoProduto /></ProtectedRoute>} />
          <Route path="/lotes" element={<ProtectedRoute><Lotes /></ProtectedRoute>} />
          <Route path="/lotes/novo" element={<ProtectedRoute><NovoLote /></ProtectedRoute>} />
          <Route path="/movimentacoes" element={<ProtectedRoute><Movimentacoes /></ProtectedRoute>} />
          <Route path="/movimentacoes/nova" element={<ProtectedRoute><NovaMovimentacao /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
