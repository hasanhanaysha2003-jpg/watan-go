namespace WatanGo.Contracts.Cart;

public sealed class CartItemDto
{
    public int Id { get; init; }
    public int Quantity { get; init; }
    public decimal RestaurantDeliveryFee { get; init; }

    // Item details (populated from whichever side is non-null)
    public string ItemName { get; init; } = string.Empty;
    public decimal UnitPrice { get; init; }
    public string ItemType { get; init; } = string.Empty; // "restaurant" | "market"
    public string? RestaurantName { get; init; }

    // Original IDs for reference
    public int? RestaurantItemId { get; init; }
    public int? MarketItemId { get; init; }
}
