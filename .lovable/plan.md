

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
- HOT badge logic: trendScore > 80 AND competitionLevel === "low"

**2. `src/pages/ViralProducts.tsx`** — Full page component
- Filter toggles: High Trend (>70), Low Competition, High Profit (margin > 40%)
- Card grid (responsive: 1/2/3/4 cols) sorted by decisionScore desc
- Each card: name, category badge, trendScore, profit (selling - cost), risk badge, decisionScore, HOT 🔥 badge when applicable
- "Kaydet" button → saves to localStorage via `useSavedProducts` context (with duplicate check)
- "Analize Gönder" button → navigates to `/dashboard/analyzer` with query params for auto-fill

### Files to Modify (minimal)

**3. `src/components/DashboardLayout.tsx`** — Add one nav item entry
- Add `{ label: "Viral Ürün Bulucu", path: "/dashboard/viral-products", icon: Flame }` (or a different icon to distinguish from existing discovery)

**4. `src/App.tsx`** — Add one route
- `<Route path="viral-products" element={<ViralProducts />} />`

**5. `src/pages/ProductAnalyzer.tsx`** — Read query params on mount to auto-fill inputs
- Parse `searchParams` for selling_price, product_cost, productName and pre-populate state

### No other pages modified. Dashboard home untouched.

