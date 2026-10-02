import { useEffect, useState } from "react";
import {
  getOrders,
  subscribeToOrders,
  updateOrderStatus,
} from "@/lib/commerce";

export function useShopOrders() {
  const [orders, setOrders] = useState([]);

  const refresh = () =>
    setOrders(getOrders().filter((order) => order.type === "grocery"));

  const setStatus = (id, status) => {
    updateOrderStatus(id, status);
    refresh();
  };

  useEffect(() => {
    refresh();
    return subscribeToOrders(refresh);
  }, []);

  return {
    orders,
    setStatus,
    newOrders:       orders.filter((o) => o.status === "pending"),
    preparingOrders: orders.filter(
      (o) => o.status === "accepted" || o.status === "preparing",
    ),
    readyOrders:     orders.filter((o) => o.status === "ready_for_pickup"),
    rejectedOrders:  orders.filter((o) => o.status === "cancelled"),
    completedOrders: orders.filter(
      (o) => o.status === "completed" || o.status === "delivered",
    ),
  };
}
