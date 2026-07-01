import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calculator, TrendingUp, Truck, Bookmark, ChevronLeft, Zap, Menu, Shield, LogOut, Flame, FileText, Brain, Globe, Video, Sun, Moon, Bell, X, Package, Wallet, Store, Tag,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useTheme } from "@/contexts/ThemeContext";
import OnboardingTour from "@/components/OnboardingTour";

const CHANGELOG_VERSION = "v1.4.0";

const changelog = [
  {
    version: "v1.4.0",
    dateTr: "18 Haziran 2026",
    dateEn: "June 18, 2026",
    itemsTr: [
      "Satış Defteri eklendi — gerçek siparişlerini kaydet, gerçek kâr/zarar takip et",
      "Ürün kartlarına Facebook & TikTok'ta arama linkleri eklendi",
      "Editör Seçimi rozeti eklendi",
      "Yeni eklenen ürünler için 🆕 Yeni etiketi eklendi",
      "Güncel döviz kuru otomatik takip ediliyor",
      "Marka açılış animasyonu eklendi",
    ],
    itemsEn: [
      "Order Log added — track real orders and profit/loss",
      "Facebook & TikTok search links added to product cards",
      "Editor's Pick badge added",
      "🆕 New label added for recently added products",
      "Live exchange rate tracking added",
      "Brand splash animation added",
    ],
  },
  {
    version: "v1.3.0",
    dateTr: "14 Haziran 2026",
    dateEn: "June 14, 2026",
    itemsTr: [
      "Trend Skoru eklendi",
      "Rakip Analizi eklendi",
      "Kâr Simülatörü eklendi",
      "Pazar Yeri Komisyon hesaplayıcı eklendi",
      "WhatsApp paylaşım eklendi",
    ],
    itemsEn: [
      "Trend Score added",
      "Competitor Analysis added",
      "Profit Simulator added",
      "Marketplace Commission calculator added",
      "WhatsApp share added",
    ],
  },
  {
    version: "v1.2.0",
    dateTr: "08 Haziran 2026",
    dateEn: "June 8, 2026",
    itemsTr: [
      "CJdropshipping ürün arama entegrasyonu eklendi",
      "Dashboard performansı iyileştirildi",
    ],
    itemsEn: [
      "CJdropshipping product search integration added",
      "Dashboard performance improved",
    ],
  },
];

const navKeys = [
  { labelKey: "nav.dashboard", path: "/dashboard", icon: LayoutDashboard },
  { labelKey: "nav.analyzer", path: "/dashboard/analyzer", icon: Calculator, tourId: "nav-analyzer" },
  { labelKey: "nav.winning", path: "/dashboard/winning", icon: TrendingUp, tourId: "nav-winning" },
  { labelKey: "nav.trending", path: "/dashboard/trending", icon: Flame, tourId: "nav-trending" },
  { labelKey: "nav.suppliers", path: "/dashboard/suppliers", icon: Truck },
  { labelKey: "nav.risk", path: "/dashboard/risk", icon: Shield },
  { labelKey: "nav.pageGen", path: "/dashboard/product-page-generator", icon: FileText },
  { labelKey: "nav.salesDecision", path: "/dashboard/sales-decision", icon: Brain },
  { labelKey: "nav.contentEngine", path: "/dashboard/content-engine", icon: Video },
  { labelKey: "nav.saved", path: "/dashboard/saved", icon: Bookmark },
  { labelKey: "nav.orderLog", path: "/dashboard/order-log", icon: Wallet },
  { labelKey: "nav.storeSpy", path: "/dashboard/store-spy", icon: Store },
  { labelKey: "nav.priceTracker", path: "/dashboard/price-tracker", icon: Tag },
];

function useChangelog() {
  const key = `changelog_seen_${CHANGELOG_VERSION}`;
  const seen = localStorage.getItem(key) === "true";
  const markSeen = () => localStorage.setItem(key, "true");
  return { seen, markSeen };
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { seen, markSeen } = useChangelog();
  const [notifOpen, setNotifOpen] = useState(!seen);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const { theme, toggle: toggleTheme } = useTheme();
  const isTr = locale === "tr";

  const handleLogout = () => { logout(); navigate("/"); };
  const handleDismiss = () => { markSeen(); setNotifOpen(false); };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <OnboardingTour />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed lg:relative z-50 h-full flex flex-col border-r border-border bg-sidebar ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} transition-transform lg:transition-none`}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 overflow-hidden hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            {!collapsed && <span className="text-sm font-bold text-foreground tracking-tight whitespace-nowrap">KHELL AI</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent text-muted-foreground">
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navKeys.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => { navigate(item.path); setMobileOpen(false); }}
                data-tour={item.tourId}
                className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{t(item.labelKey)}</span>}
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="px-4 py-4 border-t border-border space-y-3">
            <a
              href="https://www.shopier.com/bamironlinestore/46009500"
              target="_blank"
              rel="noopener noreferrer"
              data-tour="pro-access"
              className="flex flex-col items-center w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-3 px-3 transition-all shadow-lg shadow-amber-500/20"
            >
              <span className="text-xs font-bold flex items-center gap-1.5">🔥 PRO ACCESS</span>
              <span className="text-[10px] opacity-90 mt-0.5">{isTr ? "Sınırsız Analiz" : "Unlimited Analyses"}</span>
              <span className="text-[10px] opacity-90">{isTr ? "Kazanan Ürünleri Bul" : "Find Winning Products"}</span>
              <span className="mt-2 text-xs font-bold bg-white/20 rounded-md px-3 py-1">Upgrade Now</span>
            </a>
            <a
              href="https://signal-magic-grab.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 w-full rounded-lg border py-2.5 px-3 transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(155,92,255,0.14), rgba(245,182,41,0.10))",
                borderColor: "rgba(245,182,41,0.35)",
              }}
            >
              <span className="text-lg shrink-0">🪙</span>
              <span className="min-w-0 text-left">
                <span className="block text-[11px] font-bold text-foreground leading-tight">
                  {isTr ? "Kripto sinyalleriyle ilgileniyor musun?" : "Interested in crypto signals?"}
                </span>
                <span className="block text-[10px] leading-tight" style={{ color: "#f5b629" }}>
                  {isTr ? "KELTOŞ Paraya Koş'a göz at →" : "Check out KELTOŞ →"}
                </span>
              </span>
            </a>
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
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">A BAMİR Online Store's Production</p>
          </div>
        )}
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-center gap-2 bg-green-500/10 border-b border-green-500/20 py-1.5 px-4">
          <Package className="h-3 w-3 text-green-600 dark:text-green-400 shrink-0" />
          <p className="text-[11px] text-green-700 dark:text-green-400 font-medium">
            {isTr
              ? "CJdropshipping ile entegre — gerçek zamanlı ürün verisi aktif"
              : "Integrated with CJdropshipping — real-time product data active"}
          </p>
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
        </div>

        <header className="h-14 flex items-center gap-3 px-4 border-b border-border shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-sm font-semibold text-foreground flex-1">
            {navKeys.find((n) => n.path === location.pathname)?.labelKey
              ? t(navKeys.find((n) => n.path === location.pathname)!.labelKey)
              : "Dashboard"}
          </h2>

          <div className="relative">
            <button onClick={() => setNotifOpen((v) => !v)}
              className="relative flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-3.5 w-3.5" />
              {!seen && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 w-80 rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        {isTr ? "Yenilikler" : "What's New"}
                      </span>
                      <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium">{CHANGELOG_VERSION}</span>
                    </div>
                    <button onClick={() => setNotifOpen(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {changelog.map((log) => (
                      <div key={log.version} className="px-4 py-3 border-b border-border/50 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-primary">{log.version}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {isTr ? log.dateTr : log.dateEn}
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {(isTr ? log.itemsTr : log.itemsEn).map((item, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-primary mt-0.5">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-border">
                    <button onClick={handleDismiss} className="w-full text-xs font-medium bg-primary text-primary-foreground rounded-lg py-2 hover:opacity-90 transition-opacity">
                      {isTr ? "Anladım ✓" : "Got it ✓"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setLocale(locale === "tr" ? "en" : locale === "en" ? "fr" : "tr")}
            
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            <Globe className="h-3.5 w-3.5" />
            {locale === "tr" ? "TR" : locale === "en" ? "EN" : "FR"}
        
          </button>
          <button onClick={toggleTheme}
            className="flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
