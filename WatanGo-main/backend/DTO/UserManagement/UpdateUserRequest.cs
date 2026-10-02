using System.ComponentModel.DataAnnotations;

namespace WatanGo.Contracts.UserManagement;

public sealed class UpdateUserRequest
{
    [Required]
    [MinLength(2)]
    public string FullName { get; init; } = string.Empty;

    [Required]
    public string PhoneNumber { get; init; } = string.Empty;

    /// <summary>Leave null or empty to keep the current password.</summary>
    public string? NewPassword { get; init; }

    /// <summary>Leave null or empty to keep the current role.</summary>
    public string? NewRole { get; init; }
}
