using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatanGo.Constants;
using WatanGo.Contracts.Driver;
using WatanGo.Data;
using WatanGo.Models;

namespace WatanGo.Controllers;

[ApiController]
[Route("api/driver")]
[Authorize(Roles = AppRoles.Driver)]
public sealed class DriverController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public DriverController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // ─── GET /api/driver/stats ────────────────────────────────────────────
    /// <summary>
    /// Returns the three home-page stat cards for the logged-in driver:
    ///   • رحلات اليوم  (today's rides count)
    ///   • أرباح اليوم  (today's earnings)
    ///   • التقييم      (average rating + review count)
    /// </summary>
    [HttpGet("stats")]
    public async Task<ActionResult<DriverStatsDto>> GetStats(CancellationToken cancellationToken)
    {
        var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (driverId is null) return Unauthorized();

        var todayUtc    = DateTime.UtcNow.Date;
        var tomorrowUtc = todayUtc.AddDays(1);

        // ── Today's rides & earnings ──────────────────────────────────────
        var todayRides = await _dbContext.RideOrders
            .Where(r =>
                r.DriverId == driverId &&
                r.CreatedAt >= todayUtc &&
                r.CreatedAt < tomorrowUtc)
            .ToListAsync(cancellationToken);

        var todayRidesCount = todayRides.Count;

        var todayRideEarnings = todayRides
            .Where(r => r.Status is "assigned" or "completed")
            .Sum(r => r.Price ?? 0m);

        // Also include delivery fees from completed food/market orders today
        var todayOrderEarnings = await _dbContext.Orders
            .Where(o =>
                o.DriverId  == driverId &&
                o.Status    == OrderStatus.Completed &&
                o.CreatedAt >= todayUtc &&
                o.CreatedAt <  tomorrowUtc)
            .SelectMany(o => o.Items)
            .SumAsync(i => i.DeliveryFee, cancellationToken);

        var todayEarnings = todayRideEarnings + todayOrderEarnings;

        // ── Rating ────────────────────────────────────────────────────────
        var stars = await _dbContext.DriverRatings
            .Where(r => r.DriverId == driverId)
            .Select(r => r.Stars)
            .ToListAsync(cancellationToken);

        var ratingCount   = stars.Count;
        var averageRating = ratingCount > 0
            ? Math.Round((decimal)stars.Average(), 1, MidpointRounding.AwayFromZero)
            : 0m;

        return Ok(new DriverStatsDto
        {
            TodayRidesCount = todayRidesCount,
            TodayEarnings   = todayEarnings,
            AverageRating   = averageRating,
            RatingCount     = ratingCount,
        });
    }

    // ─── GET /api/driver/pending-orders ──────────────────────────────────
    /// <summary>
    /// Returns all ride orders that are still pending (not yet claimed by any driver).
    /// These are the cards shown in the "طلبات رحلات جديدة" section.
    /// The driver can call PUT /api/ride-orders/{id}/assign to accept one.
    /// </summary>
    [HttpGet("pending-orders")]
    public async Task<ActionResult<IReadOnlyList<PendingRideDto>>> GetPendingOrders(
        CancellationToken cancellationToken)
    {
        var pendingOrders = await _dbContext.RideOrders
            .Include(r => r.User)
            .Where(r => r.Status == "pending")
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new PendingRideDto
            {
                Id                 = r.Id,
                DisplayId          = "WG-" + r.Id,
                CustomerName       = r.User.FullName,
                PickupAddress      = r.PickupAddress,
                DestinationAddress = r.DestinationAddress,
                DistanceKm         = r.DistanceKm,
                DurationLabel      = r.DurationLabel,
                Price              = r.Price,
                DeliveryType       = r.DeliveryType,
                CreatedAt          = r.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(pendingOrders);
    }

    // ─── GET /api/driver/ratings ─────────────────────────────────────────
    /// <summary>
    /// Returns all ratings the logged-in driver has received from customers.
    /// Used by the "التقييمات" (Ratings) page.
    /// </summary>
    [HttpGet("ratings")]
    public async Task<ActionResult<IReadOnlyList<DriverRatingItemDto>>> GetRatings(
        CancellationToken cancellationToken)
    {
        var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (driverId is null) return Unauthorized();

        var ratings = await _dbContext.DriverRatings
            .Include(r => r.User)
            .Where(r => r.DriverId == driverId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new DriverRatingItemDto
            {
                Id           = r.Id,
                CustomerName = r.User.FullName,
                Stars        = r.Stars,
                Comment      = r.Comment,
                CreatedAt    = r.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(ratings);
    }

    // ─── GET /api/driver/my-rides ─────────────────────────────────────────
    /// <summary>
    /// Returns all ride orders ever assigned to the logged-in driver,
    /// newest first. Supports optional status filter and pagination.
    /// Used by the "الطلبات" (Orders) tab-list page.
    /// </summary>
    [HttpGet("my-rides")]
    public async Task<IActionResult> GetMyRides(
        [FromQuery] string? status,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (driverId is null) return Unauthorized();

        if (page < 1) page = 1;
        if (pageSize is < 1 or > 50) pageSize = 10;

        var query = _dbContext.RideOrders
            .Include(r => r.User)
            .Where(r => r.DriverId == driverId)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(r => r.Status == status);

        var total = await query.CountAsync(cancellationToken);

        var rides = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new PendingRideDto          // reuses the same shape
            {
                Id                 = r.Id,
                DisplayId          = "WG-" + r.Id,
                CustomerName       = r.User.FullName,
                PickupAddress      = r.PickupAddress,
                DestinationAddress = r.DestinationAddress,
                DistanceKm         = r.DistanceKm,
                DurationLabel      = r.DurationLabel,
                Price              = r.Price,
                DeliveryType       = r.DeliveryType,
                CreatedAt          = r.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(new
        {
            items      = rides,
            totalCount = total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling((double)total / pageSize),
        });
    }
}
