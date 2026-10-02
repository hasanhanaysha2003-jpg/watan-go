import { useCallback, useEffect, useState } from "react";
import {
  createMarketItem,
  deleteMarketItem,
  getMarketItems,
  updateMarketItem,
} from "@/api/market-items";

export function useShopMarketItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getMarketItems();
    if (result.ok) setItems(result.data);
    else setError(result.message);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) load();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [load]);

  async function create(payload) {
    const result = await createMarketItem(payload);
    if (result.ok) await load();
    return result;
  }

  async function update(id, payload) {
    const result = await updateMarketItem(id, payload);
    if (result.ok) await load();
    return result;
  }

  async function remove(id) {
    const result = await deleteMarketItem(id);
    if (result.ok) await load();
    return result;
  }

  return { items, loading, error, create, update, remove };
}
