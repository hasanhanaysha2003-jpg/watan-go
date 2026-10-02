using System.ComponentModel.DataAnnotations;
using WatanGo.Constants;

namespace WatanGo.Contracts.Admin;

public sealed class CreateAccountRequest
{
    [Required]
    [MinLength(2)]
    public string FullName { get; init; } = string.Empty;

    [Required]
    public string PhoneNumber { get; init; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; init; } = string.Empty;

    [Required]
    public string Role { get; init; } = string.Empty;
}
