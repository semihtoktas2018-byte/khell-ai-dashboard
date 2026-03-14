export interface AnalyzerInput {
  product_cost: number;
  shipping_cost: number;
  ad_cost_per_sale: number;
  platform_fee_percentage: number;
  selling_price: number;
  return_rate: number;
}

export interface AnalyzerResult {
  gross_profit: number;
  platform_fee: number;
  net_profit: number;
  profit_margin: number;
  return_loss: number;
  verdict: Verdict;
}

export interface Verdict {
  label: string;
  labelTr: string;
  class: string;
  color: string;
}

export function getVerdict(margin: number): Verdict {
  if (margin >= 40) return { label: "Winning Product", labelTr: "Kazanan Ürün", class: "verdict-winning", color: "hsl(142 71% 45%)" };
  if (margin >= 25) return { label: "Good", labelTr: "İyi Ürün", class: "verdict-good", color: "hsl(217 91% 60%)" };
  if (margin >= 10) return { label: "Risky", labelTr: "Riskli Ürün", class: "verdict-risky", color: "hsl(38 92% 50%)" };
  return { label: "Bad Product", labelTr: "Kötü Ürün", class: "verdict-bad", color: "hsl(0 84% 60%)" };
}

export function analyzeProduct(input: AnalyzerInput): AnalyzerResult {
  const gross_profit = input.selling_price - input.product_cost - input.shipping_cost - input.ad_cost_per_sale;
  const platform_fee = input.selling_price * (input.platform_fee_percentage / 100);
  const return_loss = input.selling_price * (input.return_rate / 100);
  const net_profit = gross_profit - platform_fee - return_loss;
  const profit_margin = input.selling_price > 0 ? (net_profit / input.selling_price) * 100 : 0;

  return {
    gross_profit,
    platform_fee,
    net_profit,
    profit_margin,
    return_loss,
    verdict: getVerdict(profit_margin),
  };
}
