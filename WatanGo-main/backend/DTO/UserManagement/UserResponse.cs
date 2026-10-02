namespace WatanGo.Contracts.UserManagement;

public sealed class UserResponse
{
    public string Id { get; init; } = string.Empty;
    public string FullName { get; init; } = string.Empty;
    public string PhoneNumber { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }

    /// <summary>Documents uploaded for Driver / RestaurantOwner accounts. Empty for other roles.</summary>
    public List<UserDocumentResponse> Documents { get; init; } = [];
}
