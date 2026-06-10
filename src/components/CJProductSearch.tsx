import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Loader2, Radio, BarChart3, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CJ_EMAIL = "bamir.global@gmail.com";
const CJ_API_KEY = "26689fbeeb5045f89ec8764c32aaada0";

interface CJProduct {
  pid: string;
  productName: string;
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
  const navigate = useNavigate();

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const token = await getAccessToken();
      const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=12&productNameEn=${encodeURIComponent(query)}`;
      const res = await fetch(url, {
        headers: { "CJ-Access-Token": token },
      });
      const data = await res.json();
      if (!data?.data?.list) {
        throw new Error(`Ürün Arama Hatası: ${data?.message} (code: ${data?.code})`);
      }
      setResults(data.data.list);
    } catch (e: any) {
      setError(e?.message || "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-glow rounded-xl p-5 border border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-orange-500/10">
            <Package className="h-4 w-4 text-orange-500" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">CJ Dropshipping Ürün Arama</h3>
        </div>
        <motion.span
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-500/15 text-orange-500 border border-orange-500/30"
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
          className="h-10 px-5 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-orange-500/20"
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
              return (
                <motion.div
                  key={p.pid || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}
                  className="group rounded-lg bg-accent/30 border border-border/50 overflow-hidden hover:border-orange-500/50 transition-colors flex flex-col"
                >
                  
                    href={p.productUrl || `https://cjdropshipping.com/product/-p-${p.pid}.html`}
                    target="_blank"
                    rel="noreferrer"
                    className="block aspect-square bg-background overflow-hidden"
                  >
                    {p.productImage ? (
                      <img
                        src={p.productImage.split(",")[0]}
                        alt={p.productName}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                  </a>
                  <div className="p-3 space-y-2 flex-1 flex flex-col">
                    <p className="text-xs font-medium text-foreground line-clamp-2 min-h-[2rem]">{p.productName}</p>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="rounded bg-background/60 px-2 py-1">
                        <p className="text-muted-foreground">Maliyet</p>
                        <p className="font-mono font-bold text-foreground">${cost.toFixed(2)}</p>
                      </div>
                      <div className="rounded bg-orange-500/10 px-2 py-1">
                        <p className="text-muted-foreground">Satış</p>
                        <p className="font-mono font-bold text-orange-500">${estSale.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Kâr Marjı</span>
                      <span className="font-mono font-bold text-winning">%{margin}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mt-auto pt-1">
                      <button
                        onClick={() => navigate(`/dashboard/analyzer?name=${encodeURIComponent(p.productName)}&cost=${cost}&price=${estSale.toFixed(2)}`)}
                        className="h-7 rounded-md bg-primary/15 text-primary text-[10px] font-semibold hover:bg-primary/25 transition-colors flex items-center justify-center gap-1"
                      >
                        <BarChart3 className="h-3 w-3" /> Analiz Et
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/product-page-generator?name=${encodeURIComponent(p.productName)}&image=${encodeURIComponent(p.productImage?.split(",")[0] || "")}&price=${estSale.toFixed(2)}`)}
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
