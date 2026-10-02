import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  checkout,
} from "@/api/cart";

export function useCart() {
  const [cart, setCart] = useState(null); // full CartDto from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [notes, setNotes] = useState("");

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getCart();
    if (result.ok) setCart(result.data);
    else setError(result.message);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  async function handleUpdateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;
    const result = await updateCartItem(itemId, newQuantity);
    if (result.ok) setCart(result.data);
    else toast.error(result.message);
  }

  async function handleRemoveItem(itemId) {
    const result = await removeCartItem(itemId);
    if (result.ok) {
      setCart(result.data);
      toast.success("تم حذف العنصر من السلة");
    } else {
      toast.error(result.message);
    }
  }

  async function handleClearCart() {
    const result = await clearCart();
    if (result.ok) {
      setCart(result.data);
      toast.success("تم تفريغ السلة");
    } else {
      toast.error(result.message);
    }
  }

  async function handleCheckout() {
    setCheckingOut(true);
    const result = await checkout(notes.trim() || undefined);
    if (result.ok) {
      toast.success(`تم تأكيد الطلب #${result.data.id} بنجاح 🎉`);
      await fetchCart(); // cart is now empty after checkout
    } else {
      toast.error(result.message);
    }
    setCheckingOut(false);
  }

  const items = cart?.items ?? [];
  const itemsSubtotal = cart?.itemsSubtotal ?? 0;
  const deliveryFeesTotal = cart?.deliveryFeesTotal ?? 0;
  const grandTotal = cart?.grandTotal ?? 0;

  return {
    cart,
    items,
    loading,
    error,
    checkingOut,
    notes,
    setNotes,
    itemsSubtotal,
    deliveryFeesTotal,
    grandTotal,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
    handleCheckout,
    fetchCart,
  };
}
