namespace WatanGo.Contracts.RideOrders;

public sealed class RideLocationUpdateDto
{
    public int RideOrderId { get; init; }
    public string Role { get; init; } = string.Empty;
    public decimal Lat { get; init; }
    public decimal Lng { get; init; }
    public DateTime UpdatedAtUtc { get; init; }
}
