namespace WatanGo.Contracts.Restaurants;

public sealed class RestaurantItemDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public decimal Price { get; init; }
    public bool IsAvailable { get; init; }
    public bool IsMain { get; init; }
}
