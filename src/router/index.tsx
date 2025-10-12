import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public pages
import Landing from "@/pages/Landing";
import Rastrear from "@/pages/Rastrear";
import NotFound from "@/pages/NotFound";

// Auth pages
import Login from "@/pages/auth/Login";
import Cadastro from "@/pages/auth/Cadastro";

// Protected pages
import Dashboard from "@/pages/Dashboard";
import Perfil from "@/pages/Perfil";

// Products
import Produtos from "@/pages/products/Produtos";
import NovoProduto from "@/pages/products/NovoProduto";
import ProdutoDetalhes from "@/pages/products/ProdutoDetalhes";

// Batches
import Lotes from "@/pages/batches/Lotes";
import NovoLote from "@/pages/batches/NovoLote";
import LoteDetalhes from "@/pages/batches/LoteDetalhes";

// Movements
import Movimentacoes from "@/pages/movements/Movimentacoes";
import NovaMovimentacao from "@/pages/movements/NovaMovimentacao";
import MovimentacaoDetalhes from "@/pages/movements/MovimentacaoDetalhes";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/rastrear" element={<Rastrear />} />
      
      {/* Rotas Protegidas - Todos os usuários autenticados */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } 
      />
      
      {/* Produtos - Rotas Protegidas */}
      <Route 
        path="/produtos" 
        element={
          <ProtectedRoute>
            <Produtos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/produtos/novo" 
        element={
          <ProtectedRoute>
            <NovoProduto />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/produtos/:id" 
        element={
          <ProtectedRoute>
            <ProdutoDetalhes />
          </ProtectedRoute>
        } 
      />
      
      {/* Lotes - Rotas Protegidas */}
      <Route 
        path="/lotes" 
        element={
          <ProtectedRoute>
            <Lotes />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/lotes/novo" 
        element={
          <ProtectedRoute>
            <NovoLote />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/lotes/:id" 
        element={
          <ProtectedRoute>
            <LoteDetalhes />
          </ProtectedRoute>
        } 
      />
      
      {/* Movimentações - Rotas Protegidas */}
      <Route 
        path="/movimentacoes" 
        element={
          <ProtectedRoute>
            <Movimentacoes />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/movimentacoes/nova" 
        element={
          <ProtectedRoute>
            <NovaMovimentacao />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/movimentacoes/:id" 
        element={
          <ProtectedRoute>
            <MovimentacaoDetalhes />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
