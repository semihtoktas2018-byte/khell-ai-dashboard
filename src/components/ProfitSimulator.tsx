import { useState, useEffect } from "react";
import { TrendingUp, Target, ChevronDown, ChevronUp } from "lucide-react";

interface ProfitSimulatorProps {
  expandTrigger?: number;
  profitPerUnit: number;
  revenuePerUnit: number;
  costPerUnit: number;
  currency: (val: number) => string;
  initialOrders?: number;
  isTr?: boolean;
}

const MARKS = [10, 25, 50, 100, 250, 500, 1000];

export default function ProfitSimulator({ profitPerUnit, revenuePerUnit, costPerUnit, currency, initialOrders = 50, expandTrigger, isTr = true }: ProfitSimulatorProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (expandTrigger && expandTrigger > 0) setOpen(true);
  }, [expandTrigger]);
  const hasData = revenuePerUnit > 0;

  const monthlyProfit = profitPerUnit * orders;
  const monthlyRevenue = revenuePerUnit * orders;
  const monthlyCost = costPerUnit * orders;
  const dailyOrdersNeeded = Math.max(1, Math.ceil(orders / 30));
  const goal3Months = monthlyProfit * 3;
  const goal6Months = monthlyProfit * 6;
  const goal12Months = monthlyProfit * 12;

  return (
    <div className="group rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent text-[11px] overflow-hidden transition-all duration-300 hover:border-emerald-400/60 hover:shadow-[0_0_24px_rgba(16,185,129,0.35)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-emerald-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-500/15 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.6)] transition-shadow">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
          </div>
          <span className="font-bold text-emerald-400 tracking-wide">{isTr ? "KÂR SİMÜLATÖRÜ" : "PROFIT SIMULATOR"}</span>
        </div>
        <div className="flex items-center gap-2">
          {!hasData ? (
            <span className="text-muted-foreground italic">{isTr ? "Maliyet & satış fiyatı girin →" : "Enter cost & sale price →"}</span>
          ) : (
            <span className="text-muted-foreground">
              {orders} {isTr ? "adet/ay" : "units/mo"} → <span className={`font-bold ${monthlyProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>{currency(monthlyProfit)}</span>
            </span>
          )}
          {open ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-3 border-t border-emerald-500/10 pt-3">
          {!hasData ? (
            <p className="text-muted-foreground text-center py-2">
              {isTr
                ? "Maliyet ve satış fiyatını girince slider ile \"50/100/500 adet satarsam ne kazanırım?\" simüle edebilirsin 📈"
                : "Enter cost and sale price, then use the slider to simulate \"what if I sell 50/100/500 units?\" 📈"}
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{isTr ? "Aylık Sipariş Sayısı" : "Monthly Order Count"}</span>
                  <span className="font-mono font-bold text-emerald-400 text-base">{orders.toLocaleString(isTr ? "tr-TR" : "en-US")} {isTr ? "adet" : "units"}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={1000}
                  step={1}
                  value={orders}
                  onChange={(e) => setOrders(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full bg-accent appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-muted-foreground">
                  {MARKS.map((m) => (
                    <button key={m} onClick={() => setOrders(m)} className={`hover:text-emerald-400 transition-colors ${orders === m ? "text-emerald-400 font-bold" : ""}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-background/60 p-2.5 text-center">
                  <p className="text-muted-foreground mb-1">{isTr ? "Aylık Ciro" : "Monthly Revenue"}</p>
                  <p className="text-sm font-bold font-mono text-foreground">{currency(monthlyRevenue)}</p>
                </div>
                <div className="rounded-lg bg-background/60 p-2.5 text-center">
                  <p className="text-muted-foreground mb-1">{isTr ? "Toplam Maliyet" : "Total Cost"}</p>
                  <p className="text-sm font-bold font-mono text-red-400">-{currency(monthlyCost)}</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-2.5 text-center border border-emerald-500/20">
                  <p className="text-muted-foreground mb-1">{isTr ? "Net Kâr" : "Net Profit"}</p>
                  <p className={`text-sm font-bold font-mono ${monthlyProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>{currency(monthlyProfit)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-background/40 px-2.5 py-2">
                <span className="text-muted-foreground flex items-center gap-1.5"><Target className="h-3 w-3" /> {isTr ? "Günlük hedef" : "Daily target"}</span>
                <span className="font-mono font-bold text-foreground">~{dailyOrdersNeeded} {isTr ? "sipariş/gün" : "orders/day"}</span>
              </div>

              {monthlyProfit > 0 ? (
                <div className="space-y-1.5 pt-1">
                  <p className="uppercase tracking-wider text-muted-foreground">{isTr ? "Bu hızla birikim" : "Cumulative at this rate"}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-muted-foreground">3 {isTr ? "Ay" : "Mo"}</p>
                      <p className="font-bold font-mono text-foreground">{currency(goal3Months)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">6 {isTr ? "Ay" : "Mo"}</p>
                      <p className="font-bold font-mono text-foreground">{currency(goal6Months)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">12 {isTr ? "Ay" : "Mo"}</p>
                      <p className="font-bold font-mono text-foreground">{currency(goal12Months)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-red-400 text-center">
                  {isTr
                    ? "⚠️ Bu fiyatlarla zarar ediyorsun — maliyet veya satış fiyatını gözden geçir."
                    : "⚠️ You're losing money at these prices — review your cost or sale price."}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
