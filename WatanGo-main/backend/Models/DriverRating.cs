namespace WatanGo.Models;

public sealed class DriverRating
{
    public int Id { get; set; }

    // The driver being rated
    public string DriverId { get; set; } = string.Empty;
    public ApplicationUser Driver { get; set; } = null!;

    // The customer who left the rating
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    // The ride this rating belongs to (optional link)
    public int? RideOrderId { get; set; }
    public RideOrder? RideOrder { get; set; }

    /// <summary>1 – 5 stars</summary>
    public int Stars { get; set; }

    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
