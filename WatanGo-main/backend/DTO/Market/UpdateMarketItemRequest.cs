using System.ComponentModel.DataAnnotations;

namespace WatanGo.Contracts.Market;

public sealed class UpdateMarketItemRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; init; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; init; }

    [Range(0, 10000)]
    public decimal Price { get; init; }

    [Range(0, 5)]
    public decimal Rating { get; init; }

    [Range(0, int.MaxValue)]
    public int Quantity { get; init; }
}
