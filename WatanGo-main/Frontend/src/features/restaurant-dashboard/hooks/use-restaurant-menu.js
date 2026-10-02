import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getRestaurantItems,
  createRestaurantItem,
  updateRestaurantItem,
  deleteRestaurantItem,
} from "@/api/restaurant-items";
import { useSelectedRestaurant } from "../context/SelectedRestaurantContext";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  isAvailable: true,
  isMain: false,
};

export function useRestaurantMenu() {
  const { selectedId } = useSelectedRestaurant();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchItems = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const result = await getRestaurantItems(id);
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setItems(result.data);
  };

  // Re-fetch items whenever the selected restaurant changes
  useEffect(() => {
    setItems([]);
    fetchItems(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const refreshItems = () => fetchItems(selectedId);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    setForm({
      name: item.name,
      description: item.description ?? "",
      price: String(item.price),
      isAvailable: item.isAvailable,
      isMain: item.isMain,
    });
    setEditingId(item.id);
    setIsFormOpen(true);
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveMeal = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim()) {
      toast.error("أدخل اسم الصنف والسعر أولاً");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      isAvailable: form.isAvailable,
      isMain: form.isMain,
    };

    if (editingId) {
      const result = await updateRestaurantItem(selectedId, editingId, payload);
      if (!result.ok) {
        toast.error(result.message);
        setSaving(false);
        return;
      }
      toast.success("تم تعديل الصنف");
    } else {
      const result = await createRestaurantItem(selectedId, payload);
      if (!result.ok) {
        toast.error(result.message);
        setSaving(false);
        return;
      }
      toast.success("تمت إضافة الصنف");
    }

    await refreshItems();
    resetForm();
    setSaving(false);
  };

  const deleteItem = async (id) => {
    const result = await deleteRestaurantItem(selectedId, id);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("تم حذف الصنف");
    await refreshItems();
  };

  return {
    items,
    loading,
    error,
    saving,
    form,
    editingId,
    isFormOpen,
    handleFieldChange,
    openAddForm,
    openEditForm,
    saveMeal,
    deleteItem,
    resetForm,
  };
}
