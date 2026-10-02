import { useCallback, useEffect, useState } from "react";
import { getMarketItems } from "@/api/market-items";

export function useMarketItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [inStock, setInStock] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getMarketItems({
      name: search || undefined,
      inStock: inStock || undefined,
    });
    if (result.ok) setItems(result.data);
    else setError(result.message);
    setLoading(false);
  }, [search, inStock]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) fetchItems();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchItems]);

  return { items, loading, error, search, setSearch, inStock, setInStock };
}
