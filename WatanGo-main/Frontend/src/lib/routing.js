const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

// Cache stores { coords, durationSecs } per route key
const routeCache = new Map();

/**
 * Fetch a real road route between two points using OSRM.
 * Returns { coords: [lat, lng][], durationSecs: number | null }.
 * Falls back to a straight line with null duration on failure.
 */
export async function fetchRouteWithDetails(fromLat, fromLng, toLat, toLng) {
  const key = `${fromLat},${fromLng}|${toLat},${toLng}`;
  if (routeCache.has(key)) return routeCache.get(key);

  const url = `${OSRM_BASE}/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const json = await res.json();

    if (json.code !== "Ok" || !json.routes?.length) {
      throw new Error("OSRM returned no route");
    }

    const route = json.routes[0];
    const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const durationSecs = route.duration ?? null;
    const result = { coords, durationSecs };
    routeCache.set(key, result);
    return result;
  } catch {
    return { coords: [[fromLat, fromLng], [toLat, toLng]], durationSecs: null };
  }
}

/**
 * Fetch a road route and return only the [lat, lng] coordinate array.
 * Suitable for Leaflet polylines. Falls back to a straight line on failure.
 */
export async function fetchRoute(fromLat, fromLng, toLat, toLng) {
  const { coords } = await fetchRouteWithDetails(fromLat, fromLng, toLat, toLng);
  return coords;
}

/**
 * Haversine distance in metres between two positions.
 * @param {{ lat: number, lng: number }} a
 * @param {{ lat: number, lng: number }} b
 * @returns {number}
 */
export function distanceMetres(a, b) {
  const R = 6_371_000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sin2 =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(sin2), Math.sqrt(1 - sin2));
}
