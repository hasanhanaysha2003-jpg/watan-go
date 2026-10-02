/**
 * commerce.ts — Legacy stub
 *
 * All cart and order logic has been moved to the backend.
 * - Cart:   POST/GET/PUT/DELETE /api/cart  (see src/api/cart.js)
 * - Orders: GET/PUT              /api/orders (see src/api/cart.js)
 *
 * This file only retains the types and mock grocery data that the
 * legacy dashboard .tsx files still reference until they are migrated.
 */

// ─── Types (kept for legacy dashboard compatibility) ──────────────────────────

export type CartItemType = "food" | "grocery";

export type OrderStatus = "pending" | "processing" | "delivered" | "cancelled";

export interface CartItem {
  id: string;
  type: CartItemType;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  vendorId: string;
  vendorName: string;
}

export interface Order {
  id: string;
  vendorId: string;
  vendorName: string;
  type: CartItemType;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  status: OrderStatus;
  driverStatus:
    | "pending"
    | "accepted"
    | "picked_up"
    | "on_the_way"
    | "completed"
    | "delivered";
  driverName?: string;
  driverPhone?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface GroceryItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
  storeId: string;
  storeName: string;
  rating: number;
  inStock: boolean;
  isPopular: boolean;
  isNew: boolean;
}

// ─── Mock grocery data (legacy – used by admin dashboard only) ────────────────

export const groceryItems: GroceryItem[] = [
  {
    id: "milk-1l",
    category: "بقالة",
    name: "حليب طازج 1 لتر",
    description: "حليب يومي كامل الدسم",
    price: 6,
    image: "🥛",
    storeId: "city-market",
    storeName: "ماركت المدينة",
    rating: 4.8,
    inStock: true,
    isPopular: true,
    isNew: false,
  },
  {
    id: "bread",
    category: "بقالة",
    name: "خبز عربي",
    description: "كيس خبز طازج",
    price: 4,
    image: "🥖",
    storeId: "city-market",
    storeName: "ماركت المدينة",
    rating: 4.6,
    inStock: true,
    isPopular: true,
    isNew: false,
  },
  {
    id: "eggs",
    category: "بقالة",
    name: "بيض بلدي 12 حبة",
    description: "بيض طازج من مزارع محلية",
    price: 14,
    image: "🥚",
    storeId: "city-market",
    storeName: "ماركت المدينة",
    rating: 4.9,
    inStock: true,
    isPopular: true,
    isNew: false,
  },
];

// ─── No-op stubs (legacy routes still import these; they do nothing) ──────────

/** @deprecated Cart is now managed by the backend. Do not use. */
export function getCartItems(): CartItem[] {
  return [];
}

/** @deprecated Cart is now managed by the backend. Do not use. */
export function getCartCount(): number {
  return 0;
}

/** @deprecated Cart is now managed by the backend. Do not use. */
export function subscribeToCart(_listener: () => void): () => void {
  return () => {};
}

/** @deprecated Orders are now managed by the backend. Do not use. */
export function getOrders(): Order[] {
  return [];
}

/** @deprecated Orders are now managed by the backend. Do not use. */
export function saveOrders(_orders: Order[]): void {}

/** @deprecated Orders are now managed by the backend. Do not use. */
export function subscribeToOrders(_listener: () => void): () => void {
  return () => {};
}

/** @deprecated Orders are now managed by the backend. Do not use. */
export function updateOrderStatus(
  _orderId: string,
  _status: OrderStatus,
): void {}

/** @deprecated Orders are now managed by the backend. Do not use. */
export function updateDriverStatus(
  _orderId: string,
  _driverStatus: Order["driverStatus"],
): void {}

/** @deprecated Orders are now managed by the backend. Do not use. */
export function normalizeOrderStatus(status: OrderStatus): OrderStatus {
  return status;
}

/** @deprecated Orders are now managed by the backend. Do not use. */
export function normalizeDriverStatus(
  status: Order["driverStatus"],
): Order["driverStatus"] {
  return status;
}
