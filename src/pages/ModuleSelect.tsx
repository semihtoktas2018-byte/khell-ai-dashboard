import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Truck, Package, Zap, Globe, Megaphone } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function ModuleSelect() {
  const navigate = useNavigate();
  const { locale, setLocale } = useLocale();

  const isTr = locale === "tr";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <nav className="flex items-center justify-between px-6 h-16 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">KHELL AI</span>
        </div>
        <button
          onClick={() => setLocale(isTr ? "en" : "tr")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          {isTr ? "TR" : "EN"}
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent"
          >
            KHELL AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 tracking-tight"
          >
            {isTr ? "Fikir senden, analiz KHELL'den" : "The idea is yours, the analysis is KHELL's"}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -6 }}
              onClick={() => navigate("/fleet")}
              className="card-glow rounded-2xl p-10 text-left group cursor-pointer border border-border hover:border-primary/50 transition-colors"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Truck className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isTr ? "Filo Analizi" : "Fleet Analysis"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isTr
                  ? "Araç bazlı kâr/zarar analizi. Plaka, gelir ve giderlerini gir, anında sonuç al."
                  : "Vehicle-based profit/loss analysis. Enter plate, revenue and costs, get instant results."}
              </p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -6 }}
              onClick={() => navigate("/products")}
              className="card-glow rounded-2xl p-10 text-left group cursor-pointer border border-border hover:border-primary/50 transition-colors"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Package className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isTr ? "Ürün Analizi" : "Product Analysis"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isTr
                  ? "Kazanan ürünleri bul, kâr marjını hesapla, viral video reklam üret."
                  : "Find winning products, calculate margins, generate viral video ads."}
              </p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -6 }}
              onClick={() => navigate("/ad-analyzer")}
              className="card-glow rounded-2xl p-10 text-left group cursor-pointer border border-border hover:border-primary/50 transition-colors"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Megaphone className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isTr ? "Reklam Analizi" : "Ad Analysis"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isTr
                  ? "Kazanan reklamları analiz et, satış metni üret."
                  : "Analyze winning ads, generate sales copy."}
              </p>
            </motion.button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          A BAMİR Online Store's Production
        </p>
      </footer>
    </div>
  );
}