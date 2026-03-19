

## Viral Product Finder Module

### What We're Building
A new "Viral Ürün Keşfi" page at `/dashboard/viral-products` with 20 dynamically generated dropshipping products, AI scoring, filtering, sorting, save & analyze actions.

### Files to Create

**1. `src/lib/viral-products-data.ts`** — Product generation engine
- 20 realistic dropshipping products across 5 categories (fitness, pet, tech, home, car)
- Each product: name, category, sellingPrice, cost, margin, trendScore, demandLevel, competitionLevel, riskLevel, decisionScore
- Decision formula: `(margin * 0.4) + (trendScore * 0.3) + (demandWeight * 0.2) - (competitionWeight * 0.1)`
  - demandWeight: low=20, medium=50, high=80
  - competitionWeight: low=10, medium=40, high=70
- riskLevel derived: low competition + high trend → Düşük, high competition → Yüksek, else Orta
- HOT badge logic: trendScore > 80 AND competitionLevel === "low