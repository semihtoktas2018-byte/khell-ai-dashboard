import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface AnalysisRecord {
  id: string;
  productName: string;
  sellingPrice: number;
  productCost: number;
  shippingCost: number;
  adsCost: number;
  monthlyOrders: number;
  decisionScore: number;
  profitMargin: number;
  riskLevel: "low" | "medium" | "high";
  monthlyProfit: number;
  createdAt: string;
}

interface AnalysisHistoryContextType {
  history: AnalysisRecord[];
  addAnalysis: (record: Omit<AnalysisRecord, "id" | "createdAt">) => void;
  clearHistory: () => void;
  todayCount: number;
  canAnalyze: boolean;
  dailyLimit: number;
  isPro: boolean;
  activatePro: (code: string) => boolean;
}

const STORAGE_KEY = "khell_analysis_history";
const USAGE_KEY = "khell_daily_usage"; // geçmişten ayrı, "Geçmişi Temizle" bunu etkilemez
const DAILY_LIMIT = 3;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadHistory(): AnalysisRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadUsage(): { date: string; count: number } {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.date === getTodayKey()) return parsed;
    }
  } catch {
    // ignore
  }
  return { date: getTodayKey(), count: 0 };
}

function saveUsage(usage: { date: string; count: number }) {
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
  } catch {
    // ignore
  }
}

const AnalysisHistoryContext = createContext<AnalysisHistoryContextType | null>(null);

export function AnalysisHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<AnalysisRecord[]>(loadHistory);
  const { isPro } = useAuth();
  const [usage, setUsage] = useState(loadUsage);

  const todayCount = usage.count;
  const canAnalyze = isPro || todayCount < DAILY_LIMIT;

  const addAnalysis = useCallback((record: Omit<AnalysisRecord, "id" | "createdAt">) => {
    const newRecord: AnalysisRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setHistory((prev) => {
      const next = [newRecord, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setUsage((prev) => {
      const today = getTodayKey();
      const next = prev.date === today ? { date: today, count: prev.count + 1 } : { date: today, count: 1 };
      saveUsage(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    // Sadece görüntülenen listeyi temizler — günlük hak sayacına dokunmaz.
    setHistory([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }, []);

  const activatePro = useCallback((_code: string) => {
    // Plan upgrades now happen server-side via Supabase; codes are disabled.
    return false;
  }, []);

  return (
    <AnalysisHistoryContext.Provider
      value={{ history, addAnalysis, clearHistory, todayCount, canAnalyze, dailyLimit: DAILY_LIMIT, isPro, activatePro }}
    >
      {children}
    </AnalysisHistoryContext.Provider>
  );
}

export function useAnalysisHistory() {
  const ctx = useContext(AnalysisHistoryContext);
  if (!ctx) throw new Error("useAnalysisHistory must be used within AnalysisHistoryProvider");
  return ctx;
}
