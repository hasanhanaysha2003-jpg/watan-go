namespace WatanGo.Contracts.Driver;

/// <summary>
/// One rating entry returned by GET /api/driver/ratings.
/// Normalized to match the frontend RatingDetails component shape.
/// </summary>
public sealed class DriverRatingItemDto
{
    public int Id { get; init; }

    /// <summary>Full name of the customer who left the rating.</summary>
    public string CustomerName { get; init; } = string.Empty;

    /// <summary>1 – 5 stars.</summary>
    public int Stars { get; init; }

    public string? Comment { get; init; }

    public DateTime CreatedAt { get; init; }
}
