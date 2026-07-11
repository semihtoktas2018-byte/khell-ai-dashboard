import { Link } from "react-router-dom";

const guides = [
  { to: "/rehber/dropshipping-nedir-nasil-yapilir", label: "Dropshipping Nedir" },
  { to: "/rehber/kazanan-urun-nasil-bulunur", label: "Kazanan Ürün Bulma" },
  { to: "/rehber/dropshipping-karli-mi", label: "Dropshipping Kârlı mı" },
  { to: "/rehber/2026-trend-dropshipping-urunleri", label: "2026 Trend Ürünler" },
];

export default function BamirFooter() {
  return (
    <div className="flex flex-col items-center gap-4 py-5">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
        {guides.map((g) => (
          <Link
            key={g.to}
            to={g.to}
            className="group relative text-sm font-semibold tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent transition-all duration-300 hover:from-sky-300 hover:via-cyan-200 hover:to-emerald-300"
            style={{ textShadow: "0 0 18px rgba(56, 189, 248, 0.35)" }}
          >
            {g.label}
            <span className="absolute -bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300 group-hover:w-full" />
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
