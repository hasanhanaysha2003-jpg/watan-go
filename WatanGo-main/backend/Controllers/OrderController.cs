using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using WatanGo.Constants;
using WatanGo.Contracts;
using WatanGo.Contracts.Orders;
using WatanGo.Data;
using WatanGo.Hubs;
using WatanGo.Models;

namespace WatanGo.Controllers;

[ApiController]
[Route("api/orders")]
public sealed class OrderController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IHubContext<OrderTrackingHub> _hubContext;

    public OrderController(ApplicationDbContext dbContext, IHubContext<OrderTrackingHub> hubContext)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
    }

    // ─── GET /api/orders/my ──────────────────────────────────────────────────

    [HttpGet("my")]
    [Authorize(Roles = AppRoles.User)]
    public async Task<IActionResult> GetMy(
        [FromQuery] string? status = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        if (page < 1) page = 1;
        if (pageSize is < 1 or > 50) pageSize = 10;

        var query = _dbContext.Orders.Where(o => o.UserId == userId);

        if (TryParseOrderStatus(status, out var statusValue))
            query = query.Where(o => o.Status == statusValue);

        var total = await query.CountAsync(cancellationToken);

        var orderIds = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(o => o.Id)
            .ToListAsync(cancellationToken);

        var orders = await _dbContext.Orders
            .Include(o => o.Items)
            .Include(o => o.User)
            .Include(o => o.Driver)
            .Include(o => o.RestaurantParts)
            .Where(o => orderIds.Contains(o.Id))
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(new PagedResponse<OrderDto>
        {
            Items = [..orders.Select(MapToDto)],
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)total / pageSize),
        });
    }

    // ─── GET /api/orders/{id} ────────────────────────────────────────────────

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole(AppRoles.Admin);

        var order = await _dbContext.Orders
            .Include(o => o.Items)
            .Include(o => o.User)
            .Include(o => o.Driver)
            .Include(o => o.RestaurantParts)
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (order is null)
            return NotFound(new { message = "الطلب غير موجود" });

        // Allow the customer who owns the order, the assigned driver, or an admin.
        if (!isAdmin && order.UserId != userId && order.DriverId != userId)
            return Forbid();

        return Ok(MapToDto(order));
    }

    // ─── GET /api/orders ─────────────────────────────────────────────────────

    [HttpGet]
    [Authorize(Roles = AppRoles.Admin)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? status,
        CancellationToken cancellationToken)
    {
        var query = _dbContext.Orders
            .Include(o => o.Items)
            .Include(o => o.User)
            .Include(o => o.Driver)
            .Include(o => o.RestaurantParts)
            .AsQueryable();

        if (TryParseOrderStatus(status, out var statusValue))
            query = query.Where(o => o.Status == statusValue);

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(orders.Select(MapToDto).ToList());
    }

    // ─── GET /api/orders/available (Driver) ──────────────────────────────────

    /// <summary>
    /// Returns ReadyForPickup orders that have no driver assigned yet.
    /// The driver can browse these and accept one for delivery.
    /// </summary>
    [HttpGet("available")]
    [Authorize(Roles = AppRoles.Driver)]
    public async Task<IActionResult> GetAvailable(CancellationToken cancellationToken)
    {
        var orders = await _dbContext.Orders
            .Include(o => o.Items)
            .Include(o => o.User)
            .Include(o => o.RestaurantParts)
            .Where(o => o.Status == OrderStatus.ReadyForPickup && o.DriverId == null)
            .OrderBy(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(orders.Select(MapToDto).ToList());
    }

    // ─── GET /api/orders/my-deliveries (Driver) ───────────────────────────────

    /// <summary>
    /// Returns orders assigned to the authenticated driver, optionally filtered by status.
    /// </summary>
    [HttpGet("my-deliveries")]
    [Authorize(Roles = AppRoles.Driver)]
    public async Task<IActionResult> GetMyDeliveries(
        [FromQuery] string? status = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (driverId is null) return Unauthorized();

        if (page < 1) page = 1;
        if (pageSize is < 1 or > 50) pageSize = 20;

        var query = _dbContext.Orders.Where(o => o.DriverId == driverId);

        if (TryParseOrderStatus(status, out var statusValue))
            query = query.Where(o => o.Status == statusValue);

        var total = await query.CountAsync(cancellationToken);

        var orders = await query
            .Include(o => o.Items)
            .Include(o => o.User)
            .Include(o => o.RestaurantParts)
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return Ok(new PagedResponse<OrderDto>
        {
            Items = [..orders.Select(MapToDto)],
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)total / pageSize),
        });
    }

    // ─── PUT /api/orders/{id}/accept-delivery (Driver) ────────────────────────

    /// <summary>
    /// Atomically assigns the order to the requesting driver and advances
    /// its status from ReadyForPickup → PickedUp. The WHERE guard ensures
    /// only one driver wins concurrent accepts.
    /// ExecuteUpdateAsync bypasses EF's change tracker, avoiding conflicts.
    /// </summary>
    [HttpPut("{id:int}/accept-delivery")]
    [Authorize(Roles = AppRoles.Driver)]
    public async Task<IActionResult> AcceptDelivery(int id, CancellationToken cancellationToken)
    {
        var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (driverId is null) return Unauthorized();

        // Order must be ReadyForPickup and unclaimed; assign this driver atomically.
        // We do NOT advance the status here — the driver explicitly confirms
        // pickup by calling PUT /status with { status: "PickedUp" }.
        var affected = await _dbContext.Orders
            .Where(o => o.Id == id && o.Status == OrderStatus.ReadyForPickup && o.DriverId == null)
            .ExecuteUpdateAsync(s => s
                .SetProperty(o => o.DriverId, driverId),
                cancellationToken);

        if (affected == 0)
        {
            var exists = await _dbContext.Orders
                .AnyAsync(o => o.Id == id, cancellationToken);

            return exists
                ? Conflict(new { message = "تم قبول هذا الطلب من قِبَل سائق آخر بالفعل أو لم يصبح جاهزاً للاستلام بعد" })
                : NotFound(new { message = "الطلب غير موجود" });
        }

        return NoContent();
    }

    // ─── PUT /api/orders/{id}/status ─────────────────────────────────────────

    [HttpPut("{id:int}/status")]
    [Authorize(Roles = $"{AppRoles.Admin},{AppRoles.Driver}")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] UpdateOrderStatusRequest request,
        CancellationToken cancellationToken)
    {
        var userId  = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole(AppRoles.Admin);

        // Verify the order exists and the caller has permission before updating
        var order = await _dbContext.Orders
            .AsNoTracking()
            .Select(o => new { o.Id, o.DriverId })
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (order is null)
            return NotFound(new { message = "الطلب غير موجود" });

        if (!isAdmin && order.DriverId != userId)
            return Forbid();

        // Validate the requested status is parseable
        if (!TryParseOrderStatus(request.Status, out var parsedStatus))
            return BadRequest(new { message = "حالة غير صحيحة" });

        // Drivers may only advance through these statuses
        if (!isAdmin)
        {
            OrderStatus[] driverAllowed = [
                OrderStatus.PickedUp,
                OrderStatus.OnTheWay,
                OrderStatus.Completed,
            ];
            if (!driverAllowed.Contains(parsedStatus))
                return BadRequest(new { message = "غير مسموح للسائق بتعيين هذه الحالة" });
        }

        // Atomic update — avoids the change-tracker / navigation-property conflict
        await _dbContext.Orders
            .Where(o => o.Id == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(o => o.Status, parsedStatus),
                cancellationToken);

        return NoContent();
    }

    // ─── GET /api/orders/{id}/location ────────────────────────────────────────

    [HttpGet("{id:int}/location")]
    [Authorize(Roles = AppRoles.User + "," + AppRoles.Driver)]
    public async Task<IActionResult> GetLocation(int id, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var order = await _dbContext.Orders
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (order is null)
            return NotFound(new { message = "الطلب غير موجود" });

        if (order.UserId != userId && order.DriverId != userId)
            return Forbid();

        if (order.Status != OrderStatus.PickedUp && order.Status != OrderStatus.OnTheWay)
            return BadRequest(new { message = "لا يمكن عرض الموقع في حالة الطلب الحالية" });

        return Ok(new OrderLocationSnapshotDto
        {
            OrderId = order.Id,
            DriverLat = order.DriverLat,
            DriverLng = order.DriverLng,
            DriverUpdatedAtUtc = order.DriverUpdatedAtUtc,
            UserLat = order.UserLat,
            UserLng = order.UserLng,
            UserUpdatedAtUtc = order.UserUpdatedAtUtc,
        });
    }

    // ─── PUT /api/orders/{id}/location ────────────────────────────────────────

    [HttpPut("{id:int}/location")]
    [Authorize(Roles = AppRoles.User + "," + AppRoles.Driver)]
    public async Task<IActionResult> UpdateLocation(
        int id,
        [FromBody] OrderLocationUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var order = await _dbContext.Orders
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (order is null)
            return NotFound(new { message = "الطلب غير موجود" });

        if (order.Status != OrderStatus.PickedUp && order.Status != OrderStatus.OnTheWay)
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

        var update = new OrderLocationUpdateDto
        {
            OrderId = order.Id,
            Role = isDriver ? "driver" : "user",
            Lat = request.Lat,
            Lng = request.Lng,
            UpdatedAtUtc = updatedAtUtc,
        };

        await _hubContext.Clients
            .Group(OrderTrackingHub.GetGroupName(order.Id))
            .SendAsync("LocationUpdated", update, cancellationToken);

        return Ok(update);
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private static bool TryParseOrderStatus(string? status, out OrderStatus parsedStatus)
    {
        parsedStatus = default;
        if (string.IsNullOrWhiteSpace(status))
            return false;

        if (Enum.TryParse(status, true, out parsedStatus))
            return true;

        var normalized = NormalizeStatusToken(status);
        return Enum.TryParse(normalized, false, out parsedStatus);
    }

    private static string NormalizeStatusToken(string status)
    {
        var parts = status
            .Trim()
            .Replace("-", "_")
            .Split('_', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        return string.Concat(parts.Select(part =>
            part.Length == 1
                ? part.ToUpperInvariant()
                : char.ToUpperInvariant(part[0]) + part[1..].ToLowerInvariant()));
    }

    private static OrderDto MapToDto(Order o) => new()
    {
        Id            = o.Id,
        TotalPrice    = o.TotalPrice,
        Status        = o.Status,
        Notes         = o.Notes,
        CreatedAt     = o.CreatedAt,
        CustomerName  = o.User.FullName,
        CustomerPhone = o.User.PhoneNumber,
        DriverName    = o.Driver?.FullName,
        DriverLat           = o.DriverLat,
        DriverLng           = o.DriverLng,
        DriverUpdatedAtUtc  = o.DriverUpdatedAtUtc,
        UserLat             = o.UserLat,
        UserLng             = o.UserLng,
        UserUpdatedAtUtc    = o.UserUpdatedAtUtc,
        Items = [..o.Items.Select(oi => new OrderItemDto
        {
            Id             = oi.Id,
            Quantity       = oi.Quantity,
            ItemName       = oi.ItemName,
            UnitPrice      = oi.UnitPrice,
            DeliveryFee    = oi.DeliveryFee,
            ItemType       = oi.ItemType,
            RestaurantName = oi.RestaurantName,
            LineTotal      = oi.UnitPrice * oi.Quantity,
        })],
        RestaurantParts = [..o.RestaurantParts.Select(p => new RestaurantOrderPartDto
        {
            Id             = p.Id,
            RestaurantId   = p.RestaurantId,
            RestaurantName = p.RestaurantName,
            Status         = p.Status,
        })],
    };
}
