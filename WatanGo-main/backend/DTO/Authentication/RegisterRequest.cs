using System.ComponentModel.DataAnnotations;

namespace WatanGo.Contracts.Authentication;

public sealed class RegisterRequest
{
    [Required]
    [MinLength(2)]
    public string FullName { get; init; } = string.Empty;

    [Required]
    public string PhoneNumber { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;
}
