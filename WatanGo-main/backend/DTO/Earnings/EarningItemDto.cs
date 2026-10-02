namespace WatanGo.Contracts.Earnings;

public sealed class EarningItemDto
{
    public string  DisplayId   { get; init; } = string.Empty;
    public string  Type        { get; init; } = string.Empty; // "order" | "ride"
    public decimal Amount      { get; init; }
    public string  PickupFrom  { get; init; } = string.Empty;
    public string  DeliverTo   { get; init; } = string.Empty;
    public DateTime CompletedAt { get; init; }
}
