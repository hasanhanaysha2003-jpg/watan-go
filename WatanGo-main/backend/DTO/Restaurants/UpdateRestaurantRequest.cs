using System.ComponentModel.DataAnnotations;

namespace WatanGo.Contracts.Restaurants;

public sealed class UpdateRestaurantRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; init; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; init; }

    [Range(0, 5)]
    public decimal Rating { get; init; }

    [Range(1, 240)]
    public int DeliveryTimeMin { get; init; }

    [Range(1, 240)]
    public int DeliveryTimeMax { get; init; }

    [Range(0, 500)]
    public decimal DeliveryFee { get; init; }
}
