import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Loader2, ExternalLink } from "lucide-react";

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
  if (!data?.data?.accessToken) throw new Error(data?.message || "Token alınamadı");
  cachedToken = { token: data.data.accessToken, exp: Date.now() + 1000 * 60 * 60 * 12 };
  return cachedToken.token;
}

export default function CJProductSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CJProduct[]>([]);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const token = await getAccessToken();
      const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=12&productNameEn=${encodeURIComponent(query)}`;
      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "CJ-Access-Token": token,
        },
      });
      const data = await res.json();
      if (!data?.data?.list) throw new Error(data?.message || "Sonuç bulunamadı");
      setResults(data.data.list);
    } catch (e: any) {
      setError(e?.message || "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-glow rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">CJdropshipping Ürün Arama</h3>
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
          className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
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
            {results.map((p, i) => (
              <motion.a
                key={p.pid || i}
                href={p.productUrl || `https://cjdropshipping.com/product/-p-${p.pid}.html`}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}
                className="group rounded-lg bg-accent/30 border border-border/50 overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="aspect-square bg-background overflow-hidden">
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
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs font-medium text-foreground line-clamp-2 min-h-[2rem]">{p.productName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">${p.sellPrice || "—"}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                  </div>
                </div>
              </motion.a>
            ))}
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