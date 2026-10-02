namespace WatanGo.Models;

public sealed class Restaurant
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Rating { get; set; }
    public int DeliveryTimeMin { get; set; }
    public int DeliveryTimeMax { get; set; }
    public decimal DeliveryFee { get; set; }

    public string OwnerId { get; set; } = string.Empty;
    public ApplicationUser Owner { get; set; } = null!;

    public ICollection<RestaurantItem> Items { get; set; } = [];

    /// <summary>Parts of orders that include this restaurant's items.</summary>
    public ICollection<RestaurantOrderPart> OrderParts { get; set; } = [];
}
