namespace WatanGo.Contracts.Driver;

/// <summary>
/// Full payload returned by GET /api/driver/dashboard.
/// Powers the home page stat cards and the "طلبات رحلات جديدة" list.
/// </summary>
public sealed class DriverDashboardDto
{
    // ── Stat cards ─────────────────────────────────────────────────────────

    /// <summary>Number of ride orders assigned to this driver today.</summary>
    public int TodayRidesCount { get; init; }

    /// <summary>Sum of earnings (Price) from today's assigned rides.</summary>
    public decimal TodayEarnings { get; init; }

    /// <summary>Average star rating across all received ratings (0 if none).</summary>
    public decimal AverageRating { get; init; }

    /// <summary>Total number of ratings received.</summary>
    public int RatingCount { get; init; }

    // ── Pending ride requests ───────────────────────────────────────────────

    /// <summary>
    /// All ride orders that are still pending (Status = "pending", no driver assigned).
    /// The driver can accept or skip each one.
    /// </summary>
    public IReadOnlyList<PendingRideDto> PendingOrders { get; init; } = [];
}
