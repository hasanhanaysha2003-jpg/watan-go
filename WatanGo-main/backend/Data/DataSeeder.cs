using Microsoft.EntityFrameworkCore;
using WatanGo.Data.Seeders;

namespace WatanGo.Data;

public sealed class DataSeeder(
    ApplicationDbContext dbContext,
    IEnumerable<ISeeder> seeders)
{
    private readonly ApplicationDbContext _dbContext = dbContext;
    private readonly IEnumerable<ISeeder> _seeders = seeders;

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        await EnsureDatabaseReadyAsync(cancellationToken);

        foreach (var seeder in _seeders)
        {
            await seeder.SeedAsync(cancellationToken);
        }
    }

    private async Task EnsureDatabaseReadyAsync(CancellationToken cancellationToken)
    {
        var hasMigrations = _dbContext.Database.GetMigrations().Any();

        if (hasMigrations)
        {
            await _dbContext.Database.MigrateAsync(cancellationToken);
            return;
        }

        await _dbContext.Database.EnsureCreatedAsync(cancellationToken);
    }
}
