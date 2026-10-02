namespace WatanGo.Contracts.Orders;

public sealed class OrderLocationUpdateRequest
{
    public decimal Lat { get; init; }
    public decimal Lng { get; init; }
}
