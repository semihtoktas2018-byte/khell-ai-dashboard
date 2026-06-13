import { useState } from "react";
import { TrendingUp, Target } from "lucide-react";

interface ProfitSimulatorProps {
  profitPerUnit: number;
  revenuePerUnit: number;
  costPerUnit: number;
  currency: (val: number) => string;
  initialOrders?: number;
}

const MARKS = [10, 25, 50, 100, 250, 500, 1000];

export default function ProfitSimulator({
  profitPerUnit,
  revenuePerUnit,
  costPerUnit,
  currency,
  initialOrders = 50,
}: ProfitSimulatorProps) {
  const [orders, setOrders] = useState(initialOrders);

  const monthlyProfit = profitPerUnit * orders;
  const monthlyRevenue = revenuePerUnit * orders;
  const monthlyCost = costPerUnit * orders;

  const dailyOrdersNeeded = Math.max(1, Math.ceil(orders / 30));

  const goal3Months = monthlyProfit * 3;
  const goal6Months = monthlyProfit * 6;
  const goal12Months = monthlyProfit * 12;

  if (revenuePerUnit <= 0) return null;

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-emerald-500/10">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-emerald-400">Kâr Simülatörü</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Aylık Sipariş Sayısı</span>
          <span className="font-mono font-bold text-emerald-400 text-base">{orders.toLocaleString("tr-TR")} adet</span>
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
        <div className="flex justify-between text-[10px] text-muted-foreground">
          {MARKS.map((m) => (
            <button
              key={m}
              onClick={() => setOrders(m)}
              className={`hover:text-emerald-400 transition-colors ${orders === m ? "text-emerald-400 font-bold" : ""}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-background/60 p-3 text-center">
          <p className="text-[10px] text-muted-foreground mb-1">Aylık Ciro</p>
          <p className="text-sm font-bold font-mono text-foreground">{currency(monthlyRevenue)}</p>
        </div>
        <div className="rounded-lg bg-background/60 p-3 text-center">
          <p className="text-[10px] text-muted-foreground mb-1">Toplam Maliyet</p>
          <p className="text-sm font-bold font-mono text-red-400">-{currency(monthlyCost)}</p>
        </div>
        <div className="rounded-lg bg-emerald-500/10 p-3 text-center border border-emerald-500/20">
          <p className="text-[10px] text-muted-foreground mb-1">Net Kâr</p>
          <p className={`text-sm font-bold font-mono ${monthlyProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {currency(monthlyProfit)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs rounded-lg bg-background/40 px-3 py-2">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Target className="h-3 w-3" /> Günlük hedef
        </span>
        <span className="font-mono font-bold text-foreground">~{dailyOrdersNeeded} sipariş/gün</span>
      </div>

      {monthlyProfit > 0 && (
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Bu hızla birikim</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] text-muted-foreground">3 Ay</p>
              <p className="text-xs font-bold font-mono text-foreground">{currency(goal3Months)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">6 Ay</p>
              <p className="text-xs font-bold font-mono text-foreground">{currency(goal6Months)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">12 Ay</p>
              <p className="text-xs font-bold font-mono text-foreground">{currency(goal12Months)}</p>
            </div>
          </div>
        </div>
      )}

      {monthlyProfit < 0 && (
        <p className="text-[10px] text-red-400 text-center">
          ⚠️ Bu fiyatlarla zarar ediyorsun — maliyet veya satış fiyatını gözden geçir.
        </p>
      )}
    </div>
  );
}
