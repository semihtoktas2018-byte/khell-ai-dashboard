import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Crown, Clock, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/contexts/LocaleContext";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";

interface ProfileRow {
  id: string;
  email: string | null;
  plan: string | null;
  created_at: string | null;
  last_login: string | null;
  login_count: number | null;
}

export default function UsersAdmin() {
  const { locale } = useLocale();
  const isTr = locale === "tr";
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: e } = await supabase
        .from("profiles")
        .select("id, email, plan, created_at, last_login, login_count")
        .order("last_login", { ascending: false, nullsFirst: false });
      if (e) throw e;
      setRows((data as ProfileRow[]) || []);
    } catch {
      setError(isTr ? "Veri alınamadı. Yetki (RLS) gerekebilir." : "Could not load data. RLS policy may be needed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const total = rows.length;
  const proCount = rows.filter((r) => r.plan === "pro").length;
  const activeToday = rows.filter((r) => {
    if (!r.last_login) return false;
    const d = new Date(r.last_login);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const fmt = (s: string | null) => {
    if (!s) return "—";
    const d = new Date(s);
    return d.toLocaleString(isTr ? "tr-TR" : "en-US", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <SEO title="Kullanıcılar | KHELL AI" description="Kullanıcı giriş takibi" />
      <BackButton />

      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> {isTr ? "Kullanıcılar" : "Users"}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {isTr ? "Kayıtlı kullanıcılar, giriş zamanları ve plan durumu" : "Registered users, login times and plan status"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: isTr ? "Toplam Kayıt" : "Total Users", val: total, color: "text-blue-400" },
          { icon: Crown, label: isTr ? "Pro Üye" : "Pro Members", val: proCount, color: "text-amber-400" },
          { icon: Clock, label: isTr ? "Bugün Aktif" : "Active Today", val: activeToday, color: "text-green-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
            <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
            <p className="text-2xl font-black text-white">{s.val}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={load} disabled={loading} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> {isTr ? "Yenile" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">{error}</div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl overflow-hidden" style={{ border: "1px solid hsl(217 32% 17%)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "hsl(222 47% 8%)" }} className="text-muted-foreground text-left">
                <th className="px-4 py-3 font-semibold">{isTr ? "E-posta" : "Email"}</th>
                <th className="px-4 py-3 font-semibold">{isTr ? "Plan" : "Plan"}</th>
                <th className="px-4 py-3 font-semibold">{isTr ? "Son Giriş" : "Last Login"}</th>
                <th className="px-4 py-3 font-semibold text-center">{isTr ? "Giriş Sayısı" : "Logins"}</th>
                <th className="px-4 py-3 font-semibold">{isTr ? "Kayıt" : "Joined"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">{isTr ? "Yükleniyor..." : "Loading..."}</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">{isTr ? "Henüz kayıt yok." : "No users yet."}</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id} className="hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3 text-foreground">{r.email || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.plan === "pro" ? "bg-amber-500/15 text-amber-400" : "bg-muted/30 text-muted-foreground"}`}>
                      {r.plan === "pro" ? "PRO" : "FREE"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{fmt(r.last_login)}</td>
                  <td className="px-4 py-3 text-center text-foreground font-mono">{r.login_count ?? 0}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmt(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
        A BAMIR ONLINE STORE'S PRODUCTION
      </p>
    </div>
  );
}
