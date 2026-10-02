const DRIVER_STATUS_KEY = "watan_go_driver_status";
const DRIVER_STATUS_EVENT = "watan-go-driver-status-updated";

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function emitDriverStatusUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(DRIVER_STATUS_EVENT));
}

export function getDriverStatus(phone) {
  const statuses = readJson(DRIVER_STATUS_KEY, {});
  return statuses[phone] ?? "online";
}

export function updateDriverAvailabilityStatus(phone, status) {
  const statuses = readJson(DRIVER_STATUS_KEY, {});
  writeJson(DRIVER_STATUS_KEY, { ...statuses, [phone]: status });
  emitDriverStatusUpdated();
  return { ok: true, status };
}

export function subscribeToDriverStatus(listener) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(DRIVER_STATUS_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(DRIVER_STATUS_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
