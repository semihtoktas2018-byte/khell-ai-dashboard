import { motion } from "framer-motion";
import { Flame, Wallet, Rocket, Lightbulb, MessageCircle, AlertTriangle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

type Module = "fleet" | "product" | "ad";

interface Props {
  module: Module;
  /** A primary signal 0-100 used to bucket potential. */
  score: number;
  /** Estimated daily profit/earnings in current currency (raw number). */
  dailyEstimate?: number;
}

const WHATSAPP = "https://wa.me/905446452430";

function fmt(n: number, symbol: string) {
  const v = Math.max(0, Math.round(n));
  return `${symbol}${v.toLocaleString("tr-TR")}`;
}

function bucket(score: number) {
  if (score >= 70) return "high" as const;
  if (score >= 45) return "mid" as const;
  return "low" as const;
}

export default function MoneyLayer({ module, score, dailyEstimate = 0 }: Props) {
  const { locale, currencySymbol } = useLocale();
  const isTr = locale === "tr";
  const b = bucket(score);
  const symbol = currencySymbol || (isTr ? "₺" : "$");

  // Status
  const statusText = b === "high"
    ? (isTr ? "KAZANÇ POTANSİYELİ YÜKSEK" : "HIGH EARNING POTENTIAL")
    : b === "mid"
      ? (isTr ? "ORTA SEVİYE" : "MEDIUM POTENTIAL")
      : (isTr ? "ZAYIF" : "WEAK");
  const statusColor = b === "high"
    ? "from-emerald-500/20 to-emerald-500/5 border-emerald-500/40 text-emerald-400"
    : b === "mid"
      ? "from-amber-500/20 to-amber-500/5 border-amber-500/40 text-amber-400"
      : "from-red-500/20 to-red-500/5 border-red-500/40 text-red-400";

  // Earnings — fall back to a sane projection from score if no input
  // Girdi yoksa uydurma kazanç gösterme (dürüstlük kuralı) — gerçek veri gelene kadar 0.
  const daily = dailyEstimate > 0 ? dailyEstimate : 0;
  const weekly = daily * 7;
  const monthly = daily * 30;

  // Action plans per module
  const actions: Record<Module, [string, string, string]> = {
    fleet: isTr
      ? [
          "Yakıt giderini %10 düşür (rota & sürüş analizi)",
          "Boş dönüş seferlerini paylaşımlı yük ile doldur",
          "Aynı şoförle 2. araç ekleyip filoyu büyüt",
        ]
      : [
          "Cut fuel cost by 10% (route & driving analysis)",
          "Fill empty return trips with shared loads",
          "Add a 2nd vehicle with the same driver to scale",
        ],
    product: isTr
      ? [
          "İlk 50 birim stoku tedarikçiden hızlı al",
          "TikTok + Instagram Reels ile organik test başlat",
          "İlk 10 satıştan sonra Meta Ads ile ölçekle",
        ]
      : [
          "Order first 50 units from supplier fast",
          "Launch organic test on TikTok + Instagram Reels",
          "After first 10 sales, scale with Meta Ads",
        ],
    ad: isTr
      ? [
          "Hook'u 3 farklı versiyonla test et",
          "Günlük 150₺ bütçeyle 3 kreatif yayına al",
          "En iyi performansı %300 bütçeyle ölçekle",
        ]
      : [
          "Test the hook in 3 different versions",
          "Run 3 creatives at $5/day each",
          "Scale the winner with +300% budget",
        ],
  };

  // Module-specific block
  const specialTitle = module === "fleet"
    ? (isTr ? "💼 Filo Optimizasyon Önerisi" : "💼 Fleet Optimization Tips")
    : module === "product"
      ? (isTr ? "🛒 Satış Stratejisi" : "🛒 Sales Strategy")
      : (isTr ? "📈 Reklamı Nasıl Paraya Çevirirsin" : "📈 Turn the Ad Into Cash");

  const specialItems: string[] = module === "fleet"
    ? (isTr
        ? ["Yakıt en büyük gider — şoföre eko-sürüş eğitimi ver", "Bakım maliyetini düşürmek için kilometre takibi yap", "Araç başı kârı %15 artırmak için fiyat yenile"]
        : ["Fuel is the top cost — train driver on eco-driving", "Track mileage to lower maintenance cost", "Refresh pricing to lift profit per vehicle by 15%"])
    : module === "product"
      ? (isTr
          ? [`Satış kanalı: ${b === "high" ? "TikTok Shop + Instagram" : "Instagram Reels"}`, `Önerilen fiyat aralığı: ${symbol}${Math.round(daily/3)}–${symbol}${Math.round(daily/2)}`, `İlk satış hedefi: ${b === "high" ? 30 : b === "mid" ? 15 : 5} adet / ilk 7 gün`]
          : [`Sales channel: ${b === "high" ? "TikTok Shop + Instagram" : "Instagram Reels"}`, `Suggested price range: ${symbol}${Math.round(daily/3)}–${symbol}${Math.round(daily/2)}`, `First sales target: ${b === "high" ? 30 : b === "mid" ? 15 : 5} units / first 7 days`])
      : (isTr
          ? ["Başla: Meta Ads (Instagram Reels + Facebook Feed)", `Günlük test bütçesi: ${symbol}${b === "high" ? 250 : b === "mid" ? 150 : 75}`, `İlk hedef: ilk 72 saatte ${b === "high" ? 5 : 3} satış`]
          : ["Start on: Meta Ads (Instagram Reels + Facebook Feed)", `Daily test budget: $${b === "high" ? 25 : b === "mid" ? 15 : 7}`, `First target: ${b === "high" ? 5 : 3} sales in first 72h`]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3 mt-4 no-print"
    >
      {/* Status */}
      <div className={`rounded-xl border bg-gradient-to-r ${statusColor} px-5 py-4 flex items-center gap-3`}>
        <Flame className="h-5 w-5 shrink-0" />
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest opacity-70">
            {isTr ? "Sonuç Durumu" : "Result Status"}
          </p>
          <p className="text-base font-black tracking-tight">{statusText}</p>
        </div>
      </div>

      {/* Urgency strip */}
      <div className="flex items-center gap-2 text-[11px] text-amber-400/90 px-1">
        <AlertTriangle className="h-3.5 w-3.5" />
        <span>{isTr ? "Bu analiz verisi kısa süreli fırsat olabilir" : "This insight may be a short-lived opportunity"}</span>
      </div>

      {/* Earnings */}
      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-bold">{isTr ? "💰 Tahmini Kazanç" : "💰 Estimated Earnings"}</h4>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { l: isTr ? "Günlük" : "Daily", v: daily },
            { l: isTr ? "Haftalık" : "Weekly", v: weekly },
            { l: isTr ? "Aylık" : "Monthly", v: monthly },
          ].map((x) => (
            <div key={x.l} className="rounded-lg border border-border/40 bg-background/40 p-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{x.l}</p>
              <p className="text-sm font-black font-mono text-foreground mt-0.5">{fmt(x.v, symbol)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action plan */}
      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-bold">{isTr ? "🚀 Ne Yapmalısın?" : "🚀 What To Do Now"}</h4>
        </div>
        <ol className="space-y-2">
          {actions[module].map((step, i) => (
            <li key={i} className="flex gap-2.5 text-xs text-foreground">
              <span className="shrink-0 h-5 w-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Module-specific */}
      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          <h4 className="text-sm font-bold">{specialTitle}</h4>
        </div>
        <ul className="space-y-1.5">
          {specialItems.map((it, i) => (
            <li key={i} className="text-xs text-muted-foreground flex gap-2">
              <span className="text-primary">•</span>
              <span className="text-foreground/90">{it}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* WhatsApp CTA */}
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noreferrer"
        className="block rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 p-4 hover:from-emerald-500/25 hover:to-emerald-500/10 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <MessageCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">
              {isTr ? "🚀 Sistemi Senin İçin Kurayım" : "🚀 Let Me Build This System For You"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {isTr ? "Reklam kurulumu • Satış metni • Funnel sistemi" : "Ad setup • Sales copy • Funnel system"}
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-400 shrink-0">WhatsApp →</span>
        </div>
      </a>
    </motion.div>
  );
}
