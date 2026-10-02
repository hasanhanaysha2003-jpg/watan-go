namespace WatanGo.Contracts.Market;

public sealed class MarketItemDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public decimal Price { get; init; }
    public decimal Rating { get; init; }
    public int Quantity { get; init; }
}
