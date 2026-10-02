namespace WatanGo.Contracts.RideOrders;

public sealed class RideLocationSnapshotDto
{
    public int RideOrderId { get; init; }
    public decimal? DriverLat { get; init; }
    public decimal? DriverLng { get; init; }
    public DateTime? DriverUpdatedAtUtc { get; init; }
    public decimal? UserLat { get; init; }
    public decimal? UserLng { get; init; }
    public DateTime? UserUpdatedAtUtc { get; init; }
}
