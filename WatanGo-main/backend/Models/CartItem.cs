namespace WatanGo.Models;

public sealed class CartItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }

    /// <summary>
    /// Snapshot of the restaurant delivery fee at the time this item was added.
    /// Zero for market items.
    /// </summary>
    public decimal RestaurantDeliveryFee { get; set; }

    public int CartId { get; set; }
    public Cart Cart { get; set; } = null!;

    // Exactly one of the two below is non-null
    public int? RestaurantItemId { get; set; }
    public RestaurantItem? RestaurantItem { get; set; }

    public int? MarketItemId { get; set; }
    public MarketItem? MarketItem { get; set; }
}
