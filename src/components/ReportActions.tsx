import { Printer, Download, Copy, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  isTr?: boolean;
  filename: string;
  /** rows: array of [label, value] for CSV + clipboard text */
  rows: Array<[string, string | number]>;
}

export default function ReportActions({ isTr = true, filename, rows }: Props) {
  const [copied, setCopied] = useState(false);

  const toCsv = () => {
    const esc = (v: string | number) => {
      const s = String(v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    };
    const header = isTr ? "Alan,Değer\n" : "Field,Value\n";
    return header + rows.map(([k, v]) => `${esc(k)},${esc(v)}`).join("\n");
  };

  const handleCsv = () => {
    const blob = new Blob([toCsv()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="no-print flex flex-wrap gap-2 mt-3">
      <button
        type="button"
        onClick={() => window.print()}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
      >
        <Printer className="h-3.5 w-3.5" />
        {isTr ? "PDF İndir" : "Download PDF"}
      </button>
      <button
        type="button"
        onClick={handleCsv}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors"
      >
        <Download className="h-3.5 w-3.5" />
        CSV
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? (isTr ? "Kopyalandı" : "Copied") : (isTr ? "Kopyala" : "Copy")}
      </button>
    </div>
  );
}
