namespace WatanGo.Contracts.Cart;

public sealed class AddCartItemRequest
{
    /// <summary>Set this for restaurant items. Leave null for market items.</summary>
    public int? RestaurantItemId { get; init; }

    /// <summary>Set this for market items. Leave null for restaurant items.</summary>
    public int? MarketItemId { get; init; }

    public int Quantity { get; init; } = 1;
}
