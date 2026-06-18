import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { SavedProductsProvider } from "@/contexts/SavedProductsContext";
import { AnalysisHistoryProvider } from "@/contexts/AnalysisHistoryContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import ProductAnalyzer from "./pages/ProductAnalyzer";
import WinningProducts from "./pages/WinningProducts";
import Suppliers from "./pages/Suppliers";
import SavedProducts from "./pages/SavedProducts";
import RiskAnalysis from "./pages/RiskAnalysis";
import ProductPageGenerator from "./pages/ProductPageGenerator";
import SalesDecisionEngine from "./pages/SalesDecisionEngine";
import ContentEngine from "./pages/ContentEngine";
import TrendingProducts from "./pages/TrendingProducts";
import NotFound from "./pages/NotFound";
import type { ReactNode } from "react";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem("khell_splash_shown");
    } catch {
      return true;
    }
  });

  const dismissSplash = () => {
    try {
      sessionStorage.setItem("khell_splash_shown", "true");
    } catch {
      // ignore
    }
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <LocaleProvider>
            <AuthProvider>
              <SavedProductsProvider>
                <AnalysisHistoryProvider>
                  <Toaster />
                  <Sonner />
                  <AnimatePresence>
                    {showSplash && <SplashScreen onDone={dismissSplash} />}
                  </AnimatePresence>
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                        <Route index element={<DashboardHome />} />
                        <Route path="analyzer" element={<ProductAnalyzer />} />
                        <Route path="winning" element={<WinningProducts />} />
                        <Route path="trending" element={<TrendingProducts />} />
                        <Route path="suppliers" element={<Suppliers />} />
                        <Route path="saved" element={<SavedProducts />} />
                        <Route path="risk" element={<RiskAnalysis />} />
                        <Route path="product-page-generator" element={<ProductPageGenerator />} />
                        <Route path="sales-decision" element={<SalesDecisionEngine />} />
                        <Route path="content-engine" element={<ContentEngine />} />
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <FloatingWhatsApp />
                  </BrowserRouter>
                </AnalysisHistoryProvider>
              </SavedProductsProvider>
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
