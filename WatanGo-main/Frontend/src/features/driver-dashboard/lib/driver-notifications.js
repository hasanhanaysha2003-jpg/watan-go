import { getOrders } from "@/lib/commerce";
import { getRideOrders } from "@/lib/ride-orders";

const DRIVER_BONUSES_KEY = "watan_go_driver_bonuses";
const DRIVER_SUPPORT_MESSAGES_KEY = "watan_go_driver_support_messages";

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function isToday(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.toDateString() === new Date().toDateString();
}

function extractCity(value) {
  return value.split(/[،,]/)[0]?.trim() || value.trim();
}

function getRideStatusMessage(ride) {
  if (ride.status === "accepted" || ride.status === "driver_assigned") return `تم قبول الرحلة ${ride.id} وهي جاهزة للمتابعة.`;
  if (ride.status === "on_the_way") return `الرحلة ${ride.id} في الطريق.`;
  if (ride.status === "completed") return `تم إكمال الرحلة ${ride.id} بنجاح.`;
  return null;
}

function getOrderStatusMessage(order) {
  if (order.driverStatus === "accepted") return `تم قبول توصيل الطلب ${order.id}.`;
  if (order.driverStatus === "picked_up") return `تم استلام الطلب ${order.id}.`;
  if (order.driverStatus === "on_the_way") return `الطلب ${order.id} في الطريق إلى العميل.`;
  if (order.driverStatus === "completed" || order.driverStatus === "delivered") return `تم تسليم الطلب ${order.id} للعميل.`;
  return null;
}

export async function getDriverNotifications(driver, state) {
  const rides = state?.rides ?? getRideOrders();
  const orders = state?.orders ?? getOrders();
  const bonuses = readJson(DRIVER_BONUSES_KEY, []);
  const supportMessages = readJson(DRIVER_SUPPORT_MESSAGES_KEY, []);

  const notifications = [];

  rides
    .filter((ride) => ride.status === "pending" && isToday(ride.createdAt))
    .forEach((ride) => {
      notifications.push({ id: `nearby-ride-${ride.id}`, type: "nearby", message: `طلب جديد قريب منك في ${extractCity(ride.pickup)}`, createdAt: ride.createdAt });
    });

  orders
    .filter((order) => order.status === "ready_for_pickup" && order.driverStatus === "pending" && isToday(order.createdAt))
    .forEach((order) => {
      notifications.push({ id: `nearby-order-${order.id}`, type: "nearby", message: `طلب جاهز للاستلام من ${extractCity(order.vendorName)}`, createdAt: order.createdAt });
    });

  rides
    .filter((ride) => ride.driverPhone === driver.phone && isToday(ride.updatedAt))
    .forEach((ride) => {
      const message = getRideStatusMessage(ride);
      if (message) notifications.push({ id: `ride-status-${ride.id}-${ride.status}`, type: "status", message, createdAt: ride.updatedAt });
    });

  orders
    .filter((order) => order.driverStatus !== "pending" && isToday(order.updatedAt))
    .forEach((order) => {
      const message = getOrderStatusMessage(order);
      if (message) notifications.push({ id: `order-status-${order.id}-${order.driverStatus}`, type: "status", message, createdAt: order.updatedAt });
    });

  bonuses
    .filter((bonus) => bonus.driverPhone === driver.phone && bonus.amount > 0 && isToday(bonus.createdAt))
    .forEach((bonus) => {
      notifications.push({ id: `bonus-${bonus.id}`, type: "bonus", message: `تم إضافة حافز ${bonus.amount} شيكل لرحلتك الأخيرة`, createdAt: bonus.createdAt });
    });

  supportMessages
    .filter((msg) => msg.driverPhone === driver.phone && !msg.read && isToday(msg.createdAt))
    .forEach((msg) => {
      notifications.push({ id: `support-${msg.id}`, type: "support", message: msg.message, createdAt: msg.createdAt });
    });

  return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
