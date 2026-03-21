import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calculator, TrendingUp, Truck, Bookmark, ChevronLeft, Zap, Menu, Shield, LogOut, Flame, Crosshair, Search, FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Ürün Analizi", path: "/dashboard/analyzer", icon: Calculator },
  { label: "Kazanan Ürünler", path: "/dashboard/winning", icon: TrendingUp },
  { label: "Viral Ürün Keşfi", path: "/dashboard/discovery", icon: Flame },
  { label: "Viral Ürün Bulucu", path: "/dashboard/viral-products", icon: Search },
  { label: "Auto Product Hunter", path: "/dashboard/hunter", icon: Crosshair },
  { label: "Tedarikçiler", path: "/dashboard/suppliers", icon: Truck },
  { label: "Risk Analizi", path: "/dashboard/risk", icon: Shield },
  { label: "Ürün Sayfası Oluşturucu", path: "/dashboard/product-page-generator", icon: FileText },
  { label: "Kaydedilenler", path: "/dashboard/saved", icon: Bookmark },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:relative z-50 h-full flex flex-col border-r border-border bg-sidebar ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform lg:transition-none`}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.15 }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-sm font-bold text-foreground tracking-tight whitespace-nowrap">
                KHELL AI
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent text-muted-foreground"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User & Logout */}
        {!collapsed && (
          <div className="px-4 py-4 border-t border-border space-y-3">
            {user && (
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                </div>
                <button onClick={handleLogout} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              A BAMİR Online Store's Production
            </p>
          </div>
        )}
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center gap-3 px-4 border-b border-border shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-sm font-semibold text-foreground">
            {navItems.find((n) => n.path === location.pathname)?.label ?? "Dashboard"}
          </h2>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
