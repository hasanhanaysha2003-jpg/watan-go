namespace WatanGo.Contracts.Driver;

/// <summary>
/// A ride order that is still pending (no driver assigned yet).
/// Shown in the "طلبات رحلات جديدة" section of the driver dashboard.
/// </summary>
public sealed class PendingRideDto
{
    public int Id { get; init; }

    /// <summary>Human-friendly display ID, e.g. "WG-2408".</summary>
    public string DisplayId { get; init; } = string.Empty;

    public string CustomerName { get; init; } = string.Empty;

    public string PickupAddress { get; init; } = string.Empty;
    public string DestinationAddress { get; init; } = string.Empty;

    public decimal? DistanceKm { get; init; }
    public string? DurationLabel { get; init; }
    public decimal? Price { get; init; }
    public string DeliveryType { get; init; } = string.Empty;

    public DateTime CreatedAt { get; init; }
}
