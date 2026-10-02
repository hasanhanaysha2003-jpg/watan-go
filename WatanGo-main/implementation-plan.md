# Implementation Plan: Real Road Routing (GPS Navigation Mode)

## Goal

Replace the straight dashed line currently drawn between pickup and destination in
`RideTrackingPage` with actual road geometry fetched from a routing API — so the
driver sees a real turn-by-turn road path on the map, not a line through the air.

---

## Routing API: OSRM Public Server

**Why OSRM:**
- Completely free, no API key required
- Uses OpenStreetMap data (same source as the existing map tiles)
- Covers Palestine/West Bank area well
- Simple REST endpoint, returns GeoJSON

**Endpoint format:**
```
GET https://router.project-osrm.org/route/v1/driving/{lng1},{lat1};{lng2},{lat2}?overview=full&geometries=geojson
```
Note: OSRM takes **longitude first**, Leaflet uses **latitude first** — must swap when converting.

**Response shape:**
```json
{
  "code": "Ok",
  "routes": [{
    "geometry": {
      "type": "LineString",
      "coordinates": [[35.123, 31.987], [35.124, 31.988], ...]
    },
    "duration": 420,
    "distance": 3200
  }]
}
```

---

## Current vs Target State

| What | Current | After |
|------|---------|-------|
| Pickup → Destination line | Straight dashed line in the air | Real road route (blue dashed) |
| Driver → Pickup route | Not shown | Real road route (green solid, live GPS) |
| Driver position updates | Marker moves | Marker moves + green route refreshes |

---

## Files to Create

### `Frontend/src/lib/routing.js` (new)

Utility module. Responsibilities:
1. Call OSRM API with two coordinate pairs
2. Parse response into `[lat, lng][]` array for Leaflet
3. Cache results in a module-level `Map` (key = `"lat1,lng1|lat2,lng2"`) to avoid
   re-fetching the same static route repeatedly
4. On any error (network, OSRM code !== "Ok", timeout) → silently return straight line
   `[[fromLat, fromLng], [toLat, toLng]]` as fallback

**Exports:**
```js
export async function fetchRoute(fromLat, fromLng, toLat, toLng)
// Returns: Promise<Array<[number, number]>>  — [[lat, lng], ...]
```

---

## Files to Modify

### `Frontend/src/features/rides/pages/RideTrackingPage.jsx`

Only the `TrackingMap` inner component changes. The page-level JSX is untouched.

#### 1. New imports
```js
import { fetchRoute } from "@/lib/routing";
```

#### 2. New refs inside TrackingMap
```js
const staticPolylineRef = useRef(null);   // pickup → destination (road)
const navPolylineRef    = useRef(null);   // driver pos → pickup (live GPS)
const lastNavPosRef     = useRef(null);   // last driverPos when nav route was fetched
const navTimerRef       = useRef(null);   // debounce timer
```

#### 3. Map init useEffect — replace straight-line polyline

Remove:
```js
polylineRef.current = L.polyline(
  [[pickupLat, pickupLng], [destLat, destLng]],
  { color: "#1976d2", weight: 2, dashArray: "8 6", opacity: 0.55 },
).addTo(map);
```

Replace with (async fetch, same useEffect):
```js
if (pickupLat && pickupLng && destLat && destLng) {
  fetchRoute(pickupLat, pickupLng, destLat, destLng).then((coords) => {
    staticPolylineRef.current = L.polyline(coords, {
      color: "#1976d2",
      weight: 3,
      dashArray: "8 6",
      opacity: 0.6,
    }).addTo(map);
  });
}
```

#### 4. New useEffect — live navigation route (driver → pickup)

Triggers whenever `driverPos` changes. Logic:
1. Skip if `driverPos` is null or map not ready
2. Debounce: clear any pending timer, set 2-second timer
3. Inside timer: check if driver has moved >100m since last fetch (Haversine)
4. If yes: call `fetchRoute(driverPos.lat, driverPos.lng, pickupLat, pickupLng)`
5. If `navPolylineRef.current` exists → call `.setLatLngs(coords)` to update in place
6. If not → create new `L.polyline` and assign to `navPolylineRef.current`
7. Update `lastNavPosRef.current = driverPos`

Style for nav route:
```js
{ color: "#4caf50", weight: 4.5, opacity: 0.9 }   // green solid — the GPS path
```

Minimum movement threshold: **100 metres** — keeps OSRM calls well under rate limits
even with continuous GPS updates.

Cleanup inside the init useEffect's return function:
```js
clearTimeout(navTimerRef.current);
```

#### 5. No changes to fitBoundsIfBoth or marker update effects

Those remain exactly as-is.

---

## Two-Route Visual Design

```
MAP LEGEND
──────────────────────────────────────────────
🟢  Green pickup dot        (נqطة الانطلاق)
🔴  Red destination dot     (الوجهة)
🔵  Blue car icon           (السائق — live)
🟠  Orange pin icon         (موقعك — live)

━━━ Green solid line  ←  Driver → Pickup (live GPS route, updates as driver moves)
- - Blue dashed line  ←  Pickup → Destination (static trip route, road geometry)
```

The driver always sees:
- Where they need to go next (green solid = the route to drive right now)
- The full trip reference (blue dashed = the complete journey)

---

## Rate-Limiting Strategy

| Condition | Frequency |
|-----------|-----------|
| Static route (pickup→dest) | Once per page load |
| Nav route fetch | Max once per 100m of driver movement + 2s debounce |
| Error/fallback | Straight line, no retry storm |

OSRM public server handles ~1 request/second. With a 100m threshold and 2s debounce
while driving, typical usage is well under 1 req/10 seconds.

---

## No Backend Changes Required

All routing is client-side via OSRM. No changes to:
- SignalR hub
- API endpoints
- Any backend models

---

## Implementation Order

1. Create `Frontend/src/lib/routing.js`
2. In `TrackingMap` — add refs
3. In `TrackingMap` — update init useEffect (async static route)
4. In `TrackingMap` — add nav route useEffect (live driver route)
5. Manual test: open tracking page for an assigned ride, confirm both polylines appear

---

## Production Note

The OSRM public demo server (router.project-osrm.org) is suitable for development and
low-traffic usage. For production with many concurrent users, consider:
- **OpenRouteService** (free tier: 2000 req/day, API key needed)
- **Self-hosted OSRM** on the same server as the backend

The routing.js module is designed so swapping the base URL is a one-line change.
