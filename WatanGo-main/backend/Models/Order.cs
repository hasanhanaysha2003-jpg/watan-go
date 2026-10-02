namespace WatanGo.Models;

public sealed class Order
{
    public int Id { get; set; }
    public decimal TotalPrice { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    /// <summary>Driver who accepted and is delivering this order. Null until a driver claims it.</summary>
    public string? DriverId { get; set; }
    public ApplicationUser? Driver { get; set; }

    public ICollection<OrderItem> Items { get; set; } = [];

    /// <summary>
    /// One row per distinct restaurant present in the order.
    /// Empty for market-only orders.
    /// </summary>
    public ICollection<RestaurantOrderPart> RestaurantParts { get; set; } = [];

    public decimal? DriverLat { get; set; }
    public decimal? DriverLng { get; set; }
    public DateTime? DriverUpdatedAtUtc { get; set; }

    public decimal? UserLat { get; set; }
    public decimal? UserLng { get; set; }
    public DateTime? UserUpdatedAtUtc { get; set; }
}
