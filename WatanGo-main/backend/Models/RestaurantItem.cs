namespace WatanGo.Models;

public sealed class RestaurantItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public bool IsAvailable { get; set; } = true;
    public bool IsMain { get; set; } = false;

    public int RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; } = null!;
}
