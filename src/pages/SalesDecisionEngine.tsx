import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Copy, Target, TrendingUp, ShieldAlert, Megaphone, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { runDecisionEngine, type DecisionInput, type DecisionOutput } from "@/lib/sales-decision-engine";

const categories = [
  "Furniture", "Home Decor", "Luxury Decor", "Fashion", "Jewelry", "Watches",
  "Gadget", "Tech", "Electronics", "Beauty", "Fitness", "Phone Accessories",
  "Bags", "Shoes", "Lighting", "Decoration", "Health", "Security", "Other",
];

const countries = [
  "Turkey", "Saudi Arabia", "UAE", "Qatar", "Kuwait", "USA", "Germany", "France", "UK", "Other",
];

export default function SalesDecisionEngine() {
  const [form, setForm] = useState<DecisionInput>({
    product_name: "",
    product_price: 0,
    cost_price: 0,
    target_country: "Turkey",
    product_category: "Furniture",
    product_link: "",
    description: "",
  });
  const [result, setResult] = useState<DecisionOutput | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    if (!form.product_name || form.product_price <= 0 || form.cost_price <= 0) {
      toast.error("Ürün adı, satış fiyatı ve maliyet gerekli.");
      return;
    }
    setResult(runDecisionEngine(form));
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    toast.success("JSON kopyalandı!");
    setTimeout(() => setCopied(false), 2000);
  };

  const decisionColor = (d: string) =>
    d === "WINNER" ? "text-emerald-400" : "text-red-400";
  const actionColor = (a: string) =>
    a === "LAUNCH" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
    a === "TEST" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
    "bg-red-500/20 text-red-400 border-red-500/30";

  const ScoreBar = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground"><Icon className="h-3.5 w-3.5" />{label}</span>
        <span className="font-bold text-foreground">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: value > 70 ? "hsl(142 71% 45%)" : value > 45 ? "hsl(38 92% 50%)" : "hsl(0 84% 60%)" }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Sales Decision Engine</h1>
          <p className="text-xs text-muted-foreground">Ürün satacak mı yoksa batacak mı? — Anında karar.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* INPUT */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Ürün Bilgileri</h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Ürün Adı *</label>
              <Input value={form.product_name} onChange={e => setForm(p => ({ ...p, product_name: e.target.value }))} placeholder="Örn: Lüks Kadife Koltuk" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Satış Fiyatı ($) *</label>
                <Input type="number" value={form.product_price || ""} onChange={e => setForm(p => ({ ...p, product_price: +e.target.value }))} placeholder="299" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Maliyet ($) *</label>
                <Input type="number" value={form.cost_price || ""} onChange={e => setForm(p => ({ ...p, cost_price: +e.target.value }))} placeholder="85" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Hedef Ülke</label>
                <select
                  value={form.target_country}
                  onChange={e => setForm(p => ({ ...p, target_country: e.target.value }))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Kategori</label>
                <select
                  value={form.product_category}
                  onChange={e => setForm(p => ({ ...p, product_category: e.target.value }))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Ürün Linki (opsiyonel)</label>
              <Input value={form.product_link} onChange={e => setForm(p => ({ ...p, product_link: e.target.value }))} placeholder="https://..." />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Açıklama (opsiyonel)</label>
              <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Kısa ürün açıklaması" />
            </div>
          </div>

          <Button onClick={handleRun} className="w-full gap-2">
            <Zap className="h-4 w-4" /> Analiz Et — Karar Ver
          </Button>
        </div>

        {/* OUTPUT */}
        <div className="space-y-4">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Decision badge */}
              <div className="rounded-xl border border-border bg-card p-5 text-center space-y-3">
                <p className={`text-4xl font-black tracking-tight ${decisionColor(result.decision)}`}>
                  {result.decision}
                </p>
                <div className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-bold ${actionColor(result.action)}`}>
                  {result.action}
                </div>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">{result.quick_reason}</p>
              </div>

              {/* Scores */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <ScoreBar label="Confidence" value={result.confidence_score} icon={Zap} />
                <ScoreBar label="Market Fit" value={result.market_fit} icon={Target} />
                <ScoreBar label="Ad Potential" value={result.ad_potential} icon={Megaphone} />
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><TrendingUp className="h-3.5 w-3.5" />Marj</span>
                  <span className="font-bold text-foreground">%{result.estimated_margin_percent}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><ShieldAlert className="h-3.5 w-3.5" />Rekabet</span>
                  <span className={`font-bold ${result.competition_level === "LOW" ? "text-emerald-400" : result.competition_level === "MEDIUM" ? "text-amber-400" : "text-red-400"}`}>
                    {result.competition_level}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Hedef Kitle:</span>
                  <p className="text-foreground mt-0.5">{result.target_audience}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duygusal Tetikleyiciler:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {result.emotional_trigger.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Önerilen Platformlar:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {result.recommended_platform.map(p => (
                      <span key={p} className="px-2 py-0.5 rounded-full bg-accent text-foreground text-[10px] font-medium">{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Fiyatlandırma Stratejisi:</span>
                  <p className="text-foreground mt-0.5">{result.pricing_strategy}</p>
                </div>
              </div>

              {/* JSON Copy */}
              <Button variant="outline" onClick={handleCopy} className="w-full gap-2 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Kopyalandı!" : "JSON Çıktısını Kopyala"}
              </Button>
            </motion.div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
              <Zap className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Ürün bilgilerini girin ve analiz edin.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Sonuç burada görünecek.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
