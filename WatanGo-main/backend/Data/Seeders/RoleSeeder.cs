using Microsoft.AspNetCore.Identity;
using WatanGo.Constants;

namespace WatanGo.Data.Seeders;

public sealed class RoleSeeder(
    RoleManager<IdentityRole> roleManager,
    ILogger<RoleSeeder> logger) : ISeeder
{
    private readonly RoleManager<IdentityRole> _roleManager = roleManager;
    private readonly ILogger<RoleSeeder> _logger = logger;

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        foreach (var roleName in AppRoles.All)
        {
            if (await _roleManager.RoleExistsAsync(roleName))
                continue;

            var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
            EnsureSucceeded(result, $"creating role '{roleName}'");
        }
    }

    private void EnsureSucceeded(IdentityResult result, string operationDescription)
    {
        if (result.Succeeded)
            return;

        var errors = string.Join("; ", result.Errors.Select(e => e.Description));
        _logger.LogError("Data seeding failed while {Operation}. Errors: {Errors}", operationDescription, errors);
        throw new InvalidOperationException($"Data seeding failed while {operationDescription}. {errors}");
    }
}
