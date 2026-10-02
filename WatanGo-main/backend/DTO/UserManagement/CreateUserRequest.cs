using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace WatanGo.Contracts.UserManagement;

/// <summary>
/// Sent as multipart/form-data so that document images can be attached alongside the user fields.
/// </summary>
public sealed class CreateUserRequest
{
    [Required]
    [MinLength(2)]
    public string FullName { get; init; } = string.Empty;

    [Required]
    public string PhoneNumber { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;

    [Required]
    public string Role { get; init; } = string.Empty;

    /// <summary>
    /// One or more identity-document images (required for Driver / RestaurantOwner).
    /// The property name "Documents" must match the form-data field name sent by the client.
    /// </summary>
    public IFormFileCollection? Documents { get; init; }
}
