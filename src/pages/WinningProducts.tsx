import { useState } from "react";
import { Filter, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import SEO from "@/components/SEO";

const MARKETPLACE_SETTINGS = {
  Trendyol: { commissionRate: 0.18, kdvRate: 0.20, label: "Trendyol" },
  Hepsiburada: { commissionRate: 0.16, kdvRate: 0.20, label: "Hepsiburada" },
  AmazonTR: { commissionRate: 0.12, kdvRate: 0.20, label: "Amazon TR" },
  N11: { commissionRate: 0.15, kdvRate: 0.20, label: "N11" },
};

export default function WinningProducts() {
  const [platform, setPlatform] = useState("Tümü");
  const [category, setCategory] = useState("Tümü");
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const { t, currency } = useLocale();

  // Test ve hata önleme amaçlı statik ürün listesi (Mock veri bağımlılığını kırar)
  const sampleProducts = [
    { id: 1, name: "30000 mAh Kablosuz Powerbank", category: "Elektronik", platform: "Amazon", estimatedSellingPrice: 45.99, supplierPrice: 15.50, trendScore: 92, profitMargin: 42, competition: "Düşük", image: "🔋" },
    { id: 2, name: "Akıllı Saat Serisi 9 Pro", category: "Elektronik", platform: "TikTok", estimatedSellingPrice: 89.00, supplierPrice: 28.00, trendScore: 95, profitMargin: 48, competition: "Orta", image: "⌚" },
    { id: 3, name: "Ortopedik Boyun Destekli Yastık", category: "Ev & Yaşam", platform: "AliExpress", estimatedSellingPrice: 35.00, supplierPrice: 10.00, trendScore: 88, profitMargin: 52, competition: "Düşük", image: "🛏️" }
  ];

  const platforms = ["Tümü", "TikTok", "Amazon", "AliExpress"];

  const calculateMarketplaceProfit = (sellingPrice: number, costPrice: number) => {
    const dollarRate = 46.15;
    const priceInTL = sellingPrice * dollarRate;
    const costInTL = costPrice * dollarRate;

    return Object.entries(MARKETPLACE_SETTINGS).map(([key, config]) => {
      const commission = priceInTL * config.commissionRate;
      const kdv = priceInTL * (config.kdvRate / (1 + config.kdvRate)) * config.commissionRate;
      const netProfit = priceInTL - costInTL - commission - kdv;
      const margin = Math.round((netProfit / priceInTL) * 100);

      return {
        name: config.label,
        commission: Math.round(commission),
        rate: Math.round(config.commissionRate * 100),
        kdv: Math.round(kdv),
        netProfit: Math.round(netProfit),
        margin: margin,
      };
    });
  };

  const filtered = sampleProducts.filter(p => platform === "Tümü" || p.platform === platform);

  return (
    <div className="space-y-6 p-4">
      <SEO title="Kazanan Ürünler | KHELL AI" description="Yüksek kârlılık potansiyeli taşıyan kazanan ürünleri keşfet." />
      
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {platforms.map((p) => (
            <button 
              key={p} 
              onClick={() => setPlatform(p)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${platform === p ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}
            >
              {p === "Tümü" ? "Tümü" : p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => {
          const isExpanded = expandedProduct === product.id;
          const marketplaceData = calculateMarketplaceProfit(product.estimatedSellingPrice, product.supplierPrice);

          return (
            <div key={product.id} className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{product.image}</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-green-500/10 text-green-400">Kazanan</span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{product.name}</h3>
                <p className="text-[10px] text-zinc-400 mb-3">{product.category} · {product.platform}</p>
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Satış Fiyatı</span>
                    <span className="text-white font-medium">${product.estimatedSellingPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tedarikçi Fiyatı</span>
                    <span className="text-white font-medium">${product.supplierPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Kâr Marjı</span>
                    <span className="text-green-400 font-medium">%{product.profitMargin}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-2 border-t border-zinc-800">
                <button 
                  onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                  className="w-full flex items-center justify-between py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800/50 rounded-lg px-3"
                >
                  <span>📊 {isExpanded ? "Detayları Gizle" : "Pazar Yeri Komisyonu"}</span>
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 bg-black/30 p-3 rounded-lg text-[11px]">
                    {marketplaceData.map((market) => (
                      <div key={market.name} className="p-2 bg-zinc-900 rounded border border-zinc-800 space-y-1">
                        <div className="flex justify-between font-medium text-white">
                          <span>{market.name}</span>
                          <span className="text-green-400">Net: ₺{market.netProfit.toLocaleString()} (%{market.margin})</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-zinc-500">
                          <span>Komisyon (%{market.rate})</span>
                          <span className="text-red-400">-₺{market.commission}</span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full mt-1 py-1.5 bg-blue-600/20 text-blue-400 text-[10px] font-medium rounded flex items-center justify-center gap-1">
                      Pazar Yerine Git <ExternalLink className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
