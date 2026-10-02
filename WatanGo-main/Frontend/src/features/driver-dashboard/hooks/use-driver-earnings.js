import { useEffect, useState } from "react";
import { getDriverEarnings } from "@/api/driver-dashboard";

export function useDriverEarnings() {
  const [earnings, setEarnings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let alive = true;
    async function fetch() {
      setIsLoading(true);
      setError(null);
      const result = await getDriverEarnings();
      if (!alive) return;
      if (result.ok) setEarnings(result.data);
      else setError(result.message);
      setIsLoading(false);
    }
    fetch();
    return () => { alive = false; };
  }, []);

  return { earnings, isLoading, error };
}
