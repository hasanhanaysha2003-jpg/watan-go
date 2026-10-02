using System.ComponentModel.DataAnnotations;

namespace WatanGo.Contracts.Restaurants;

public sealed class UpdateRestaurantOrderStatusRequest
{
    [Required]
    public string Status { get; init; } = string.Empty;
}
