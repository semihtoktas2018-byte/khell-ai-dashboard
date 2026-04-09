import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

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
}

const STORAGE_KEY = "khell_analysis_history";
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

function countToday(history: AnalysisRecord[]): number {
  const today = getTodayKey();
  return history.filter((r) => r.createdAt.slice(0, 10) === today).length;
}

const AnalysisHistoryContext = createContext<AnalysisHistoryContextType | null>(null);

export function AnalysisHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<AnalysisRecord[]>(loadHistory);

  const todayCount = countToday(history);
  const canAnalyze = todayCount < DAILY_LIMIT;

  const persist = (items: AnalysisRecord[]) => {
    setHistory(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

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
  }, []);

  const clearHistory = useCallback(() => {
    persist([]);
  }, []);

  return (
    <AnalysisHistoryContext.Provider value={{ history, addAnalysis, clearHistory, todayCount, canAnalyze, dailyLimit: DAILY_LIMIT }}>
      {children}
    </AnalysisHistoryContext.Provider>
  );
}

export function useAnalysisHistory() {
  const ctx = useContext(AnalysisHistoryContext);
  if (!ctx) throw new Error("useAnalysisHistory must be used within AnalysisHistoryProvider");
  return ctx;
}
