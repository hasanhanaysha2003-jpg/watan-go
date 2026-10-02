using Microsoft.AspNetCore.Identity;
using WatanGo.Constants;
using WatanGo.Models;

namespace WatanGo.Data.Seeders;

public sealed class UserSeeder(
    UserManager<ApplicationUser> userManager,
    ILogger<UserSeeder> logger) : ISeeder
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly ILogger<UserSeeder> _logger = logger;

    private record SeedUser(string PhoneNumber, string FullName, string Password, string Role);

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var seedUsers = new List<SeedUser>
        {
            // Moustafa Abdalrhman Moustafa Fayyad
            new("0595100001",  "Moustafa Fayyad",  "Admin@1234",  AppRoles.Admin),
            new("0595100002",  "Moustafa Fayyad",  "Driver@1234", AppRoles.Driver),
            new("0595100003",  "Moustafa Fayyad",  "Rest@1234",   AppRoles.RestaurantOwner),
            new("0595100004",  "Moustafa Fayyad",  "Shop@1234",   AppRoles.MarketOwner),
            new("0595100005",  "Moustafa Fayyad",  "User@1234",   AppRoles.User),

            // Hasan Azam Hasan Hanaysha
            new("0595200001",  "Hasan Hanaysha",   "Admin@1234",  AppRoles.Admin),
            new("0595200002",  "Hasan Hanaysha",   "Driver@1234", AppRoles.Driver),
            new("0595200003",  "Hasan Hanaysha",   "Rest@1234",   AppRoles.RestaurantOwner),
            new("0595200004",  "Hasan Hanaysha",   "Shop@1234",   AppRoles.MarketOwner),
            new("0595200005",  "Hasan Hanaysha",   "User@1234",   AppRoles.User),

            // Younis Sohaib Mohammad Hantoli
            new("0595300001",  "Younis Hantoli",   "Admin@1234",  AppRoles.Admin),
            new("0595300002",  "Younis Hantoli",   "Driver@1234", AppRoles.Driver),
            new("0595300003",  "Younis Hantoli",   "Rest@1234",   AppRoles.RestaurantOwner),
            new("0595300004",  "Younis Hantoli",   "Shop@1234",   AppRoles.MarketOwner),
            new("0595300005",  "Younis Hantoli",   "User@1234",   AppRoles.User),

            // Wadee Raed Sami Ghanim
            new("0595400001",  "Wadee Ghanim",     "Admin@1234",  AppRoles.Admin),
            new("0595400002",  "Wadee Ghanim",     "Driver@1234", AppRoles.Driver),
            new("0595400003",  "Wadee Ghanim",     "Rest@1234",   AppRoles.RestaurantOwner),
            new("0595400004",  "Wadee Ghanim",     "Shop@1234",   AppRoles.MarketOwner),
            new("0595400005",  "Wadee Ghanim",     "User@1234",   AppRoles.User),

            // Supervisor: Rafat Amarneh
            new("0595500001",  "Rafat Amarneh",    "Admin@1234",  AppRoles.Admin),
            new("0595500002",  "Rafat Amarneh",    "Driver@1234", AppRoles.Driver),
            new("0595500003",  "Rafat Amarneh",    "Rest@1234",   AppRoles.RestaurantOwner),
            new("0595500004",  "Rafat Amarneh",    "Shop@1234",   AppRoles.MarketOwner),
            new("0595500005",  "Rafat Amarneh",    "User@1234",   AppRoles.User),
        };

        foreach (var seed in seedUsers)
        {
            await EnsureUserAsync(seed);
        }
    }

    private async Task EnsureUserAsync(SeedUser seed)
    {
        var existing = await _userManager.FindByNameAsync(seed.PhoneNumber);

        if (existing is null)
        {
            existing = new ApplicationUser
            {
                UserName = seed.PhoneNumber,
                PhoneNumber = seed.PhoneNumber,
                FullName = seed.FullName,
                PhoneNumberConfirmed = true,
            };

            var createResult = await _userManager.CreateAsync(existing, seed.Password);
            EnsureSucceeded(createResult, $"creating '{seed.PhoneNumber}'");
        }
        else
        {
            existing.UserName = seed.PhoneNumber;
            existing.PhoneNumber = seed.PhoneNumber;
            existing.FullName = seed.FullName;
            existing.PhoneNumberConfirmed = true;

            var updateResult = await _userManager.UpdateAsync(existing);
            EnsureSucceeded(updateResult, $"updating seeded account '{seed.PhoneNumber}'");
        }

        if (!await _userManager.CheckPasswordAsync(existing, seed.Password))
        {
            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(existing);
            var passwordResult = await _userManager.ResetPasswordAsync(existing, resetToken, seed.Password);
            EnsureSucceeded(passwordResult, $"resetting password for seeded account '{seed.PhoneNumber}'");
        }

        if (!await _userManager.IsInRoleAsync(existing, seed.Role))
        {
            var addRoleResult = await _userManager.AddToRoleAsync(existing, seed.Role);
            EnsureSucceeded(addRoleResult, $"assigning role '{seed.Role}' to '{seed.PhoneNumber}'");
        }
    }

    private void EnsureSucceeded(IdentityResult result, string operationDescription)
    {
        if (result.Succeeded) return;

        var errors = string.Join("; ", result.Errors.Select(e => e.Description));
        _logger.LogError("Data seeding failed while {Operation}. Errors: {Errors}", operationDescription, errors);
        throw new InvalidOperationException($"Data seeding failed while {operationDescription}. {errors}");
    }
}
