using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatanGo.Constants;
using WatanGo.Contracts.Earnings;
using WatanGo.Data;
using WatanGo.Models;

namespace WatanGo.Controllers;

[ApiController]
[Route("api/earnings")]
[Authorize(Roles = AppRoles.Driver)]
public sealed class EarningsController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public EarningsController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // ─── GET /api/earnings/my ────────────────────────────────────────────────

    /// <summary>
    /// Returns the logged-in driver's earnings summary and full history.
    /// Combines completed food/market orders and assigned ride orders.
    /// </summary>
    [HttpGet("my")]
    public async Task<IActionResult> GetMyEarnings(CancellationToken cancellationToken)
    {
        var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (driverId is null) return Unauthorized();

        var todayUtc    = DateTime.UtcNow.Date;
        var tomorrowUtc = todayUtc.AddDays(1);

        // ── Completed food / market orders ────────────────────────────────────
        var completedOrders = await _dbContext.Orders
            .Include(o => o.Items)
            .Include(o => o.User)
            .Where(o => o.DriverId == driverId && o.Status == OrderStatus.Completed)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        // ── Assigned / completed ride orders ─────────────────────────────────
        var completedRides = await _dbContext.RideOrders
            .Include(r => r.User)
            .Where(r => r.DriverId == driverId && (r.Status == "assigned" || r.Status == "completed"))
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);

        // ── Build combined earning items ──────────────────────────────────────
        var orderItems = completedOrders.Select(MapOrderToEarningItem);
        var rideItems  = completedRides.Select(MapRideToEarningItem);

        var allItems = orderItems
            .Concat(rideItems)
            .OrderByDescending(i => i.CompletedAt)
            .ToList();

        var todayItems = allItems
            .Where(i => i.CompletedAt >= todayUtc && i.CompletedAt < tomorrowUtc)
            .ToList();

        return Ok(new DriverEarningsDto
        {
            TodayTotal            = todayItems.Sum(i => i.Amount),
            AllTimeTotal          = allItems.Sum(i => i.Amount),
            TodayCompletedCount   = todayItems.Count,
            AllTimeCompletedCount = allItems.Count,
            Items                 = allItems,
        });
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private static EarningItemDto MapOrderToEarningItem(Order o) => new()
    {
        DisplayId  = $"WG-{o.Id}",
        Type       = "order",
        // Driver earns the delivery fees, not the merchandise total
        Amount     = o.Items.Sum(i => i.DeliveryFee),
        PickupFrom = o.Items
                      .Select(i => i.RestaurantName)
                      .FirstOrDefault(n => !string.IsNullOrEmpty(n)) ?? "متجر",
        DeliverTo  = o.User.FullName,
        CompletedAt = o.CreatedAt,
    };

    private static EarningItemDto MapRideToEarningItem(RideOrder r) => new()
    {
        DisplayId  = $"R-{r.Id}",
        Type       = "ride",
        Amount     = r.Price ?? 0m,
        PickupFrom = r.PickupAddress,
        DeliverTo  = r.DestinationAddress,
        CompletedAt = r.CreatedAt,
    };
}
