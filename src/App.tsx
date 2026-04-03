import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SavedProductsProvider } from "@/contexts/SavedProductsContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import ProductAnalyzer from "./pages/ProductAnalyzer";
import WinningProducts from "./pages/WinningProducts";
import Suppliers from "./pages/Suppliers";
import SavedProducts from "./pages/SavedProducts";
import RiskAnalysis from "./pages/RiskAnalysis";
import ViralDiscovery from "./pages/ViralDiscovery";
import AutoHunter from "./pages/AutoHunter";
import ViralProducts from "./pages/ViralProducts";
import ProductPageGenerator from "./pages/ProductPageGenerator";
import SalesDecisionEngine from "./pages/SalesDecisionEngine";
import NotFound from "./pages/NotFound";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SavedProductsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardHome />} />
                <Route path="analyzer" element={<ProductAnalyzer />} />
                <Route path="winning" element={<WinningProducts />} />
                <Route path="discovery" element={<ViralDiscovery />} />
                <Route path="hunter" element={<AutoHunter />} />
                <Route path="viral-products" element={<ViralProducts />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="saved" element={<SavedProducts />} />
                <Route path="risk" element={<RiskAnalysis />} />
                <Route path="product-page-generator" element={<ProductPageGenerator />} />
                <Route path="sales-decision" element={<SalesDecisionEngine />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SavedProductsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
