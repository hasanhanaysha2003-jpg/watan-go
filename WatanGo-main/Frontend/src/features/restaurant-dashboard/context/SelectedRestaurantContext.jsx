import { createContext, useContext, useEffect, useState } from "react";
import { getMyRestaurants } from "@/api/restaurant-items";

const SelectedRestaurantContext = createContext(null);

/**
 * Provides the list of the owner's restaurants and the currently selected one.
 * Wrap the restaurant-dashboard layout with this provider.
 */
export function SelectedRestaurantProvider({ children }) {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const result = await getMyRestaurants();
      setLoading(false);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setRestaurants(result.data);
      // Default: first restaurant in the list
      if (result.data.length > 0) setSelectedId(result.data[0].id);
    }
    init();
  }, []);

  const selectedRestaurant = restaurants.find((r) => r.id === selectedId) ?? null;

  return (
    <SelectedRestaurantContext.Provider
      value={{ restaurants, selectedId, setSelectedId, selectedRestaurant, loading, error }}
    >
      {children}
    </SelectedRestaurantContext.Provider>
  );
}

/** Consume inside any restaurant-dashboard component. */
export function useSelectedRestaurant() {
  const ctx = useContext(SelectedRestaurantContext);
  if (!ctx) throw new Error("useSelectedRestaurant must be used inside SelectedRestaurantProvider");
  return ctx;
}
