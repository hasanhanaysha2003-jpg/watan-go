namespace WatanGo.Models;

/// <summary>
/// Represents a single document image uploaded for a Driver or RestaurantOwner account.
/// </summary>
public sealed class UserDocument
{
    public int Id { get; set; }

    /// <summary>Foreign key → ApplicationUser.Id</summary>
    public string UserId { get; set; } = string.Empty;

    /// <summary>The file name as stored on disk (e.g. "a3f1c2d4.jpg").</summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>The original file name the admin uploaded.</summary>
    public string OriginalName { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation ───────────────────────────────────────────────────────────
    public ApplicationUser User { get; set; } = null!;
}
