namespace WatanGo.Contracts.Orders;

public sealed class OrderItemDto
{
    public int Id { get; init; }
    public int Quantity { get; init; }
    public string ItemName { get; init; } = string.Empty;
    public decimal UnitPrice { get; init; }
    public decimal DeliveryFee { get; init; }
    public string ItemType { get; init; } = string.Empty;
    public string? RestaurantName { get; init; }
    public decimal LineTotal { get; init; } // (UnitPrice × Quantity)
}
