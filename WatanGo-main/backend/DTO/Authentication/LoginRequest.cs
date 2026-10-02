using System.ComponentModel.DataAnnotations;

namespace WatanGo.Contracts.Authentication;

public sealed class LoginRequest
{
    [Required]
    public string PhoneNumber { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;
}
