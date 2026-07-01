import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Loader2, Radio, BarChart3, FileText, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { translateProducts } from "@/lib/translate";
import { isEditorPick } from "@/lib/editorPicks";

const CJ_EMAIL = import.meta.env.VITE_CJ_EMAIL || "bamir.global@gmail.com";
const CJ_API_KEY = import.meta.env.VITE_CJ_API_KEY || "26689fbeeb5045f89ec8764c32aaada0";

interface CJProduct {
  pid: string;
  productName: string;
  productNameEn?: string;
  productImage: string;
  sellPrice?: string;
  productSku?: string;
  productUrl?: string;
  categoryName?: string;
}

let cachedToken: { token: string; exp: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.exp > Date.now()) return cachedToken.token;
  const res = await fetch("https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CJ_EMAIL, password: CJ_API_KEY }),
  });
  const data = await res.json();
  if (!data?.data?.accessToken) {
    throw new Error(`Token Hatası: ${data?.message} (code: ${data?.code})`);
  }
  cachedToken = { token: data.data.accessToken, exp: Date.now() + 1000 * 60 * 60 * 12 };
  return cachedToken.token;
}

export default function CJProductSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CJProduct[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setTranslations({});
    try {
      const token = await getAccessToken();
      const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=12&productNameEn=${encodeURIComponent(query)}`;
      const res = await fetch(url, { headers: { "CJ-Access-Token": token } });
      const data = await res.json();
      if (!data?.data?.list) {
        throw new Error(`Ürün Arama Hatası: ${data?.message} (code: ${data?.code})`);
      }
      setResults(data.data.list);
      // Ürün adlarını Türkçeye çevir
      const names = data.data.list.map((p: CJProduct) => p.productNameEn || p.productName).filter(Boolean);
      translateProducts(names).then(setTranslations).catch(() => {});
    } catch (e: any) {
      setError(e?.message || "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-xl p-5 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, hsl(222 47% 9% / 0.7), hsl(222 47% 6% / 0.85))",
        backdropFilter: "blur(12px)",
        border: "1px solid hsl(24 95% 53% / 0.25)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={{
              background: "linear-gradient(145deg, hsl(24 95% 53% / 0.18), hsl(24 95% 53% / 0.06))",
              border: "1px solid hsl(24 95% 53% / 0.3)",
            }}
          >
            <Package className="h-4 w-4 text-orange-500" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">CJ Dropshipping Ürün Arama</h3>
        </div>
        <motion.span
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
          style={{
            background: "linear-gradient(135deg, hsl(24 95% 53% / 0.18), hsl(24 95% 53% / 0.08))",
            color: "hsl(24 95% 58%)",
            border: "1px solid hsl(24 95% 53% / 0.35)",
            boxShadow: "0 2px 12px hsl(24 95% 53% / 0.15)",
          }}
        >
          <Radio className="h-2.5 w-2.5" /> CANLI VERİ
        </motion.span>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Ürün adı (ör. wireless earbuds)"
            className="w-full h-10 pl-10 pr-3 rounded-md bg-accent/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button
          onClick={search}
          disabled={loading || !query.trim()}
          className="h-10 px-5 rounded-md text-white text-sm font-medium disabled:opacity-50 flex items-center gap-2 transition-shadow"
          style={{
            background: "linear-gradient(135deg, hsl(24 95% 53%), hsl(38 92% 50%))",
            boxShadow: "0 6px 20px hsl(24 95% 53% / 0.35)",
          }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Ara
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-risky/10 text-risky text-xs px-3 py-2 mb-3">{error}</div>
      )}

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            {results.map((p, i) => {
              const cost = parseFloat(p.sellPrice || "0") || 0;
              const estSale = cost * 3;
              const margin = cost > 0 ? Math.round(((estSale - cost) / estSale) * 100) : 0;
              const rawName = p.productNameEn || p.productName;
              const displayName = translations[rawName] || rawName;
              const marginAccent = margin >= 60 ? "hsl(142 71% 50%)" : margin >= 40 ? "hsl(199 89% 60%)" : "hsl(38 92% 55%)";
              const isPick = isEditorPick(rawName);

              return (
                <motion.div
                  key={p.pid || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}
                  className="group rounded-lg overflow-hidden flex flex-col transition-shadow duration-300"
                  style={{
                    background: "linear-gradient(160deg, hsl(222 47% 11% / 0.7), hsl(222 47% 7% / 0.85))",
                    backdropFilter: "blur(10px)",
                    border: "1px solid hsl(217 32% 22% / 0.7)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${marginAccent}55`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 10px 28px ${marginAccent}1f`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.border = "1px solid hsl(217 32% 22% / 0.7)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <a href={p.productUrl || `https://cjdropshipping.com/product/-p-${p.pid}.html`}
                    target="_blank"
                    rel="noreferrer"
                    className="block aspect-square bg-background overflow-hidden relative"
                  >
                    {p.productImage ? (
                      <img
                        src={p.productImage.split(",")[0]}
                        alt={displayName}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                    {isPick && (
                      <span
                        className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-md text-white"
                        style={{
                          background: "linear-gradient(135deg, hsl(45 93% 47%), hsl(38 92% 50%))",
                          boxShadow: "0 4px 14px hsl(45 93% 47% / 0.45)",
                        }}
                      >
                        ⭐ Editör Seçimi
                      </span>
                    )}
                  </a>
                  <div className="p-3 space-y-2 flex-1 flex flex-col">
                    <p className="text-xs font-medium text-foreground line-clamp-2 min-h-[2rem]">{displayName}</p>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="rounded-lg px-2 py-1" style={{ background: "hsl(217 32% 12% / 0.6)", border: "1px solid hsl(217 32% 20% / 0.5)" }}>
                        <p className="text-muted-foreground">Maliyet</p>
                        <p className="font-mono font-bold text-foreground">${cost.toFixed(2)}</p>
                      </div>
                      <div className="rounded-lg px-2 py-1" style={{ background: "hsl(24 95% 53% / 0.1)", border: "1px solid hsl(24 95% 53% / 0.25)" }}>
                        <p className="text-muted-foreground">Satış</p>
                        <p className="font-mono font-bold text-orange-500">${estSale.toFixed(2)}</p>
                      </div>
                    </div>
                    <div
                      className="flex items-center justify-between text-[10px] rounded-lg px-2 py-1"
                      style={{ background: `${marginAccent}14`, border: `1px solid ${marginAccent}33` }}
                    >
                      <span className="text-muted-foreground">Kâr Marjı</span>
                      <span className="font-mono font-bold" style={{ color: marginAccent }}>%{margin}</span>
                    </div>

                    {/* Trendyol Butonu */}
                    <a
                      href={`https://www.trendyol.com/sr?q=${encodeURIComponent(rawName)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full h-7 rounded-md bg-[#FF6000]/15 text-[#FF6000] text-[10px] font-semibold hover:bg-[#FF6000]/30 transition-colors border border-[#FF6000]/20"
                    >
                      <ShoppingCart className="h-3 w-3" /> Trendyol'da Gör
                    </a>

                    <div className="grid grid-cols-2 gap-1.5">
                      <a
                        href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=${encodeURIComponent(rawName)}&search_type=keyword_unordered`}
                        target="_blank"
                        rel="noreferrer"
                        className="h-6 rounded-md text-[9px] font-medium flex items-center justify-center gap-1"
                        style={{ background: "hsl(217 91% 60% / 0.1)", color: "hsl(217 91% 65%)", border: "1px solid hsl(217 91% 60% / 0.25)" }}
                      >
                        📘 Reklamda Ara
                      </a>
                      <a
                        href={`https://www.tiktok.com/search?q=${encodeURIComponent(rawName)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="h-6 rounded-md text-[9px] font-medium flex items-center justify-center gap-1"
                        style={{ background: "hsl(0 0% 100% / 0.06)", color: "hsl(215 20% 70%)", border: "1px solid hsl(217 32% 30% / 0.4)" }}
                      >
                        🎵 TikTok'ta Ara
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => navigate(`/dashboard/analyzer?name=${encodeURIComponent(rawName)}&cost=${cost}&price=${estSale.toFixed(2)}`)}
                        className="h-7 rounded-md bg-primary/15 text-primary text-[10px] font-semibold hover:bg-primary/25 transition-colors flex items-center justify-center gap-1"
                      >
                        <BarChart3 className="h-3 w-3" /> Analiz Et
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/product-page-generator?name=${encodeURIComponent(rawName)}&image=${encodeURIComponent(p.productImage?.split(",")[0] || "")}&price=${estSale.toFixed(2)}`)}
                        className="h-7 rounded-md bg-orange-500/15 text-orange-500 text-[10px] font-semibold hover:bg-orange-500/25 transition-colors flex items-center justify-center gap-1"
                      >
                        <FileText className="h-3 w-3" /> Sayfa Oluştur
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !error && results.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          CJdropshipping kataloğundan ürün arayın.
        </p>
      )}
    </div>
  );
}
