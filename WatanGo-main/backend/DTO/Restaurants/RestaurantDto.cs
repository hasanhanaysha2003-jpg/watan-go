namespace WatanGo.Contracts.Restaurants;

public sealed class RestaurantDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public decimal Rating { get; init; }
    public int DeliveryTimeMin { get; init; }
    public int DeliveryTimeMax { get; init; }
    public decimal DeliveryFee { get; init; }
    public string OwnerName { get; init; } = string.Empty;
    public IReadOnlyList<RestaurantItemDto> MainItems { get; init; } = [];
}
