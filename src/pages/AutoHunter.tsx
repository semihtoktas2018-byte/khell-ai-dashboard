import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Crosshair, Trophy, TrendingUp, Zap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scanAllProducts, type HunterCandidate } from "@/lib/auto-hunter";
import { calculateWinningScore, tierColor, tierBg } from "@/lib/winning-engine";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/LocaleContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

export default function AutoHunter() {
  const { toast } = useToast();
  const { saveProduct } = useSavedProducts();
  const { t } = useLocale();
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"hunterScore" | "trendScore" | "estimatedMargin">("hunterScore");

  const { data: candidates = [] } = useQuery({
    queryKey: ["hunter-candidates"],
    queryFn: scanAllProducts,
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    let result = [...candidates];
    if (platformFilter !== "all") result = result.filter((p) => p.platform === platformFilter);
    result.sort((a, b) => b[sortBy] - a[sortBy]);
    return result;
  }, [candidates, platformFilter, sortBy]);

  const topProduct = filtered[0];

  const radarData = useMemo(() => {
    if (!topProduct) return [];
    return [
      { metric: t("hunter.trend"), value: topProduct.trendScore },
      { metric: t("hunter.engagement"), value: topProduct.engagementScore },
      { metric: t("hunter.margin"), value: Math.min(100, topProduct.estimatedMargin * 1.5) },
      { metric: t("hunter.competition"), value: topProduct.competitionLevel === "Low" ? 90 : topProduct.competitionLevel === "Medium" ? 55 : 20 },
      { metric: t("savedProd.score"), value: topProduct.hunterScore },
    ];
  }, [topProduct, t]);

  const barData = useMemo(() => {
    return filtered.slice(0, 7).map((p) => ({ name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name, score: p.hunterScore }));
  }, [filtered]);

  const handleSave = (p: HunterCandidate) => {
    const riskLevel = p.competitionLevel === "High" ? "high" : p.competitionLevel === "Medium" ? "medium" : "low";
    saveProduct({ name: p.name, profitMargin: p.estimatedMargin, riskLevel, decisionScore: p.hunterScore, monthlyProfit: Math.round((p.estimatedSellingPrice - p.estimatedCost) * 30) });
    toast({ title: t("hunter.saved"), description: `${p.name} ${t("hunter.savedDesc")}` });
  };

  const compLabel = (level: string) => level === "Low" ? t("viralDisc.lowLevel") : level === "Medium" ? t("viralDisc.medLevel") : t("viralDisc.highLevel");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Crosshair className="h-6 w-6 text-primary" /> {t("hunter.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("hunter.desc")}</p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20">Top {filtered.length}</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t("hunter.scanned"), value: candidates.length, icon: Target },
          { label: t("hunter.avgScore"), value: Math.round(candidates.reduce((s, p) => s + p.hunterScore, 0) / (candidates.length || 1)), icon: TrendingUp },
          { label: t("hunter.highMargin"), value: candidates.filter((p) => p.estimatedMargin > 50).length, icon: Zap },
          { label: t("hunter.lowComp"), value: candidates.filter((p) => p.competitionLevel === "Low").length, icon: Trophy },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card><CardContent className="pt-4 pb-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><stat.icon className="h-4 w-4 text-primary" /></div>
              <div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-xl font-bold text-foreground">{stat.value}</p></div>
            </CardContent></Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">{t("hunter.scoreRanking")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} layout="vertical"><XAxis type="number" hide /><YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={90} /><Tooltip /><Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} /></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {topProduct && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">{t("hunter.topAnalysis")}: {topProduct.name}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}><PolarGrid stroke="hsl(var(--border))" /><PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} /><Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} /></RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Platform" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("hunter.allPlatforms")}</SelectItem>
            <SelectItem value="TikTok">TikTok</SelectItem>
            <SelectItem value="Amazon">Amazon</SelectItem>
            <SelectItem value="AliExpress">AliExpress</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t("savedProd.sortLabel")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="hunterScore">{t("hunter.hunterScore")}</SelectItem>
            <SelectItem value="trendScore">{t("hunter.trendScore")}</SelectItem>
            <SelectItem value="estimatedMargin">{t("hunter.profitMargin")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p, i) => {
          const { tier } = calculateWinningScore(p.trendScore, p.estimatedMargin, p.competitionLevel, 30);
          return (
            <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img src={p.image} alt={p.name} className="w-20 h-20 rounded-lg object-cover bg-muted" loading="lazy" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-foreground">{p.name}</h3>
                        <span className="text-lg font-bold text-primary">{p.hunterScore}</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        <Badge variant="secondary" className="text-[10px]">{p.platform}</Badge>
                        <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                        <Badge className={`text-[10px] border ${tierBg(tier)} ${tierColor(tier)}`}>{tier}</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-[11px]">
                        <div><span className="text-muted-foreground">{t("hunter.trend")}</span><br /><span className="font-semibold">{p.trendScore}</span></div>
                        <div><span className="text-muted-foreground">{t("hunter.engagement")}</span><br /><span className="font-semibold">{p.engagementScore}</span></div>
                        <div><span className="text-muted-foreground">{t("hunter.margin")}</span><br /><span className="font-semibold">%{p.estimatedMargin}</span></div>
                        <div><span className="text-muted-foreground">{t("hunter.competition")}</span><br /><span className="font-semibold">{compLabel(p.competitionLevel)}</span></div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => handleSave(p)}>{t("hunter.save")}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest">{t("nav.production")}</p>
    </div>
  );
}
