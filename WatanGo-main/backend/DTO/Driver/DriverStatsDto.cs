namespace WatanGo.Contracts.Driver;

/// <summary>
/// Returned by GET /api/driver/stats.
/// Powers the three home-page stat cards:
///   رحلات اليوم  |  أرباح اليوم  |  التقييم
/// </summary>
public sealed class DriverStatsDto
{
    /// <summary>Number of ride orders assigned to this driver today (UTC).</summary>
    public int TodayRidesCount { get; init; }

    /// <summary>
    /// Total earnings from today's assigned rides.
    /// When a "completed" status is introduced, update the filter accordingly.
    /// </summary>
    public decimal TodayEarnings { get; init; }

    /// <summary>Average star rating (1–5) across all received ratings. 0 when no ratings exist.</summary>
    public decimal AverageRating { get; init; }

    /// <summary>Total number of ratings received from customers.</summary>
    public int RatingCount { get; init; }
}
