using Microsoft.AspNetCore.Identity;

namespace WatanGo.Models;

public sealed class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;

    /// <summary>UTC timestamp when this account was created.</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Restaurant> Restaurants { get; set; } = [];
    public ICollection<RideOrder> RideOrders { get; set; } = [];
    public ICollection<Order> Orders { get; set; } = [];
    public Cart? Cart { get; set; }

    /// <summary>Ratings this driver has received from customers.</summary>
    /// <summary>Orders this driver has accepted for delivery.</summary>
    public ICollection<Order> AssignedOrders { get; set; } = [];

    /// <summary>Ratings this driver has received from customers.</summary>
    public ICollection<DriverRating> ReceivedRatings { get; set; } = [];

    /// <summary>Ratings this user has given to drivers.</summary>
    public ICollection<DriverRating> GivenRatings { get; set; } = [];

    /// <summary>Identity documents uploaded by the admin for Driver / RestaurantOwner accounts.</summary>
    public ICollection<UserDocument> Documents { get; set; } = [];
}
