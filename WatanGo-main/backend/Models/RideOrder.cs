namespace WatanGo.Models;

public sealed class RideOrder
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public string PickupAddress { get; set; } = string.Empty;
    public decimal? PickupLat { get; set; }
    public decimal? PickupLng { get; set; }

    public string DestinationAddress { get; set; } = string.Empty;
    public decimal? DestinationLat { get; set; }
    public decimal? DestinationLng { get; set; }

    public decimal? DistanceKm { get; set; }
    public string? DurationLabel { get; set; }
    public decimal? Price { get; set; }
    public string DeliveryType { get; set; } = string.Empty;

    public string Status { get; set; } = "pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string? DriverId { get; set; }
    public ApplicationUser? Driver { get; set; }

    public decimal? DriverLat { get; set; }
    public decimal? DriverLng { get; set; }
    public DateTime? DriverUpdatedAtUtc { get; set; }

    public decimal? UserLat { get; set; }
    public decimal? UserLng { get; set; }
    public DateTime? UserUpdatedAtUtc { get; set; }
}
