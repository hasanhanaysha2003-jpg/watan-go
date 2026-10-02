using WatanGo.Models;

namespace WatanGo.Contracts.Orders;

public sealed class RestaurantOrderPartDto
{
    public int Id { get; init; }
    public int RestaurantId { get; init; }
    public string RestaurantName { get; init; } = string.Empty;
    public OrderStatus Status { get; init; }
}
