import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Wallet, Plus, Trash2, TrendingUp, DollarSign, Package, X, Download, Upload } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useOrderLog } from "@/contexts/OrderLogContext";
import { useLocale } from "@/contexts/LocaleContext";
import SEO from "@/components/SEO";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const tooltipStyle = { background: "hsl(222 47% 7%)", border: "1px solid hsl(217 32% 17%)", borderRadius: 8, color: "hsl(210 40% 98%)" };

const emptyForm = {
  productName: "",
  quantity: "1",
  unitSellingPrice: "",
  unitCost: "",
  otherCosts: "0",
};

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") {
        result.push(cur);
        cur = "";
      } else cur += ch;
    }
  }
  result.push(cur);
  return result;
}

export default function OrderLog() {
  const { orders, addOrder, deleteOrder, totals } = useOrderLog();
  const { currency, locale } = useLocale();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chartData = useMemo(() => {
    if (orders.length === 0) return [];
    const sorted = [...orders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let cumulative = 0;
    return sorted.map((o) => {
      const profit = o.unitSellingPrice * o.quantity - (o.unitCost * o.quantity + o.otherCosts);
      cumulative += profit;
      return {
        date: new Date(o.date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", { day: "2-digit", month: "short" }),
        profit: Math.round(cumulative * 100) / 100,
      };
    });
  }, [orders, locale]);

  const productProfitability = useMemo(() => {
    const map = new Map<string, { revenue: number; cost: number; profit: number; unitsSold: number }>();
    orders.forEach((o) => {
      const revenue = o.unitSellingPrice * o.quantity;
      const cost = o.unitCost * o.quantity + o.otherCosts;
      const profit = revenue - cost;
      const existing = map.get(o.productName) || { revenue: 0, cost: 0, profit: 0, unitsSold: 0 };
      map.set(o.productName, {
        revenue: existing.revenue + revenue,
        cost: existing.cost + cost,
        profit: existing.profit + profit,
        unitsSold: existing.unitsSold + o.quantity,
      });
    });
    return Array.from(map.entries())
      .map(([productName, v]) => ({ productName, ...v }))
      .sort((a, b) => b.profit - a.profit);
  }, [orders]);

  const handleSubmit = () => {
    const quantity = parseInt(form.quantity) || 0;
    const unitSellingPrice = parseFloat(form.unitSellingPrice) || 0;
    const unitCost = parseFloat(form.unitCost) || 0;
    const otherCosts = parseFloat(form.otherCosts) || 0;
    if (!form.productName.trim() || quantity <= 0 || unitSellingPrice <= 0) return;
    addOrder({ productName: form.productName.trim(), quantity, unitSellingPrice, unitCost, otherCosts });
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleExport = () => {
    const header = ["Urun Adi", "Adet", "Birim Satis Fiyati", "Birim Maliyet", "Diger Maliyet", "Tarih"];
    const rows = orders.map((o) =>
      [
        `"${o.productName.replace(/"/g, '""')}"`,
        o.quantity,
        o.unitSellingPrice,
        o.unitCost,
        o.otherCosts,
        o.date,
      ].join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `khell-satis-defteri-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "").replace(/^\uFEFF/, "");
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      lines.slice(1).forEach((line) => {
        const cols = parseCsvLine(line);
        const [productName, quantity, unitSellingPrice, unitCost, otherCosts, date] = cols;
        if (!productName) return;
        addOrder({
          productName,
          quantity: parseInt(quantity) || 0,
          unitSellingPrice: parseFloat(unitSellingPrice) || 0,
          unitCost: parseFloat(unitCost) || 0,
          otherCosts: parseFloat(otherCosts) || 0,
          date: date || undefined,
        });
      });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <SEO title="Satış Defteri | KHELL AI" description="Gerçek siparişlerini kaydet, gerçek kâr-zarar durumunu takip et." />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{ background: "linear-gradient(145deg, hsl(142 71% 45% / 0.18), hsl(142 71% 45% / 0.06))", border: "1px solid hsl(142 71% 45% / 0.3)" }}
          >
            <Wallet className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Satış Defteri</h1>
            <p className="text-xs text-muted-foreground">Tahmin değil — gerçekten sattığın ürünleri kaydet, gerçek kârını gör.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImportFile} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Upload className="h-3.5 w-3.5" /> Yedekten Geri Yükle
          </button>
          <button
            onClick={handleExport}
            disabled={orders.length === 0}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" /> Dışa Aktar (CSV)
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: "hsl(142 71% 45%)" }}
          >
            <Plus className="h-4 w-4" /> Sipariş Ekle
          </button>
        </div>
      </div>

      <div
        className="rounded-lg px-4 py-2.5 text-xs flex items-center gap-2"
        style={{ background: "hsl(38 92% 50% / 0.1)", border: "1px solid hsl(38 92% 50% / 0.25)", color: "hsl(38 92% 55%)" }}
      >
        💡 Bu kayıtlar sadece bu tarayıcıda saklanıyor. Telefon/tarayıcı değiştirirsen önce <strong>"Dışa Aktar"</strong> ile yedek al, yeni cihazda <strong>"Yedekten Geri Yükle"</strong> ile devam et.
      </div>

      {/* Özet kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Toplam Gelir", value: currency(totals.revenue), icon: DollarSign, color: "hsl(217 91% 60%)" },
          { label: "Toplam Maliyet", value: currency(totals.cost), icon: Package, color: "hsl(38 92% 55%)" },
          { label: "Net Kâr", value: currency(totals.profit), icon: TrendingUp, color: totals.profit >= 0 ? "hsl(142 71% 50%)" : "hsl(0 84% 62%)" },
          { label: "Satılan Adet", value: String(totals.unitsSold), icon: Package, color: "hsl(199 89% 60%)" },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <p className="text-xl font-bold font-mono tabular-nums" style={{ color: s.color }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Ürün Kârlılığı — Ozzmoo tarzı ürün bazlı net kâr dökümü */}
      {productProfitability.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" /> Ürün Kârlılığı
          </h3>
          <div className="space-y-2">
            {productProfitability.map((p) => (
              <div key={p.productName} className="flex items-center justify-between rounded-lg bg-accent/30 px-3 py-2.5 gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{p.productName}</p>
                  <p className="text-[11px] text-muted-foreground">{p.unitsSold} adet satıldı</p>
                </div>
                <span
                  className="text-sm font-bold font-mono shrink-0 px-2.5 py-1 rounded-md"
                  style={{
                    color: p.profit >= 0 ? "hsl(142 71% 50%)" : "hsl(0 84% 62%)",
                    background: p.profit >= 0 ? "hsl(142 71% 45% / 0.12)" : "hsl(0 84% 60% / 0.12)",
                  }}
                >
                  {p.profit >= 0 ? "+" : ""}{currency(p.profit)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Kümülatif kâr grafiği */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Kümülatif Net Kâr</h3>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[180px] gap-2 text-muted-foreground">
            <TrendingUp className="h-8 w-8 opacity-20" />
            <p className="text-sm">Henüz sipariş eklenmedi.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="orderProfitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142 71% 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(142 71% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="profit" stroke="hsl(142 71% 50%)" strokeWidth={2.5} fill="url(#orderProfitGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Sipariş listesi */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Sipariş Geçmişi ({orders.length})</h3>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Henüz sipariş kaydı yok. "Sipariş Ekle" ile başla.</p>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {orders.map((o) => {
              const revenue = o.unitSellingPrice * o.quantity;
              const cost = o.unitCost * o.quantity + o.otherCosts;
              const profit = revenue - cost;
              return (
                <div key={o.id} className="flex items-center justify-between rounded-lg bg-accent/30 p-3 gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{o.productName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {o.quantity} adet · {new Date(o.date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold font-mono" style={{ color: profit >= 0 ? "hsl(142 71% 50%)" : "hsl(0 84% 62%)" }}>
                      {currency(profit)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{currency(revenue)} gelir</p>
                  </div>
                  <button onClick={() => deleteOrder(o.id)} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Sipariş ekleme modalı */}
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 backdrop-blur-md px-4">
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl p-6 relative"
            style={{ background: "linear-gradient(160deg, hsl(222 47% 9% / 0.97), hsl(222 47% 5% / 0.98))", backdropFilter: "blur(20px)", border: "1px solid hsl(142 71% 45% / 0.25)" }}
          >
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-bold text-foreground mb-4">Yeni Sipariş Ekle</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Ürün Adı</label>
                <input className="input-dark w-full" value={form.productName} onChange={(e) => setForm((p) => ({ ...p, productName: e.target.value }))} placeholder="Örn: Manyetik Telefon Tutucu" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Adet</label>
                  <input type="number" className="input-dark w-full" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Birim Satış Fiyatı ($)</label>
                  <input type="number" className="input-dark w-full" value={form.unitSellingPrice} onChange={(e) => setForm((p) => ({ ...p, unitSellingPrice: e.target.value }))} placeholder="29.99" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Birim Maliyet ($)</label>
                  <input type="number" className="input-dark w-full" value={form.unitCost} onChange={(e) => setForm((p) => ({ ...p, unitCost: e.target.value }))} placeholder="8.50" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Diğer Maliyet (kargo+reklam, $)</label>
                  <input type="number" className="input-dark w-full" value={form.otherCosts} onChange={(e) => setForm((p) => ({ ...p, otherCosts: e.target.value }))} placeholder="0" />
                </div>
              </div>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full mt-5">Kaydet</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
