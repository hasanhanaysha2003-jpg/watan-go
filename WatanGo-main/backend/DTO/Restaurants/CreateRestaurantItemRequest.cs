using System.ComponentModel.DataAnnotations;

namespace WatanGo.Contracts.Restaurants;

public sealed class CreateRestaurantItemRequest
{
    [Required, MaxLength(200)]
    public string Name { get; init; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; init; }

    [Range(0, 10000)]
    public decimal Price { get; init; }

    public bool IsAvailable { get; init; } = true;

    public bool IsMain { get; init; }
}
