import { useEffect, useRef, useState } from "react";
import { getRestaurants } from "@/api/restaurants";

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchRestaurants(search);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [search]);

  async function fetchRestaurants(name) {
    setLoading(true);
    setError(null);
    const result = await getRestaurants({ name: name || undefined });
    if (result.ok) {
      setRestaurants(result.data);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }

  return { restaurants, loading, error, search, setSearch };
}
