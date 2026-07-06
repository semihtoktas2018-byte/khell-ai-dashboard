import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Lock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LiveTeaserAnalyzerProps {
  isTr?: boolean;
}

export default function LiveTeaserAnalyzer({ isTr = true }: LiveTeaserAnalyzerProps) {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ count: number; score: number } | null>(null);
  const [error, setError] = useState(false);
  const PLACEHOLDER_EXAMPLES = ["Stanley Cup", "Mini Fan", "Portable Blender", "LED Projector", "Pet Hair Remover", "Wireless Earbuds"];
  const [phIndex, setPhIndex] = useState(0);
  useEffect(() => {
    if (productName) return;
    const id = setInterval(() => setPhIndex((i) => (i + 1) % PLACEHOLDER_EXAMPLES.length), 3200);
    return () => clearInterval(id);
  }, [productName]);

  const handleAnalyze = async () => {
    const name = productName.trim();
    if (!name || loading) return;
    setLoading(true);
    setError(false);
    setResult(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("cj-proxy", {
        body: { path: "/api2.0/v1/product/list", query: { pageNum: "1", pageSize: "20", productNameEn: name } },
      });
      if (fnErr) throw fnErr;
      const count = data?.data?.total ?? data?.data?.list?.length ?? 0;
      const score = Math.min(100, Math.round((count / 50) * 100));
      setResult({ count, score });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 20px 60px hsl(217 91% 60% / 0.15), 0 0 0 1px hsl(217 91% 60% / 0.25)",
          "0 20px 80px hsl(217 91% 60% / 0.35), 0 0 0 1px hsl(217 91% 60% / 0.5)",
          "0 20px 60px hsl(217 91% 60% / 0.15), 0 0 0 1px hsl(217 91% 60% / 0.25)",
        ],
      }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-2xl p-6 sm:p-9 max-w-xl mx-auto"
      style={{
        background: "linear-gradient(160deg, hsl(222 47% 9% / 0.9), hsl(222 47% 5% / 0.95))",
        border: "1px solid hsl(217 91% 60% / 0.35)",
      }}
    >
      <motion.p
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="text-center text-xs font-bold uppercase tracking-widest mb-1.5"
        style={{ color: "hsl(38 92% 60%)" }}
      >
        {isTr ? "⚡ ÜCRETSİZ DENE — KAYIT GEREKMEZ" : "⚡ TRY FREE — NO SIGNUP NEEDED"}
      </motion.p>
      <h3 className="text-center text-xl sm:text-2xl font-black text-foreground mb-5">
        {isTr ? "Bir ürün adı yaz, gerçek zamanlı veriyle mini analiz gör" : "Enter a product name, see a live mini analysis"}
      </h3>

      <div className="flex gap-2 mb-4">
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAnalyze(); }}
          placeholder={`${isTr ? "Örn" : "e.g"}: ${PLACEHOLDER_EXAMPLES[phIndex]}`}
          className="input-dark flex-1 h-12 text-base"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-6 h-12 rounded-lg flex items-center gap-2 font-bold text-white shrink-0 transition-transform hover:scale-105 disabled:opacity-70"
          style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(199 89% 55%))", boxShadow: "0 6px 20px hsl(217 91% 60% / 0.4)" }}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          {isTr ? "Analiz Et" : "Analyze"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs text-destructive">
            {isTr ? "Bir sorun oldu, tekrar dene." : "Something went wrong, try again."}
          </motion.p>
        )}

        {result && !error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="rounded-lg bg-background/40 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">📦 {isTr ? "Tedarikçi Yoğunluğu" : "Supplier Density"}</span>
              <span className="text-sm font-bold font-mono text-foreground">{result.count} {isTr ? "ürün" : "products"} → {result.score}/100</span>
            </div>

            <div className="relative rounded-lg overflow-hidden">
              <div className="px-4 py-3 space-y-2" style={{ filter: "blur(5px)" }}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">🛒 {isTr ? "Pazar Doygunluğu" : "Market Saturation"}</span>
                  <span className="font-mono font-bold">72/100</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">💬 {isTr ? "Organik İlgi" : "Organic Buzz"}</span>
                  <span className="font-mono font-bold">55/100</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>KHELL SKORU</span>
                  <span>84/100</span>
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center" style={{ background: "hsl(222 47% 6% / 0.55)" }}>
                <Lock className="h-5 w-5 text-amber-400" />
                <button
                  onClick={() => navigate("/auth")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(24 95% 53%))" }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isTr ? "Ücretsiz Kayıt Ol, Tam KHELL Skorunu Gör" : "Sign Up Free to See Full KHELL Score"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
