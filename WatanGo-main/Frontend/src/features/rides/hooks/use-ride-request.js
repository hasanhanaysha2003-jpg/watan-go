import { useState } from "react";
import { createRideOrderRequest } from "@/api/ride-orders";
import { toast } from "sonner";

const INTERNAL_PRICE = 10;
const EXTERNAL_PRICE_PER_KM = 3;
const INTERNAL_MAX_KM = 7;

export { INTERNAL_PRICE, EXTERNAL_PRICE_PER_KM };

async function reverseGeocode(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { "Accept-Language": "ar" } },
  );
  if (!res.ok) throw new Error("network");
  const data = await res.json();
  if (!data.display_name) throw new Error("empty");
  return data.display_name
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join("، ");
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

function estimateDuration(km) {
  const minutes = Math.round((km / 30) * 60);
  if (minutes < 1) return "أقل من دقيقة";
  return `${minutes} دقيقة`;
}

const emptyLocation = {
  address: "",
  coords: null,
  loading: false,
  error: null,
};

export function useRideRequest() {
  const [pickup, setPickup] = useState(emptyLocation);
  const [destination, setDestination] = useState(emptyLocation);
  const [mapOpen, setMapOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  function hasValidCoords(coords) {
    return coords && (coords.lat !== 0 || coords.lng !== 0);
  }

  const distanceKm =
    hasValidCoords(pickup.coords) && hasValidCoords(destination.coords)
      ? haversineKm(pickup.coords, destination.coords)
      : null;

  const deliveryType =
    distanceKm !== null
      ? distanceKm <= INTERNAL_MAX_KM
        ? "internal"
        : "external"
      : null;

  const price =
    deliveryType === "internal"
      ? INTERNAL_PRICE
      : distanceKm !== null
        ? parseFloat((distanceKm * EXTERNAL_PRICE_PER_KM).toFixed(1))
        : null;

  const duration = distanceKm !== null ? estimateDuration(distanceKm) : null;

  const canConfirm =
    !!pickup.address &&
    !!destination.address &&
    !pickup.loading &&
    !destination.loading;

  async function setPickupByGPS() {
    if (!navigator.geolocation) {
      setPickup({ ...emptyLocation, error: "GPS غير مدعوم في هذا المتصفح" });
      return;
    }
    setPickup({ ...emptyLocation, loading: true });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        try {
          const address = await reverseGeocode(coords.lat, coords.lng);
          setPickup({ address, coords, loading: false, error: null });
        } catch {
          setPickup({
            address: `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
            coords,
            loading: false,
            error: null,
          });
        }
      },
      (err) => {
        const msg =
          err.code === 1
            ? "تم رفض إذن الوصول إلى الموقع"
            : err.code === 2
              ? "تعذّر تحديد الموقع — تحقق من إعدادات GPS"
              : "انتهت مهلة GPS، حاول مجدداً";
        setPickup({ ...emptyLocation, error: msg });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  }

  function setPickupFromMap(sel) {
    setPickup({
      address: sel.address,
      coords: { lat: sel.lat, lng: sel.lng },
      loading: false,
      error: null,
    });
    setMapOpen(false);
  }

  function setDestinationFromMap(sel) {
    setDestination({
      address: sel.address,
      coords: { lat: sel.lat, lng: sel.lng },
      loading: false,
      error: null,
    });
    setMapOpen(false);
    setConfirmed(false);
  }

  function clearPickup() {
    setPickup(emptyLocation);
  }

  function clearDestination() {
    setDestination(emptyLocation);
  }

  async function submitRide() {
    if (!canConfirm || submitting) return;
    setSubmitting(true);

    const result = await createRideOrderRequest({
      pickupAddress: pickup.address,
      pickupLat: pickup.coords?.lat ?? null,
      pickupLng: pickup.coords?.lng ?? null,
      destinationAddress: destination.address,
      destinationLat: destination.coords?.lat ?? null,
      destinationLng: destination.coords?.lng ?? null,
      distanceKm,
      durationLabel: duration,
      price,
      deliveryType: deliveryType ?? "external",
    });

    if (!result.ok) {
      toast.error(result.message ?? "فشل إرسال الطلب");
      setSubmitting(false);
      return;
    }

    toast.success("تم تأكيد طلب الرحلة بنجاح!", {
      description: "سيتم تعيين سائق لك قريباً.",
    });

    setConfirmed(true);
    setSubmitting(false);
    setTimeout(() => {
      setPickup(emptyLocation);
      setDestination(emptyLocation);
      setConfirmed(false);
    }, 2500);
  }

  return {
    pickup,
    destination,
    mapOpen,
    setMapOpen,
    submitting,
    confirmed,
    distanceKm,
    deliveryType,
    price,
    duration,
    canConfirm,
    setPickupByGPS,
    setPickupFromMap,
    setDestinationFromMap,
    clearPickup,
    clearDestination,
    submitRide,
    INTERNAL_PRICE,
    EXTERNAL_PRICE_PER_KM,
  };
}
