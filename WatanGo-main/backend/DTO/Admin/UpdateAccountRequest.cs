using System.ComponentModel.DataAnnotations;

namespace WatanGo.Contracts.Admin;

public sealed class UpdateAccountRequest
{
    [Required]
    [MinLength(2)]
    public string FullName { get; init; } = string.Empty;

    [Required]
    public string PhoneNumber { get; init; } = string.Empty;

    public string? NewPassword { get; init; }
}
