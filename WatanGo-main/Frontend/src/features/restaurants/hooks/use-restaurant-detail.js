import { useEffect, useState } from "react";
import { getRestaurantById } from "@/api/restaurants";

export function useRestaurantDetail(id) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);
      const result = await getRestaurantById(id);
      if (cancelled) return;
      if (result.ok) {
        setRestaurant(result.data);
      } else {
        setError(result.message);
      }
      setLoading(false);
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { restaurant, loading, error };
}
