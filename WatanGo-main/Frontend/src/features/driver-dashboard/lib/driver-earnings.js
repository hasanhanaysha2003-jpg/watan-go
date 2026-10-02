import { isToday } from "./driver-stats";

export function getDailyDriverEarnings({ driverPhone, rides, orders, now = new Date() }) {
  const rideItems = rides
    .filter((ride) =>
      ride.driverPhone === driverPhone &&
      ride.status === "completed" &&
      isToday(ride.completedAt ?? ride.updatedAt, now),
    )
    .map((ride) => ({
      id: ride.id,
      type: "ride",
      pickup: ride.pickup,
      destination: ride.destination,
      fare: Number(ride.price ?? 0),
      completedAt: ride.completedAt ?? ride.updatedAt,
    }));

  const deliveryItems = orders
    .filter((order) =>
      order.driverPhone === driverPhone &&
      (order.status === "completed" || order.status === "delivered" || order.driverStatus === "completed" || order.driverStatus === "delivered") &&
      isToday(order.completedAt ?? order.updatedAt, now),
    )
    .map((order) => ({
      id: order.id,
      type: "delivery",
      pickup: order.vendorName,
      destination: order.deliveryAddress,
      fare: Number(order.deliveryFee || order.total || 0),
      completedAt: order.completedAt ?? order.updatedAt,
    }));

  const items = [...rideItems, ...deliveryItems].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  );

  return {
    totalEarnings: items.reduce((sum, item) => sum + item.fare, 0),
    completedCount: items.length,
    items,
  };
}
