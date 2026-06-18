import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface OrderEntry {
  id: string;
  productName: string;
  quantity: number;
  unitSellingPrice: number;
  unitCost: number;
  otherCosts: number;
  date: string;
}

interface OrderLogContextType {
  orders: OrderEntry[];
  addOrder: (entry: Omit<OrderEntry, "id" | "date"> & { date?: string }) => void;
  deleteOrder: (id: string) => void;
  totals: { revenue: number; cost: number; profit: number; unitsSold: number };
}

const STORAGE_KEY = "khell_order_log";

function loadOrders(): OrderEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistOrders(items: OrderEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

const OrderLogContext = createContext<OrderLogContextType | null>(null);

export function OrderLogProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<OrderEntry[]>(loadOrders);

  const addOrder = useCallback((entry: Omit<OrderEntry, "id" | "date"> & { date?: string }) => {
    const newEntry: OrderEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: entry.date || new Date().toISOString(),
    };
    setOrders((prev) => {
      const next = [newEntry, ...prev];
      persistOrders(next);
      return next;
    });
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => {
      const next = prev.filter((o) => o.id !== id);
      persistOrders(next);
      return next;
    });
  }, []);

  const totals = orders.reduce(
    (acc, o) => {
      const revenue = o.unitSellingPrice * o.quantity;
      const cost = o.unitCost * o.quantity + o.otherCosts;
      acc.revenue += revenue;
      acc.cost += cost;
      acc.profit += revenue - cost;
      acc.unitsSold += o.quantity;
      return acc;
    },
    { revenue: 0, cost: 0, profit: 0, unitsSold: 0 }
  );

  return (
    <OrderLogContext.Provider value={{ orders, addOrder, deleteOrder, totals }}>
      {children}
    </OrderLogContext.Provider>
  );
}

export function useOrderLog() {
  const ctx = useContext(OrderLogContext);
  if (!ctx) throw new Error("useOrderLog must be used within OrderLogProvider");
  return ctx;
}
