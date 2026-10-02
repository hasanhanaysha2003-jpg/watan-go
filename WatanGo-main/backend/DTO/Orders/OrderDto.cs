using WatanGo.Models;

namespace WatanGo.Contracts.Orders;

public sealed class OrderDto
{
    public int Id { get; init; }
    public decimal TotalPrice { get; init; }
    public OrderStatus Status { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
    public string CustomerName { get; init; } = string.Empty;
    public string? CustomerPhone { get; init; }
    public string? DriverName { get; init; }
    public IReadOnlyList<OrderItemDto> Items { get; init; } = [];

    /// <summary>
    /// Per-restaurant preparation status slices.
    /// Empty for market-only orders (those go straight to ReadyForPickup).
    /// </summary>
    public IReadOnlyList<RestaurantOrderPartDto> RestaurantParts { get; init; } = [];

    public decimal? DriverLat { get; init; }
    public decimal? DriverLng { get; init; }
    public DateTime? DriverUpdatedAtUtc { get; init; }
    public decimal? UserLat { get; init; }
    public decimal? UserLng { get; init; }
    public DateTime? UserUpdatedAtUtc { get; init; }
}
