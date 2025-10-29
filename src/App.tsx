import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/router";
import { AuthProvider } from "@/context/AuthContext";
import { EthereumProvider } from "@/smartContract/contexts/EthereumContext";
import { TransactionProvider } from "@/smartContract/contexts/TransactionContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <EthereumProvider>
        <TransactionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </TransactionProvider>
      </EthereumProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
