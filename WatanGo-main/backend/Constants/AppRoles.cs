namespace WatanGo.Constants;

public static class AppRoles
{
    public const string Admin = "Admin";
    public const string User = "User";
    public const string Driver = "Driver";
    public const string RestaurantOwner = "RestaurantOwner";
    public const string MarketOwner = "MarketOwner";

    public static readonly IReadOnlyList<string> All = [Admin, User, Driver, RestaurantOwner, MarketOwner];

    public static readonly IReadOnlyList<string> AdminManaged = [Driver, RestaurantOwner, MarketOwner];
}