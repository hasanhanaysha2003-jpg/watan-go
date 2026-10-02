namespace WatanGo.Contracts.Earnings;

public sealed class DriverEarningsDto
{
    public decimal TodayTotal            { get; init; }
    public decimal AllTimeTotal          { get; init; }
    public int     TodayCompletedCount   { get; init; }
    public int     AllTimeCompletedCount { get; init; }
    public IReadOnlyList<EarningItemDto> Items { get; init; } = [];
}
