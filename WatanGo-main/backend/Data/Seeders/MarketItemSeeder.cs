using Microsoft.EntityFrameworkCore;
using WatanGo.Models;

namespace WatanGo.Data.Seeders;

public sealed class MarketItemSeeder(
    ApplicationDbContext dbContext,
    ILogger<MarketItemSeeder> logger) : ISeeder
{
    private readonly ApplicationDbContext _dbContext = dbContext;
    private readonly ILogger<MarketItemSeeder> _logger = logger;

    private record SeedItem(string Name, string Description, decimal Price, decimal Rating, int Quantity);

    private static readonly SeedItem[] Items =
    [
        // بقالة
        new("أرز بسمتي 1 كغ",        "أرز طويل الحبة",                12m, 4.5m, 80),
        new("خبز عربي",               "كيس خبز طازج",                   4m, 4.6m, 120),
        new("حليب طازج 1 لتر",       "حليب يومي كامل الدسم",            6m, 4.8m, 90),
        new("زيت زيتون بكر 750مل",   "زيت زيتون فلسطيني أصيل",         35m, 4.9m, 50),
        new("بيض بلدي 12 حبة",       "بيض طازج من مزارع محلية",        14m, 4.9m, 65),

        // خضار وفواكه
        new("بندورة",                 "كيلو بندورة بلدية",               5m, 4.4m, 60),
        new("تفاح أحمر",              "كيلو تفاح طازج",                  9m, 4.7m, 45),
        new("موز",                    "كيلو موز طازج",                   7m, 4.3m, 50),
        new("خيار",                   "كيلو خيار طازج",                  4m, 4.1m, 55),

        // ألبان
        new("جبنة بيضاء 250غ",       "جبنة طازجة قليلة الملح",         16m, 4.7m, 60),
        new("لبن زبادي 500غ",        "زبادي طبيعي كامل الدسم",          8m, 4.6m, 55),

        // منزلية
        new("شامبو عائلي",            "عبوة 400 مل",                    18m, 4.2m, 0),
        new("مناديل ورقية 200 ورقة",  "مناديل ناعمة متعددة الاستخدام",   9m, 4.3m, 50),
        new("مسحوق غسيل 1 كغ",       "مسحوق تنظيف قوي للملابس",        22m, 4.0m, 40),
    ];

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var hasAny = await _dbContext.MarketItems.AnyAsync(cancellationToken);
        if (hasAny)
            return;

        var items = Items.Select(i => new MarketItem
        {
            Name = i.Name,
            Description = i.Description,
            Price = i.Price,
            Rating = i.Rating,
            Quantity = i.Quantity,
        }).ToList();

        _dbContext.MarketItems.AddRange(items);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} market items.", items.Count);
    }
}
