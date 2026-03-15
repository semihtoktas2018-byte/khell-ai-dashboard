import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Flame, TrendingUp, Zap, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllTrendProducts, detectViralProducts, getPlatformDistribution, getCategoryDistribution } from "@/lib/trend-engine";
import type { ScoredTrendProduct } from "@/lib/trend-engine";
import { calculateWinningScore, tierColor, tierBg } from "@/lib/winning-engine";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#f59e0b", "#10b981", "#8b5cf6"];

export default function ViralDiscovery() {
  const { toast } = useToast();
  const { saveProduct } = useSavedProducts();
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [marginFilter, setMarginFilter] = useState("all");
  const [competitionFilter, setCompetitionFilter] = useState("all");

  const { data: allProducts = [] } = useQuery({
    queryKey: ["trend-products"],
    queryFn: getAllTrendProducts,
    staleTime: 5 * 60 * 1000,
  });

  const viralProducts = useMemo(() => detectViralProducts(allProducts), [allProducts]);
  const platformDist = useMemo(() => getPlatformDistribution(allProducts), [allProducts]);
  const categoryDist = useMemo(() => getCategoryDistribution(allProducts), [allProducts]);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (platformFilter !== "all" && p.platform !== platformFilter) return false;
      if (marginFilter === "high" && p.profitMargin < 50) return false;
      if (marginFilter === "medium" && (p.profitMargin < 25 || p.profitMargin >= 50)) return false;
      if (marginFilter === "low" && p.profitMargin >= 25) return false;
      if (competitionFilter !== "all" && p.competitionLevel !== competitionFilter) return false;
      return true;
    }).sort((a, b) => b.compositeTrendScore - a.compositeTrendScore);
  }, [allProducts, search, platformFilter, marginFilter, competitionFilter]);

  const trendMomentum = useMemo(() => {
    return ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"].map((month, i) => ({
      month,
      tiktok: 60 + Math.round(Math.sin(i * 0.8) * 20 + i * 3),
      amazon: 50 + Math.round(Math.cos(i * 0.6) * 15 + i * 2),
      aliexpress: 45 + Math.round(Math.sin(i * 1.1) * 18 + i * 2.5),
    }));
  }, []);

  const handleSave = (p: ScoredTrendProduct) => {
    const { winningScore, tier } = calculateWinningScore(p.trendScore, p.profitMargin, p.competitionLevel, 30);
    addProduct({
      name: p.name,
      profitMargin: p.profitMargin,
      riskLevel: p.competitionLevel === "High" ? "Yüksek" : p.competitionLevel === "Medium" ? "Orta" : "Düşük",
      decisionScore: winningScore,
    });
    toast({ title: "Kaydedildi", description: `${p.name} kaydedilen ürünlere eklendi (${tier})` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Viral Ürün Keşfi</h1>
          <p className="text-sm text-muted-foreground mt-1">Trend kaynaklarından viral ürünleri keşfedin</p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20">{viralProducts.length} Viral Ürün</Badge>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Platform Dağılımı</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={platformDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} strokeWidth={2}>
                  {platformDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Top Kategoriler</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={categoryDist}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Trend Momentum</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trendMomentum}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="tiktok" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="amazon" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="aliexpress" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Ürün ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Platform" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Platformlar</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Amazon">Amazon</SelectItem>
                <SelectItem value="AliExpress">AliExpress</SelectItem>
                <SelectItem value="Google Trends">Google Trends</SelectItem>
              </SelectContent>
            </Select>
            <Select value={marginFilter} onValueChange={setMarginFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Marj" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Marjlar</SelectItem>
                <SelectItem value="high">%50+</SelectItem>
                <SelectItem value="medium">%25-50</SelectItem>
                <SelectItem value="low">%25 altı</SelectItem>
              </SelectContent>
            </Select>
            <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Rekabet" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Seviyeler</SelectItem>
                <SelectItem value="Low">Düşük</SelectItem>
                <SelectItem value="Medium">Orta</SelectItem>
                <SelectItem value="High">Yüksek</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p, i) => {
          const { tier } = calculateWinningScore(p.trendScore, p.profitMargin, p.competitionLevel, 30);
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="overflow-hidden hover:border-primary/30 transition-colors">
                <div className="h-36 overflow-hidden bg-muted">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">{p.name}</h3>
                    {p.isViral && <Flame className="h-4 w-4 text-orange-400 shrink-0" />}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">{p.platform}</Badge>
                    <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Trend:</span> <span className="font-semibold text-foreground">{p.trendScore}</span></div>
                    <div><span className="text-muted-foreground">Marj:</span> <span className="font-semibold text-foreground">%{p.profitMargin}</span></div>
                    <div><span className="text-muted-foreground">Fiyat:</span> <span className="font-semibold text-foreground">${p.estimatedSellingPrice}</span></div>
                    <div><span className="text-muted-foreground">Maliyet:</span> <span className="font-semibold text-foreground">${p.estimatedCost}</span></div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded border text-center ${tierBg(tier)} ${tierColor(tier)}`}>
                    {tier}
                  </div>
                  <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => handleSave(p)}>
                    Kaydet
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
