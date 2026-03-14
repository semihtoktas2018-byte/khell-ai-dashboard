import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface SavedProduct {
  id: string;
  name: string;
  profitMargin: number;
  riskLevel: "low" | "medium" | "high";
  decisionScore: number;
  monthlyProfit: number;
  dateSaved: string;
  platform?: string;
}

interface SavedProductsContextType {
  products: SavedProduct[];
  saveProduct: (product: Omit<SavedProduct, "id" | "dateSaved">) => void;
  deleteProduct: (id: string) => void;
  isProductSaved: (name: string) => boolean;
}

const SavedProductsContext = createContext<SavedProductsContextType | null>(null);

export function SavedProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<SavedProduct[]>(() => {
    const saved = localStorage.getItem("khell_saved_products");
    return saved ? JSON.parse(saved) : [];
  });

  const persist = (items: SavedProduct[]) => {
    setProducts(items);
    localStorage.setItem("khell_saved_products", JSON.stringify(items));
  };

  const saveProduct = useCallback((product: Omit<SavedProduct, "id" | "dateSaved">) => {
    const newProduct: SavedProduct = {
      ...product,
      id: crypto.randomUUID(),
      dateSaved: new Date().toISOString(),
    };
    setProducts((prev) => {
      const next = [newProduct, ...prev];
      localStorage.setItem("khell_saved_products", JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem("khell_saved_products", JSON.stringify(next));
      return next;
    });
  }, []);

  const isProductSaved = useCallback((name: string) => {
    return products.some((p) => p.name === name);
  }, [products]);

  return (
    <SavedProductsContext.Provider value={{ products, saveProduct, deleteProduct, isProductSaved }}>
      {children}
    </SavedProductsContext.Provider>
  );
}

export function useSavedProducts() {
  const ctx = useContext(SavedProductsContext);
  if (!ctx) throw new Error("useSavedProducts must be used within SavedProductsProvider");
  return ctx;
}
