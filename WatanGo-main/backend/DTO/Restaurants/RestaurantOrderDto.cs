namespace WatanGo.Contracts.Restaurants;

public sealed class RestaurantOrderDto
{
    public int Id { get; init; }
    public decimal TotalPrice { get; init; }
    public string Status { get; init; } = string.Empty;
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
    public string CustomerName { get; init; } = string.Empty;
    public string? DriverName { get; init; }
    public IReadOnlyList<RestaurantOrderItemDto> Items { get; init; } = [];
}

public sealed class RestaurantOrderItemDto
{
    public string ItemName { get; init; } = string.Empty;
    public decimal UnitPrice { get; init; }
    public int Quantity { get; init; }
}
