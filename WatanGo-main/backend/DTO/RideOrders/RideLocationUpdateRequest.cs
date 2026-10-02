namespace WatanGo.Contracts.RideOrders;

public sealed class RideLocationUpdateRequest
{
    public decimal Lat { get; init; }
    public decimal Lng { get; init; }
}
