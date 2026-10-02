namespace WatanGo.Contracts.Cart;

public sealed class CartDto
{
    public int Id { get; init; }
    public DateTime CreatedAt { get; init; }
    public IReadOnlyList<CartItemDto> Items { get; init; } = [];

    /// <summary>Sum of (UnitPrice × Quantity) for all items.</summary>
    public decimal ItemsSubtotal { get; init; }

    /// <summary>Sum of one DeliveryFee per distinct restaurant in the cart.</summary>
    public decimal DeliveryFeesTotal { get; init; }

    /// <summary>ItemsSubtotal + DeliveryFeesTotal.</summary>
    public decimal GrandTotal { get; init; }
}
