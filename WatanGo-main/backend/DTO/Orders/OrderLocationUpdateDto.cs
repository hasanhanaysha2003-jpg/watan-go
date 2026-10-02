namespace WatanGo.Contracts.Orders;

public sealed class OrderLocationUpdateDto
{
    public int OrderId { get; init; }
    public string Role { get; init; } = string.Empty;
    public decimal Lat { get; init; }
    public decimal Lng { get; init; }
    public DateTime UpdatedAtUtc { get; init; }
}
