namespace WatanGo.Models;

public sealed class Cart
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public ICollection<CartItem> Items { get; set; } = [];
}
