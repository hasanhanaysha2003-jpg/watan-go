namespace WatanGo.Models;

public sealed class OrderItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }

    /// <summary>Snapshot of item name at checkout time.</summary>
    public string ItemName { get; set; } = string.Empty;

    /// <summary>Snapshot of unit price at checkout time.</summary>
    public decimal UnitPrice { get; set; }

    /// <summary>
    /// Delivery fee contribution of this item's restaurant.
    /// Zero for market items (one restaurant's fee is stored once per distinct restaurant).
    /// </summary>
    public decimal DeliveryFee { get; set; }

    /// <summary>"restaurant" or "market"</summary>
    public string ItemType { get; set; } = string.Empty;

    /// <summary>Name of the restaurant, null for market items.</summary>
    public string? RestaurantName { get; set; }

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
}
