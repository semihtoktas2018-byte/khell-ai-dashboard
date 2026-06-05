import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

interface Props {
  isTr?: boolean;
  plate?: string;
  km?: string;
  fuel?: string;
  driverCost?: string;
  other?: string;
  revenue?: string;
}

export default function MasrafPusulasiExport({
  isTr = true,
  plate = "",
  km = "",
  fuel = "",
  driverCost = "",
  other = "",
  revenue = "",
}: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [seferNo, setSeferNo] = useState("");
  const [guzergah, setGuzergah] = useState("");
  const [cikis, setCikis] = useState(today);
  const [donus, setDonus] = useState(today);
  const [driverName, setDriverName] = useState("");
  const [avans, setAvans] = useState("");
  const [mazotNote, setMazotNote] = useState("");
  const [harcamaNote, setHarcamaNote] = useState("");

  const num = (v: string) => parseFloat((v || "").replace(",", ".")) || 0;

  const handleDownload = () => {
    const rev = num(revenue);
    const f = num(fuel);
    const dC = num(driverCost);
    const o = num(other);
    const a = num(avans);
    const kmN = num(km);
    const totalCost = f + dC + o;
    const net = rev - totalCost;
    const sarfiyat = kmN > 0 ? f / kmN : 0;

    const L = (tr: string, en: string) => (isTr ? tr : en);

    const rows: (string | number)[][] = [
      [L("MASRAF PUSULASI", "EXPENSE REPORT")],
      [],
      [L("Sefer No", "Trip No"), seferNo || "—"],
      [L("Güzergah", "Route"), guzergah || "—"],
      [L("Çıkış Tarihi", "Departure Date"), cikis || "—"],
      [L("Dönüş Tarihi", "Return Date"), donus || "—"],
      [L("Plaka", "Plate"), plate || "—"],
      [L("Şoför Adı", "Driver Name"), driverName || "—"],
      [L("KM", "KM"), kmN],
      [],
      [L("KALEM", "ITEM"), L("TUTAR", "AMOUNT")],
      [L("Gelir", "Revenue"), rev],
      [L("Mazot Alımları", "Fuel Purchases"), f],
      [L("Şoför Maliyeti", "Driver Cost"), dC],
      [L("Yapılan Harcamalar", "Other Expenses"), o],
      [L("Alınan Avans", "Advance Taken"), a],
      [L("Toplam Maliyet", "Total Cost"), totalCost],
      [L("Net Kâr/Zarar", "Net Profit/Loss"), net],
      [L("Sarfiyat (TL/KM)", "Consumption (per KM)"), Number(sarfiyat.toFixed(4))],
      [],
      [L("Mazot Alım Notları", "Fuel Notes"), mazotNote || "—"],
      [L("Harcama Notları", "Expense Notes"), harcamaNote || "—"],
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 28 }, { wch: 38 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, L("Masraf Pusulası", "Expense Report"));
    const filename = `masraf-pusulasi-${seferNo || plate || today}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const inputCls =
    "w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="card-glow rounded-xl p-6 no-print">
      <div className="flex items-center gap-2 mb-1">
        <FileSpreadsheet className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          {isTr ? "Masraf Pusulası" : "Expense Report"}
        </h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        {isTr
          ? "Sefer detaylarını gir, tüm veriler Excel olarak insin."
          : "Enter trip details and download all data as Excel."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">
            {isTr ? "Sefer No" : "Trip No"}
          </label>
          <input className={inputCls} value={seferNo} onChange={(e) => setSeferNo(e.target.value)} placeholder="S-2025-001" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">
            {isTr ? "Şoför Adı" : "Driver Name"}
          </label>
          <input className={inputCls} value={driverName} onChange={(e) => setDriverName(e.target.value)} placeholder={isTr ? "Ad Soyad" : "Full Name"} />
        </div>
        <div className="md:col-span-2">
          <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">
            {isTr ? "Güzergah" : "Route"}
          </label>
          <input className={inputCls} value={guzergah} onChange={(e) => setGuzergah(e.target.value)} placeholder={isTr ? "İstanbul → Ankara" : "From → To"} />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">
            {isTr ? "Çıkış Tarihi" : "Departure"}
          </label>
          <input type="date" className={inputCls} value={cikis} onChange={(e) => setCikis(e.target.value)} />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">
            {isTr ? "Dönüş Tarihi" : "Return"}
          </label>
          <input type="date" className={inputCls} value={donus} onChange={(e) => setDonus(e.target.value)} />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">
            {isTr ? "Alınan Avans" : "Advance"}
          </label>
          <input type="number" className={inputCls} value={avans} onChange={(e) => setAvans(e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">
            {isTr ? "Plaka (otomatik)" : "Plate (auto)"}
          </label>
          <input className={inputCls} value={plate} readOnly placeholder="—" />
        </div>
        <div className="md:col-span-2">
          <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">
            {isTr ? "Mazot Alım Notları" : "Fuel Notes"}
          </label>
          <textarea
            className={inputCls}
            rows={2}
            value={mazotNote}
            onChange={(e) => setMazotNote(e.target.value)}
            placeholder={isTr ? "Tarih / istasyon / litre / tutar" : "Date / station / liters / amount"}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">
            {isTr ? "Yapılan Harcamalar" : "Other Expenses"}
          </label>
          <textarea
            className={inputCls}
            rows={2}
            value={harcamaNote}
            onChange={(e) => setHarcamaNote(e.target.value)}
            placeholder={isTr ? "Yemek, konaklama, köprü vb." : "Meals, lodging, tolls, etc."}
          />
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="w-full mt-5 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground hover:brightness-110 transition-all shadow-[0_0_25px_-5px_hsl(var(--primary)/0.6)]"
      >
        <FileSpreadsheet className="h-4 w-4" />
        {isTr ? "Masraf Pusulası İndir (Excel)" : "Download Expense Report (Excel)"}
      </button>
    </div>
  );
}