import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, BarChart3, ArrowRight, Package, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { supabase } from "@/integrations/supabase/client";

// "Bugünün Kazananı" radarı — her gün değişen tek bir kazanan ürün vitrini.
// Amaç: kullanıcıyı her gün geri getirmek (retention). Gerçek CJ verisi, uydurma yok.

interface Winner {
  pid?: string;
  name: string;
  image: string;
  cost: number;
  sale: number;
  margin: number;
  score: number;
}

const TERMS = ["gadget", "kitchen", "pet", "beauty", "car accessory", "home decor", "fitness", "phone accessory"];

function markup(cost: number): number {
  if (cost < 10) return 3;
  if (cost < 25) return 2.6;
  return 2.2;
}

// Basit, dürüst KHELL Skoru: marj ağırlıklı + talep sinyali (recentOrders).
function khellScore(margin: number, orders: number): number {
  const m = Math.min(margin, 80) / 80; // 0..1
  const d = Math.min(orders, 500) / 500; // 0..1
  return Math.round((m * 0.7 + d * 0.3) * 100);
}

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

export default function DailyWinner() {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const isTr = locale === "tr";
  const [winner, setWinner] = useState<Winner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Günün terimini seç (gün bazlı sabit) — her gün farklı kategori taranır
        const term = TERMS[dayOfYear() % TERMS.length];
        const { data, error } = await supabase.functions.invoke("cj-proxy", {
          body: {
            path: "/api2.0/v1/product/list",
            query: { pageNum: "1", pageSize: "20", sortField: "recentOrders", sortType: "DESC", productNameEn: term },
          },
        });
        if (error || !data?.data?.list) throw new Error("no data");
        const list: any[] = data.data.list;
        const scored: Winner[] = list
          .map((p) => {
            const cost = parseFloat(p.sellPrice || "0") || 0;
            const sale = cost * markup(cost);
            const margin = cost > 0 ? Math.round(((sale - cost) / sale) * 100) : 0;
            const orders = parseInt(p.listedNum || p.recentOrders || "0", 10) || 0;
            return {
              pid: p.pid,
              name: p.productNameEn || p.productName || term,
              image: (p.productImage || "").split(",")[0] || "",
              cost,
              sale,
              margin,
              score: khellScore(margin, orders),
            };
          })
          .filter((p) => p.cost > 0 && p.image)
          .sort((a, b) => b.score - a.score);
        if (!scored.length) throw new Error("empty");
        // Günün kazananı: en iyi 8 içinden gün bazlı seçim (her gün değişsin)
        const top = scored.slice(0, 8);
        const pick = top[dayOfYear() % top.length];
        if (alive) setWinner(pick);
      } catch {
        if (alive) setWinner(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const today = new Date().toLocaleDateString(isTr ? "tr-TR" : locale === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "long" });

  if (loading) {
    return (
      <div className="rounded-2xl p-6 animate-pulse" style={{ background: "linear-gradient(135deg, hsl(258 90% 20% / 0.4), hsl(222 47% 8%))", border: "1px solid hsl(258 90% 60% / 0.2)" }}>
        <div className="h-4 w-40 bg-white/10 rounded mb-4" />
        <div className="flex gap-4"><div className="h-24 w-24 bg-white/10 rounded-xl" /><div className="flex-1 space-y-2"><div className="h-4 bg-white/10 rounded w-2/3" /><div className="h-4 bg-white/10 rounded w-1/3" /></div></div>
      </div>
    );
  }

  if (!winner) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 sm:p-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(258 90% 22% / 0.55), hsl(222 47% 7%))", border: "1px solid hsl(258 90% 62% / 0.3)", boxShadow: "0 20px 50px hsl(258 90% 40% / 0.15)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full" style={{ color: "#f0abfc", background: "hsl(292 90% 60% / 0.15)", border: "1px solid hsl(292 90% 60% / 0.3)" }}>
          <Flame className="h-3.5 w-3.5" /> {isTr ? "BUGÜNÜN KAZANANI" : locale === "fr" ? "GAGNANT DU JOUR" : "TODAY'S WINNER"}
        </div>
        <span className="text-[11px]" style={{ color: "#a78bfa" }}>{today}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="h-28 w-28 shrink-0 rounded-xl overflow-hidden bg-black/30 mx-auto sm:mx-0">
          {winner.image ? <img src={winner.image} alt="" loading="lazy" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="h-8 w-8 text-white/40" /></div>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white line-clamp-2 mb-2">{winner.name}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg" style={{ color: "#34d399", background: "hsl(160 84% 40% / 0.15)" }}>KHELL {winner.score}/100</span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg" style={{ color: "#c4b5fd", background: "hsl(258 90% 60% / 0.15)" }}>{isTr ? "Marj" : "Margin"} %{winner.margin}</span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg" style={{ color: "#94a3b8", background: "hsl(217 32% 40% / 0.2)" }}>${winner.cost.toFixed(2)} → ${winner.sale.toFixed(2)}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/dashboard/analyzer?productName=${encodeURIComponent(winner.name)}&selling_price=${winner.sale.toFixed(2)}&product_cost=${winner.cost.toFixed(2)}`)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg text-white"
              style={{ background: "linear-gradient(135deg, hsl(258 90% 58%), hsl(262 83% 50%))" }}>
              <BarChart3 className="h-3.5 w-3.5" /> {isTr ? "Bu Ürünü Analiz Et" : locale === "fr" ? "Analyser ce produit" : "Analyze This Product"}
            </button>
            <button onClick={() => navigate("/dashboard/winning")} className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg" style={{ color: "#e8eef7", border: "1px solid hsl(217 32% 40% / 0.4)" }}>
              {isTr ? "Tüm kazananlar" : locale === "fr" ? "Tous les gagnants" : "All winners"} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] mt-4 flex items-center gap-1.5" style={{ color: "#a78bfa" }}>
        <Sparkles className="h-3 w-3" /> {isTr ? "Her gün yeni bir kazanan ürün — yarın tekrar bak!" : locale === "fr" ? "Un nouveau gagnant chaque jour — revenez demain !" : "A new winner every day — come back tomorrow!"}
      </p>
    </motion.div>
  );
}
