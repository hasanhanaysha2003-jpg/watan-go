namespace WatanGo.Contracts.UserManagement;

public sealed class UserDocumentResponse
{
    public int Id { get; init; }
    public string OriginalName { get; init; } = string.Empty;

    /// <summary>Relative URL to access the file (e.g. /uploads/user-docs/abc123/photo.jpg).</summary>
    public string Url { get; init; } = string.Empty;
    public DateTime UploadedAt { get; init; }
}
