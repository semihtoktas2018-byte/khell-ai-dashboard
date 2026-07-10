import { Link } from "react-router-dom";

const guides = [
  { to: "/rehber/dropshipping-nedir-nasil-yapilir", label: "Dropshipping Nedir" },
  { to: "/rehber/kazanan-urun-nasil-bulunur", label: "Kazanan Ürün Bulma" },
  { to: "/rehber/dropshipping-karli-mi", label: "Dropshipping Kârlı mı" },
  { to: "/rehber/2026-trend-dropshipping-urunleri", label: "2026 Trend Ürünler" },
];

export default function BamirFooter() {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {guides.map((g) => (
          <Link
            key={g.to}
            to={g.to}
            className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            {g.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          A BAMIR ONLINE STORE'S PRODUCTION
        </p>
      </div>
    </div>
  );
}
