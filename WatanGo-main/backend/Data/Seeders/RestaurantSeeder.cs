using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WatanGo.Models;

namespace WatanGo.Data.Seeders;

public sealed class RestaurantSeeder(
    ApplicationDbContext dbContext,
    UserManager<ApplicationUser> userManager,
    ILogger<RestaurantSeeder> logger) : ISeeder
{
    private readonly ApplicationDbContext _dbContext = dbContext;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly ILogger<RestaurantSeeder> _logger = logger;

    private record SeedItem(string Name, decimal Price, bool IsMain = false);

    private record SeedRestaurant(
        string Name,
        string Description,
        decimal Rating,
        int DeliveryTimeMin,
        int DeliveryTimeMax,
        decimal DeliveryFee,
        string OwnerPhone,
        SeedItem[] Items);

    private static readonly SeedRestaurant[] Restaurants =
    [
        // شاورما
        new(
            Name: "شاورما الطازج",
            Description: "تحضير سريع ومكونات يومية طازجة مع عروض للطلاب",
            Rating: 4.5m,
            DeliveryTimeMin: 15, DeliveryTimeMax: 25,
            DeliveryFee: 3m,
            OwnerPhone: "0595100003",
            Items:
            [
                new("سندويش شاورما دجاج", 18m, IsMain: true),
                new("بوكس شاورما",         30m, IsMain: true),
                new("صحن دبل شاورما",      42m, IsMain: true),
                new("شاورما لحم",           22m),
                new("ثلاثية شاورما",        55m),
                new("بطاطا مقلية",          8m),
            ]),

        new(
            Name: "شاورما البلد",
            Description: "نكهة شامية مع تتبيلة تقليدية وخيارات عائلية",
            Rating: 4.6m,
            DeliveryTimeMin: 25, DeliveryTimeMax: 35,
            DeliveryFee: 4m,
            OwnerPhone: "0595100003",
            Items:
            [
                new("وجبة شاورما لحم",    38m, IsMain: true),
                new("شاورما سوبر",         45m, IsMain: true),
                new("صحن عربي دجاج",       40m, IsMain: true),
                new("سندويش شاورما عادي",  16m),
                new("شاورما مشكلة",        50m),
                new("مشروبات",              6m),
            ]),

        new(
            Name: "شاورما الريم",
            Description: "شاورما دجاج ولحم مع صوصات خاصة وخبز طازج يومياً",
            Rating: 4.8m,
            DeliveryTimeMin: 20, DeliveryTimeMax: 30,
            DeliveryFee: 5m,
            OwnerPhone: "0595100003",
            Items:
            [
                new("وجبة شاورما دجاج",    35m, IsMain: true),
                new("ساندويش شاورما عربي", 20m, IsMain: true),
                new("صحن شاورما",           40m, IsMain: true),
                new("شاورما بالخبز",        16m),
                new("طبق مشاركة",           65m),
                new("عصير طازج",             8m),
            ]),

        // برجر
        new(
            Name: "كرانشي برجر",
            Description: "وجبات دجاج مقرمش وبرجر لحم بطبقات مميزة",
            Rating: 4.9m,
            DeliveryTimeMin: 18, DeliveryTimeMax: 28,
            DeliveryFee: 7m,
            OwnerPhone: "0595200003",
            Items:
            [
                new("سبايسي كرانشي", 32m, IsMain: true),
                new("تشيز كرانشي",   28m, IsMain: true),
                new("بوكس برجر",     55m, IsMain: true),
                new("كرانشي عادي",   25m),
                new("بطاطا كرانشي",  12m),
                new("ويدجز",          10m),
            ]),

        new(
            Name: "برجر هاوس",
            Description: "مطعم برجر شبابي مع إضافات عديدة وحجمين للوجبات",
            Rating: 4.4m,
            DeliveryTimeMin: 25, DeliveryTimeMax: 35,
            DeliveryFee: 5m,
            OwnerPhone: "0595200003",
            Items:
            [
                new("هاوس برجر",   30m, IsMain: true),
                new("مشروم برجر",  35m, IsMain: true),
                new("بطاطا ويدجز", 12m, IsMain: true),
                new("كلاسيك برجر", 22m),
                new("دبل برجر",    45m),
                new("بصل حلقات",   10m),
            ]),

        new(
            Name: "برجر تاون",
            Description: "برجر مشوي وصوصات خاصة وخيارات بطاطا مميزة",
            Rating: 4.7m,
            DeliveryTimeMin: 20, DeliveryTimeMax: 30,
            DeliveryFee: 6m,
            OwnerPhone: "0595200003",
            Items:
            [
                new("كلاسيك برجر",      25m, IsMain: true),
                new("تشيز برجر",        30m, IsMain: true),
                new("كرسي تشيكن برجر", 28m, IsMain: true),
                new("تشيكن برجر",       26m),
                new("دبل تشيز",         40m),
                new("صوص خاص",           5m),
            ]),

        // مشاوي
        new(
            Name: "مطعم الساحة",
            Description: "مطعم عائلي يقدم مشاوي وأطباق عربية متنوعة",
            Rating: 4.6m,
            DeliveryTimeMin: 25, DeliveryTimeMax: 35,
            DeliveryFee: 5m,
            OwnerPhone: "0595300003",
            Items:
            [
                new("أوصال لحم",          65m, IsMain: true),
                new("نصف دجاج على الفحم", 45m, IsMain: true),
                new("تبولة",              18m, IsMain: true),
                new("مشاوي مشكلة",        80m),
                new("خبز طابون",           8m),
                new("حمص",                15m),
            ]),

        new(
            Name: "مشاوي الشام",
            Description: "نكهات شامية أصلية مع خبز طابون طازج",
            Rating: 4.7m,
            DeliveryTimeMin: 28, DeliveryTimeMax: 38,
            DeliveryFee: 6m,
            OwnerPhone: "0595300003",
            Items:
            [
                new("كفتة بالصينية", 50m, IsMain: true),
                new("شيش لحم",       60m, IsMain: true),
                new("حمص وصنوبر",    20m, IsMain: true),
                new("شيش طاووق",     45m),
                new("كباب حلبي",     55m),
                new("فتوش",          15m),
            ]),

        new(
            Name: "مشاوي الكرم",
            Description: "مشاوي فحم طازجة وأطباق عائلية وسلطات شرقية",
            Rating: 4.8m,
            DeliveryTimeMin: 30, DeliveryTimeMax: 40,
            DeliveryFee: 8m,
            OwnerPhone: "0595300003",
            Items:
            [
                new("كباب مشوي",   55m, IsMain: true),
                new("شيش طاووق",   50m, IsMain: true),
                new("مشكل مشاوي", 85m, IsMain: true),
                new("نصف دجاج",    40m),
                new("أوصال كرم",   70m),
                new("سلطة شرقية",  18m),
            ]),

        // حلويات
        new(
            Name: "سويت هاوس",
            Description: "حلويات غربية وشرقية وصناديق هدايا جاهزة",
            Rating: 4.5m,
            DeliveryTimeMin: 25, DeliveryTimeMax: 35,
            DeliveryFee: 5m,
            OwnerPhone: "0595400003",
            Items:
            [
                new("تشيز كيك",        28m, IsMain: true),
                new("بسبوسة بالقشطة",  15m, IsMain: true),
                new("صندوق ميني سويت", 65m, IsMain: true),
                new("براونيز",          22m),
                new("مافن",             18m),
                new("كنافة غربية",      25m),
            ]),

        new(
            Name: "كنافة البلد",
            Description: "متخصص بالكنافة النابلسية والحلويات الساخنة",
            Rating: 4.8m,
            DeliveryTimeMin: 15, DeliveryTimeMax: 20,
            DeliveryFee: 3m,
            OwnerPhone: "0595400003",
            Items:
            [
                new("كنافة ناعمة",    22m, IsMain: true),
                new("كنافة خشنة",     22m, IsMain: true),
                new("قهوة عربية",      8m, IsMain: true),
                new("بقلاوة",          18m),
                new("معمول",           12m),
                new("حلاوة بالطحينة", 15m),
            ]),

        new(
            Name: "حلويات زمان",
            Description: "حلويات شرقية يومية وكنافة طازجة وقهوة عربية",
            Rating: 4.9m,
            DeliveryTimeMin: 20, DeliveryTimeMax: 30,
            DeliveryFee: 4m,
            OwnerPhone: "0595400003",
            Items:
            [
                new("كنافة نابلسية", 25m, IsMain: true),
                new("قطايف",          20m, IsMain: true),
                new("بسبوسة",         15m, IsMain: true),
                new("عوامة",          12m),
                new("زنود الست",      18m),
                new("أرز بالحليب",   14m),
            ]),

        // شاورما - Moustafa Fayyad (0595100003) - 2 extra
        new(
            Name: "شاورما الأصيل",
            Description: "شاورما مشوية على الفحم بتتبيلة سرية ومكونات طازجة",
            Rating: 4.7m,
            DeliveryTimeMin: 20, DeliveryTimeMax: 30,
            DeliveryFee: 4m,
            OwnerPhone: "0595100003",
            Items:
            [
                new("شاورما فحم دجاج",  24m, IsMain: true),
                new("شاورما فحم لحم",   28m, IsMain: true),
                new("وجبة عائلية",      70m, IsMain: true),
                new("صحن مزة",           20m),
                new("خبز طابون",          6m),
                new("مشروب بارد",         5m),
            ]),

        new(
            Name: "بيت الشاورما",
            Description: "وجبات متنوعة وساندويشات بأحجام مختلفة تناسب الجميع",
            Rating: 4.6m,
            DeliveryTimeMin: 15, DeliveryTimeMax: 25,
            DeliveryFee: 3m,
            OwnerPhone: "0595100003",
            Items:
            [
                new("ميني شاورما",       12m, IsMain: true),
                new("جمبو شاورما",       28m, IsMain: true),
                new("صحن شاورما مشكل",   50m, IsMain: true),
                new("بطاطا حارة",         9m),
                new("صوص ثوم",            4m),
                new("كولا 500مل",          5m),
            ]),

        // برجر - Hasan Hanaysha (0595200003) - 2 extra
        new(
            Name: "سمارت برجر",
            Description: "برجر عصري بمكونات مختارة وصوصات محلية الصنع",
            Rating: 4.6m,
            DeliveryTimeMin: 22, DeliveryTimeMax: 32,
            DeliveryFee: 6m,
            OwnerPhone: "0595200003",
            Items:
            [
                new("سمارت كلاسيك",    28m, IsMain: true),
                new("دبل تشيز سمارت",  42m, IsMain: true),
                new("وجبة كومبو",       55m, IsMain: true),
                new("تشيكن فيليه",      30m),
                new("أونيون رينجز",     10m),
                new("ميلك شيك",         15m),
            ]),

        new(
            Name: "فايف ستارز برجر",
            Description: "برجر بريميوم بلحم طازج ومكونات متنوعة وخدمة سريعة",
            Rating: 4.8m,
            DeliveryTimeMin: 20, DeliveryTimeMax: 30,
            DeliveryFee: 8m,
            OwnerPhone: "0595200003",
            Items:
            [
                new("ستار برجر",         35m, IsMain: true),
                new("فايف تشيكن",        30m, IsMain: true),
                new("بوكس فاميلي",       90m, IsMain: true),
                new("ناجتس 6 قطع",       18m),
                new("بطاطا كريمي",       12m),
                new("بيبسي كبير",         7m),
            ]),

        // مشاوي - Younis Hantoli (0595300003) - 2 extra
        new(
            Name: "مشاوي الجليل",
            Description: "مشاوي ريفية فاخرة مع خبز طابون طازج وسلطات تقليدية",
            Rating: 4.5m,
            DeliveryTimeMin: 30, DeliveryTimeMax: 45,
            DeliveryFee: 7m,
            OwnerPhone: "0595300003",
            Items:
            [
                new("دجاج مشوي كامل",   55m, IsMain: true),
                new("كباب جليل",         60m, IsMain: true),
                new("تشريب لحم",         65m, IsMain: true),
                new("سلطة جرجير",        15m),
                new("مجدرة",              18m),
                new("لبن بالخيار",        10m),
            ]),

        new(
            Name: "فحم ونار",
            Description: "متخصص بالمشاوي الفحمية الحارة مع توابل خاصة",
            Rating: 4.7m,
            DeliveryTimeMin: 25, DeliveryTimeMax: 35,
            DeliveryFee: 6m,
            OwnerPhone: "0595300003",
            Items:
            [
                new("كباب حار مشوي",    50m, IsMain: true),
                new("أجنحة فحم",         40m, IsMain: true),
                new("صحن مشاوي مشكل",   80m, IsMain: true),
                new("صلصة حارة",           5m),
                new("خبز مرقوق",           8m),
                new("شاي أحمر",            5m),
            ]),

        // حلويات - Wadee Ghanim (0595400003) - 2 extra
        new(
            Name: "قمر الدين",
            Description: "حلويات شامية وشرقية أصيلة محضّرة بوصفات قديمة",
            Rating: 4.6m,
            DeliveryTimeMin: 20, DeliveryTimeMax: 30,
            DeliveryFee: 4m,
            OwnerPhone: "0595400003",
            Items:
            [
                new("هريسة شامية",       18m, IsMain: true),
                new("مهلبية بالمكسرات", 20m, IsMain: true),
                new("صندوق حلويات",      80m, IsMain: true),
                new("ملبس لوز",           25m),
                new("غريبة",              15m),
                new("قهوة تركية",          7m),
            ]),

        new(
            Name: "حلو وبس",
            Description: "تشكيلة حديثة من الحلويات الغربية والكيكات المنزلية",
            Rating: 4.5m,
            DeliveryTimeMin: 25, DeliveryTimeMax: 35,
            DeliveryFee: 5m,
            OwnerPhone: "0595400003",
            Items:
            [
                new("رد فيلفيت",        32m, IsMain: true),
                new("كب كيك 6 قطع",    28m, IsMain: true),
                new("تارت الفواكه",     25m, IsMain: true),
                new("كوكيز شوكولاطة",  20m),
                new("ميني دونات",       15m),
                new("لاتيه بارد",        12m),
            ]),

        // فطور
        new(
            Name: "مناقيش زمان",
            Description: "مخبوزات فرن طازجة مع خيارات جبنة وزعتر ومحمرات",
            Rating: 4.8m,
            DeliveryTimeMin: 20, DeliveryTimeMax: 30,
            DeliveryFee: 4m,
            OwnerPhone: "0595500003",
            Items:
            [
                new("منقوشة جبنة",    12m, IsMain: true),
                new("منقوشة زعتر",     8m, IsMain: true),
                new("محمرة وجبنة",    14m, IsMain: true),
                new("فطيرة بالسبانخ", 15m),
                new("أرغفة مشكلة",    18m),
                new("عصير طازج",        8m),
            ]),

        new(
            Name: "فطور الصباح",
            Description: "ساندويشات صباحية وبيض ومخبوزات خفيفة",
            Rating: 4.4m,
            DeliveryTimeMin: 18, DeliveryTimeMax: 28,
            DeliveryFee: 3m,
            OwnerPhone: "0595500003",
            Items:
            [
                new("بيض مقلي",            12m, IsMain: true),
                new("ساندويش لبنة وزعتر", 10m, IsMain: true),
                new("شاي نعناع",            6m, IsMain: true),
                new("فول بالزيت",          14m),
                new("حمص وفلافل",          18m),
                new("جبنة بيضاء",          10m),
            ]),

        new(
            Name: "بيت الفطور",
            Description: "فطور عربي صباحي مع مناقيش وفلافل طازجة",
            Rating: 4.7m,
            DeliveryTimeMin: 15, DeliveryTimeMax: 25,
            DeliveryFee: 4m,
            OwnerPhone: "0595500003",
            Items:
            [
                new("حمص وفلافل",        18m, IsMain: true),
                new("مناقيش زعتر",       10m, IsMain: true),
                new("فول بالزيت",         14m, IsMain: true),
                new("بيض عيون",           12m),
                new("لبنة مع زيت زيتون", 16m),
                new("شاي بالنعناع",        6m),
            ]),

        // فطور - Rafat Amarneh (0595500003) - 2 extra
        new(
            Name: "صباح الخير",
            Description: "أشهى وجبات الفطور الصباحي في أجواء هادئة ودافئة",
            Rating: 4.6m,
            DeliveryTimeMin: 20, DeliveryTimeMax: 30,
            DeliveryFee: 4m,
            OwnerPhone: "0595500003",
            Items:
            [
                new("طبق فطور كامل",     28m, IsMain: true),
                new("بيض بالجبنة",        15m, IsMain: true),
                new("منقوشة محمرة",       12m, IsMain: true),
                new("لبنة وزيتون",         10m),
                new("قشطة وعسل",           14m),
                new("قهوة عربية",           6m),
            ]),

        new(
            Name: "فرن الحارة",
            Description: "مخبوزات فرن حجري يومية مع مناقيش وفطائر محلية الصنع",
            Rating: 4.8m,
            DeliveryTimeMin: 15, DeliveryTimeMax: 25,
            DeliveryFee: 3m,
            OwnerPhone: "0595500003",
            Items:
            [
                new("كعك بالسمسم",        10m, IsMain: true),
                new("فطيرة جبنة وعجوة",   14m, IsMain: true),
                new("رغيف طابون كبير",    12m, IsMain: true),
                new("منقوشة زعتر وجبنة",  14m),
                new("بريك تونة",            16m),
                new("شاي بالميرمية",         6m),
            ]),
    ];

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        foreach (var seed in Restaurants)
        {
            await EnsureRestaurantAsync(seed, cancellationToken);
        }
    }

    private async Task EnsureRestaurantAsync(SeedRestaurant seed, CancellationToken cancellationToken)
    {
        var exists = await _dbContext.Restaurants
            .AnyAsync(r => r.Name == seed.Name, cancellationToken);

        if (exists)
            return;

        var owner = await _userManager.FindByNameAsync(seed.OwnerPhone);
        if (owner is null)
        {
            _logger.LogWarning("Skipping restaurant '{Name}': owner '{Phone}' not found.", seed.Name, seed.OwnerPhone);
            return;
        }

        var restaurant = new Restaurant
        {
            Name = seed.Name,
            Description = seed.Description,
            Rating = seed.Rating,
            DeliveryTimeMin = seed.DeliveryTimeMin,
            DeliveryTimeMax = seed.DeliveryTimeMax,
            DeliveryFee = seed.DeliveryFee,
            OwnerId = owner.Id,
            Items = seed.Items.Select(i => new RestaurantItem
            {
                Name = i.Name,
                Price = i.Price,
                IsMain = i.IsMain,
                IsAvailable = true,
            }).ToList(),
        };

        _dbContext.Restaurants.Add(restaurant);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded restaurant '{Name}'.", seed.Name);
    }
}
