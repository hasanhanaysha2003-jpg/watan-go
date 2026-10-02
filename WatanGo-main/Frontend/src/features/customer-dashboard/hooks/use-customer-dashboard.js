import { useEffect, useState } from "react";
import { getMyOrders, getMyRides } from "@/api/customer-dashboard";

export function useCustomerDashboard() {
  const [activities, setActivities] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [type, setTypeState] = useState("orders");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      setError(null);

      const params = { page, pageSize };
      const result = type === "orders"
        ? await getMyOrders(params)
        : await getMyRides(params);

      if (result.ok) {
        setActivities(mapItems(type, result.data.items));
        setTotalPages(result.data.totalPages);
      } else {
        setError(result.message);
      }
      setLoading(false);
    }
    fetch();
  }, [type, page]);

  function setType(newType) {
    setTypeState(newType);
    setPage(1);
  }

  return {
    activities,
    totalPages,
    loading,
    error,
    type,
    setType,
    page,
    setPage,
    pageSize,
  };
}

function mapItems(type, items) {
  // الترتيب يتم من الباك (OrderByDescending CreatedAt) — لا حاجة لإعادة ترتيب هنا

  if (type === "orders") {
    return items.map((o) => ({
      type: "order",
      id: o.id,
      status: o.status,
      createdAt: o.createdAt,
      totalPrice: o.totalPrice,
      itemCount: o.items?.length ?? 0,
      restaurantName:
        o.items?.find((i) => i.itemType === "restaurant")?.restaurantName ?? null,
    }));
  }
  return items.map((r) => ({
    type: "ride",
    id: r.id,
    status: r.status,
    createdAt: r.createdAt,
    pickupAddress: r.pickupAddress,
    destinationAddress: r.destinationAddress,
    distanceKm: r.distanceKm,
    price: r.price,
    driverName: r.driverName,
    deliveryType: r.deliveryType,
  }));
}
