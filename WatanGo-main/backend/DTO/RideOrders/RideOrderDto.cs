namespace WatanGo.Contracts.RideOrders;

public sealed class RideOrderDto
{
    public int Id { get; init; }
    public string PickupAddress { get; init; } = string.Empty;
    public decimal? PickupLat { get; init; }
    public decimal? PickupLng { get; init; }
    public string DestinationAddress { get; init; } = string.Empty;
    public decimal? DestinationLat { get; init; }
    public decimal? DestinationLng { get; init; }
    public decimal? DistanceKm { get; init; }
    public string? DurationLabel { get; init; }
    public decimal? Price { get; init; }
    public string DeliveryType { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public string? DriverName { get; init; }

    public decimal? DriverLat { get; init; }
    public decimal? DriverLng { get; init; }
    public DateTime? DriverUpdatedAtUtc { get; init; }

    public decimal? UserLat { get; init; }
    public decimal? UserLng { get; init; }
    public DateTime? UserUpdatedAtUtc { get; init; }
}
