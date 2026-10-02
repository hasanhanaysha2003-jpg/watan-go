using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatanGo.Constants;
using WatanGo.Contracts;
using WatanGo.Contracts.RideOrders;
using WatanGo.Data;
using WatanGo.Hubs;
using WatanGo.Models;

namespace WatanGo.Controllers;

[ApiController]
[Route("api/ride-orders")]
public sealed class RideOrderController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IHubContext<RideTrackingHub> _hubContext;

    public RideOrderController(ApplicationDbContext dbContext, IHubContext<RideTrackingHub> hubContext)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
    }

    [HttpPost]
    [Authorize(Roles = AppRoles.User)]
    public async Task<IActionResult> Create(
        [FromBody] CreateRideOrderRequest request,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();

        var order = new RideOrder
        {
            UserId = userId,
            PickupAddress = request.PickupAddress,
            PickupLat = request.PickupLat,
            PickupLng = request.PickupLng,
            DestinationAddress = request.DestinationAddress,
            DestinationLat = request.DestinationLat,
            DestinationLng = request.DestinationLng,
            DistanceKm = request.DistanceKm,
            DurationLabel = request.DurationLabel,
            Price = request.Price,
            DeliveryType = request.DeliveryType,
            Status = "pending",
            CreatedAt = DateTime.UtcNow,
        };

        _dbContext.RideOrders.Add(order);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, MapToDto(order));
    }

    [HttpGet("my")]
    [Authorize(Roles = AppRoles.User)]
    public async Task<IActionResult> GetMy(
        [FromQuery] string? status = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();

        if (page < 1) page = 1;
        if (pageSize is < 1 or > 50) pageSize = 10;

        var query = _dbContext.RideOrders
            .Include(r => r.Driver)
            .Where(r => r.UserId == userId);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(r => r.Status == status);

        var total = await query.CountAsync(cancellationToken);

        var rides = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return Ok(new PagedResponse<RideOrderDto>
        {
            Items = [..rides.Select(MapToDto)],
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)total / pageSize),
        });
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole(AppRoles.Admin);
        var isDriver = User.IsInRole(AppRoles.Driver);

        var order = await _dbContext.RideOrders
            .Include(r => r.Driver)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (order is null)
            return NotFound(new { message = "الطلب غير موجود" });

        if (!isAdmin && !isDriver && order.UserId != userId)
            return Forbid();

        return Ok(MapToDto(order));
    }

    [HttpGet]
    [Authorize(Roles = AppRoles.Admin + "," + AppRoles.Driver)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? status,
        CancellationToken cancellationToken)
    {
        var query = _dbContext.RideOrders
            .Include(r => r.User)
            .Include(r => r.Driver)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(r => r.Status == status);

        var orders = await query
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => MapToDto(r))
            .ToListAsync(cancellationToken);

        return Ok(orders);
    }

    // ─── PUT /api/ride-orders/{id}/assign (Driver) ───────────────────────────

    /// <summary>
    /// Atomically assigns the ride to the requesting driver.
    /// The UPDATE includes the WHERE Status="pending" AND DriverId IS NULL guard,
    /// so concurrent requests from multiple drivers produce exactly one winner —
    /// the others get 0 rows affected and receive 409 Conflict.
    /// </summary>
    [HttpPut("{id:int}/assign")]
    [Authorize(Roles = AppRoles.Driver)]
    public async Task<IActionResult> AssignDriver(int id, CancellationToken cancellationToken)
    {
        var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (driverId is null) return Unauthorized();

        // Single atomic UPDATE WHERE — no separate SELECT needed.
        // Only succeeds if the ride is still pending and unclaimed.
        var affected = await _dbContext.RideOrders
            .Where(r => r.Id == id && r.Status == "pending" && r.DriverId == null)
            .ExecuteUpdateAsync(s => s
                .SetProperty(r => r.DriverId, driverId)
                .SetProperty(r => r.Status, "assigned"),
                cancellationToken);

        if (affected == 0)
        {
            var exists = await _dbContext.RideOrders
                .AnyAsync(r => r.Id == id, cancellationToken);

            return exists
                ? Conflict(new { message = "تم قبول هذا الطلب من قِبَل سائق آخر بالفعل" })
                : NotFound(new { message = "الطلب غير موجود" });
        }

        return NoContent();
    }

    // ─── PUT /api/ride-orders/{id}/complete (Driver) ──────────────────────────

    /// <summary>
    /// Driver marks their assigned ride as completed.
    /// The WHERE clause ties the update to the requesting driver AND the "assigned"
    /// status, so the transition is strictly one-way: pending → assigned → completed.
    /// </summary>
    [HttpPut("{id:int}/complete")]
    [Authorize(Roles = AppRoles.Driver)]
    public async Task<IActionResult> CompleteRide(int id, CancellationToken cancellationToken)
    {
        var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (driverId is null) return Unauthorized();

        var affected = await _dbContext.RideOrders
            .Where(r => r.Id == id && r.DriverId == driverId && r.Status == "assigned")
            .ExecuteUpdateAsync(s => s
                .SetProperty(r => r.Status, "completed"),
                cancellationToken);

        if (affected == 0)
        {
            var order = await _dbContext.RideOrders
                .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

            if (order is null)       return NotFound(new { message = "الطلب غير موجود" });
            if (order.DriverId != driverId) return Forbid();
            return BadRequest(new { message = "لا يمكن إكمال هذا الطلب في حالته الحالية" });
        }

        return NoContent();
    }

    // ─── GET /api/ride-orders/{id}/location ───────────────────────────────

    [HttpGet("{id:int}/location")]
    [Authorize(Roles = AppRoles.User + "," + AppRoles.Driver)]
    public async Task<IActionResult> GetLocation(int id, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var order = await _dbContext.RideOrders
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (order is null)
            return NotFound(new { message = "الطلب غير موجود" });

        if (!IsLocationParticipant(order, userId, User))
            return Forbid();

        if (order.Status != "assigned")
            return BadRequest(new { message = "لا يمكن عرض الموقع في حالة الطلب الحالية" });

        return Ok(MapLocationSnapshot(order));
    }

    // ─── PUT /api/ride-orders/{id}/location ───────────────────────────────

    [HttpPut("{id:int}/location")]
    [Authorize(Roles = AppRoles.User + "," + AppRoles.Driver)]
    public async Task<IActionResult> UpdateLocation(
        int id,
        [FromBody] RideLocationUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var order = await _dbContext.RideOrders
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (order is null)
            return NotFound(new { message = "الطلب غير موجود" });

        if (order.Status != "assigned")
            return BadRequest(new { message = "لا يمكن تحديث الموقع في حالة الطلب الحالية" });

        var isDriver = User.IsInRole(AppRoles.Driver) && order.DriverId == userId;
        var isUser = User.IsInRole(AppRoles.User) && order.UserId == userId;

        if (!isDriver && !isUser)
            return Forbid();

        var updatedAtUtc = DateTime.UtcNow;

        if (isDriver)
        {
            order.DriverLat = request.Lat;
            order.DriverLng = request.Lng;
            order.DriverUpdatedAtUtc = updatedAtUtc;
        }
        else
        {
            order.UserLat = request.Lat;
            order.UserLng = request.Lng;
            order.UserUpdatedAtUtc = updatedAtUtc;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        var update = new RideLocationUpdateDto
        {
            RideOrderId = order.Id,
            Role = isDriver ? "driver" : "user",
            Lat = request.Lat,
            Lng = request.Lng,
            UpdatedAtUtc = updatedAtUtc,
        };

        await _hubContext.Clients
            .Group(RideTrackingHub.GetGroupName(order.Id))
            .SendAsync("LocationUpdated", update, cancellationToken);

        return Ok(update);
    }

    private static RideOrderDto MapToDto(RideOrder r) => new()
    {
        Id = r.Id,
        PickupAddress = r.PickupAddress,
        PickupLat = r.PickupLat,
        PickupLng = r.PickupLng,
        DestinationAddress = r.DestinationAddress,
        DestinationLat = r.DestinationLat,
        DestinationLng = r.DestinationLng,
        DistanceKm = r.DistanceKm,
        DurationLabel = r.DurationLabel,
        Price = r.Price,
        DeliveryType = r.DeliveryType,
        Status = r.Status,
        CreatedAt = r.CreatedAt,
        DriverName = r.Driver?.FullName,
        DriverLat = r.DriverLat,
        DriverLng = r.DriverLng,
        DriverUpdatedAtUtc = r.DriverUpdatedAtUtc,
        UserLat = r.UserLat,
        UserLng = r.UserLng,
        UserUpdatedAtUtc = r.UserUpdatedAtUtc,
    };

    private static bool IsLocationParticipant(RideOrder order, string userId, ClaimsPrincipal user)
    {
        var isDriver = user.IsInRole(AppRoles.Driver) && order.DriverId == userId;
        var isUser = user.IsInRole(AppRoles.User) && order.UserId == userId;

        return isDriver || isUser;
    }

    private static RideLocationSnapshotDto MapLocationSnapshot(RideOrder order) => new()
    {
        RideOrderId = order.Id,
        DriverLat = order.DriverLat,
        DriverLng = order.DriverLng,
        DriverUpdatedAtUtc = order.DriverUpdatedAtUtc,
        UserLat = order.UserLat,
        UserLng = order.UserLng,
        UserUpdatedAtUtc = order.UserUpdatedAtUtc,
    };
}
