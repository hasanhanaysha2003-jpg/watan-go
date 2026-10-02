using Microsoft.AspNetCore.Identity;
using WatanGo.Constants;
using WatanGo.Models;

namespace WatanGo.Data.Seeders;

/// <summary>
/// Seeds demo ratings for the first driver (أحمد سالم) so the
/// dashboard home page shows a realistic average of 4.3 / 4 reviews.
/// </summary>
public sealed class DriverRatingSeeder(
    ApplicationDbContext dbContext,
    UserManager<ApplicationUser> userManager,
    ILogger<DriverRatingSeeder> logger) : ISeeder
{
    private readonly ApplicationDbContext _dbContext = dbContext;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly ILogger<DriverRatingSeeder> _logger = logger;

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        // Only seed if the table is empty — avoids duplicate rows on restart
        if (_dbContext.DriverRatings.Any())
        {
            _logger.LogInformation("DriverRating table already seeded — skipping.");
            return;
        }

        // The driver we want to seed ratings for
        var driver = await _userManager.FindByNameAsync("0591000001"); // أحمد سالم
        if (driver is null)
        {
            _logger.LogWarning("Driver '0591000001' not found — skipping DriverRating seed.");
            return;
        }

        // Customers who leave the reviews (must already exist)
        var user1 = await _userManager.FindByNameAsync("0594000001"); // علي عمر
        var user2 = await _userManager.FindByNameAsync("0594000002"); // سارة أحمد

        if (user1 is null || user2 is null)
        {
            _logger.LogWarning("Seed users not found — skipping DriverRating seed.");
            return;
        }

        // (5 + 5 + 4 + 3) / 4 = 4.25 → rounded AwayFromZero = 4.3 ✓
        var ratings = new List<DriverRating>
        {
            new()
            {
                DriverId  = driver.Id,
                UserId    = user1.Id,
                Stars     = 5,
                Comment   = "سائق محترم ووصل الطلب بسرعة.",
                CreatedAt = new DateTime(2026, 4, 29, 0, 0, 0, DateTimeKind.Utc),
            },
            new()
            {
                DriverId  = driver.Id,
                UserId    = user2.Id,
                Stars     = 5,
                Comment   = "تواصل ممتاز والتسليم كان مرتب.",
                CreatedAt = new DateTime(2026, 4, 29, 0, 0, 0, DateTimeKind.Utc),
            },
            new()
            {
                DriverId  = driver.Id,
                UserId    = user1.Id,
                Stars     = 4,
                Comment   = "جيد، التوصيل كان في الوقت المناسب.",
                CreatedAt = new DateTime(2026, 4, 28, 0, 0, 0, DateTimeKind.Utc),
            },
            new()
            {
                DriverId  = driver.Id,
                UserId    = user2.Id,
                Stars     = 3,
                Comment   = "مقبول، يحتاج بعض التحسين.",
                CreatedAt = new DateTime(2026, 4, 27, 0, 0, 0, DateTimeKind.Utc),
            },
        };

        _dbContext.DriverRatings.AddRange(ratings);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} driver ratings.", ratings.Count);
    }
}
