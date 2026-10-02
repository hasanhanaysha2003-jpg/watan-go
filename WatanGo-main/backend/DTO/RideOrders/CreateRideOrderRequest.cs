using System.ComponentModel.DataAnnotations;

namespace WatanGo.Contracts.RideOrders;

public sealed class CreateRideOrderRequest
{
    [Required]
    [MaxLength(500)]
    public string PickupAddress { get; init; } = string.Empty;

    public decimal? PickupLat { get; init; }
    public decimal? PickupLng { get; init; }

    [Required]
    [MaxLength(500)]
    public string DestinationAddress { get; init; } = string.Empty;

    public decimal? DestinationLat { get; init; }
    public decimal? DestinationLng { get; init; }

    public decimal? DistanceKm { get; init; }

    [MaxLength(50)]
    public string? DurationLabel { get; init; }

    public decimal? Price { get; init; }

    [Required]
    [MaxLength(20)]
    public string DeliveryType { get; init; } = string.Empty;
}
