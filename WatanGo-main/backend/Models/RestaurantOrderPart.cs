namespace WatanGo.Models;

/// <summary>
/// Represents one restaurant's slice of an order.
/// One row is created per distinct restaurant at checkout.
/// The restaurant owner advances this part's status independently;
/// when every part reaches ReadyForPickup the parent Order is promoted.
/// </summary>
public sealed class RestaurantOrderPart
{
    public int Id { get; set; }

    /// <summary>Snapshot of the restaurant name captured at checkout time.</summary>
    public string RestaurantName { get; set; } = string.Empty;

    /// <summary>Per-restaurant preparation status.</summary>
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public int RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; } = null!;
}
