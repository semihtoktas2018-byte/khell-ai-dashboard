// build refresh - users route
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SavedProductsProvider } from "@/contexts/SavedProductsContext";
import { AnalysisHistoryProvider } from "@/contexts/AnalysisHistoryContext";
import { OrderLogProvider } from "@/contexts/OrderLogContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LandingPage from "./pages/LandingPage";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthPage from "./pages/AuthPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";
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
import BestSellers from "./pages/BestSellers";
import OrderLog from "./pages/OrderLog";
import StoreSpy from "./pages/StoreSpy";
import EbayResearch from "./pages/EbayResearch";
import UsersAdmin from "./pages/UsersAdmin";
import PriceTracker from "./pages/PriceTracker";
import NotFound from "./pages/NotFound";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
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
    } catch {}
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
                  <OrderLogProvider>
                    <Toaster />
                    <Sonner />
                    <AnimatePresence>
                      {showSplash && <SplashScreen onDone={dismissSplash} />}
                    </AnimatePresence>
                    <BrowserRouter>
                      <ErrorBoundary>
                        <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/refund" element={<RefundPolicy />} />
                        <Route path="/dashboard" element={<DashboardLayout />}>
                          <Route index element={<DashboardHome />} />
                          <Route path="analyzer" element={<ProductAnalyzer />} />
                          <Route path="winning" element={<WinningProducts />} />
                          <Route path="trending" element={<TrendingProducts />} />
                          <Route path="best-sellers" element={<BestSellers />} />
                          <Route path="suppliers" element={<Suppliers />} />
                          <Route path="saved" element={<SavedProducts />} />
                          <Route path="order-log" element={<OrderLog />} />
                          <Route path="risk" element={<RiskAnalysis />} />
                          <Route path="product-page-generator" element={<ProductPageGenerator />} />
                          <Route path="sales-decision" element={<SalesDecisionEngine />} />
                          <Route path="content-engine" element={<ContentEngine />} />
                          <Route path="store-spy" element={<StoreSpy />} />
                          <Route path="ebay" element={<EbayResearch />} />
                          <Route path="users" element={<UsersAdmin />} />
                          <Route path="price-tracker" element={<PriceTracker />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      </ErrorBoundary>
                      <FloatingWhatsApp />
                    </BrowserRouter>
                  </OrderLogProvider>
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
