export const PLATFORM_COMMISSION_RATE = 0.15;

export function isToday(value, now = new Date()) {
  if (!value) return false;
  const date = new Date(value);
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function deriveDriverStats({ rides, commerceOrders, driverOrders, workSession, now = new Date() }) {
  const todayRides = rides.filter((ride) => isToday(ride.updatedAt, now));
  const todayCommerceOrders = commerceOrders.filter((order) => isToday(order.updatedAt, now));

  const acceptedRides = todayRides.filter((ride) => isAcceptedRide(ride.status));
  const acceptedCommerceOrders = todayCommerceOrders.filter((order) => isAcceptedCommerceOrder(order.driverStatus));
  const acceptedDriverOrders = driverOrders.filter((order) => order.status === "active" || order.status === "completed");

  const breakMinutes = workSession ? getBreakMinutes(workSession, now) : 0;

  return {
    todayTripsCount: acceptedRides.length + acceptedCommerceOrders.length + acceptedDriverOrders.length,
    hasActiveRide:
      todayRides.some((ride) => ride.status === "accepted" || ride.status === "driver_assigned" || ride.status === "on_the_way") ||
      todayCommerceOrders.some((order) => order.driverStatus === "accepted" || order.driverStatus === "picked_up" || order.driverStatus === "on_the_way") ||
      driverOrders.some((order) => order.status === "active"),
    todayNetEarnings: netAfterCommission(
      acceptedRides.reduce((sum, ride) => sum + (ride.price ?? 0), 0) +
      acceptedCommerceOrders.reduce((sum, order) => sum + order.deliveryFee, 0) +
      acceptedDriverOrders.reduce((sum, order) => sum + order.price, 0),
    ),
    activeWorkingHours: workSession ? getActiveWorkingHours(workSession, breakMinutes, now) : 0,
    breakMinutes,
  };
}

function isAcceptedRide(status) {
  return status === "accepted" || status === "driver_assigned" || status === "on_the_way" || status === "completed";
}

function isAcceptedCommerceOrder(status) {
  return status === "accepted" || status === "picked_up" || status === "on_the_way" || status === "completed" || status === "delivered";
}

function netAfterCommission(amount) {
  return amount * (1 - PLATFORM_COMMISSION_RATE);
}

function getBreakMinutes(workSession, now) {
  return (workSession.breaks ?? []).reduce((sum, item) => {
    if (typeof item.minutes === "number") return sum + item.minutes;
    if (!item.endedAt) return sum;
    return sum + Math.max(0, Math.floor((new Date(item.endedAt).getTime() - new Date(item.startedAt).getTime()) / 60000));
  }, 0);
}

function getActiveWorkingHours(workSession, breakMinutes, now) {
  const end = workSession.endedAt ? new Date(workSession.endedAt) : now;
  const startedAt = new Date(workSession.startedAt);
  const workingMinutes = Math.max(0, Math.floor((end.getTime() - startedAt.getTime()) / 60000) - breakMinutes);
  return workingMinutes / 60;
}
