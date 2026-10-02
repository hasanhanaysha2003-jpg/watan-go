using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatanGo.Constants;
using WatanGo.Contracts.Restaurants;
using WatanGo.Data;
using WatanGo.Models;

namespace WatanGo.Controllers;

[ApiController]
[Route("api/restaurants")]
public sealed class RestaurantController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public RestaurantController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? name,
        [FromQuery] decimal? minRating,
        [FromQuery] decimal? maxDeliveryFee,
        CancellationToken cancellationToken)
    {
        var query = _dbContext.Restaurants
            .Include(r => r.Owner)
            .Include(r => r.Items)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
            query = query.Where(r => r.Name.Contains(name));

        if (minRating.HasValue)
            query = query.Where(r => r.Rating >= minRating.Value);

        if (maxDeliveryFee.HasValue)
            query = query.Where(r => r.DeliveryFee <= maxDeliveryFee.Value);

        var restaurants = await query
            .OrderBy(r => r.Name)
            .Select(r => new RestaurantDto
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                Rating = r.Rating,
                DeliveryTimeMin = r.DeliveryTimeMin,
                DeliveryTimeMax = r.DeliveryTimeMax,
                DeliveryFee = r.DeliveryFee,
                OwnerName = r.Owner.FullName,
                MainItems = r.Items
                    .Where(i => i.IsMain)
                    .Select(i => new RestaurantItemDto
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Description = i.Description,
                        Price = i.Price,
                        IsAvailable = i.IsAvailable,
                        IsMain = i.IsMain,
                    })
                    .ToList(),
            })
            .ToListAsync(cancellationToken);

        return Ok(restaurants);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var restaurant = await _dbContext.Restaurants
            .Include(r => r.Owner)
            .Include(r => r.Items)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (restaurant is null)
            return NotFound(new { message = "المطعم غير موجود" });

        var dto = new RestaurantDetailDto
        {
            Id = restaurant.Id,
            Name = restaurant.Name,
            Description = restaurant.Description,
            Rating = restaurant.Rating,
            DeliveryTimeMin = restaurant.DeliveryTimeMin,
            DeliveryTimeMax = restaurant.DeliveryTimeMax,
            DeliveryFee = restaurant.DeliveryFee,
            OwnerName = restaurant.Owner.FullName,
            Items = restaurant.Items
                .Select(i => new RestaurantItemDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Description = i.Description,
                    Price = i.Price,
                    IsAvailable = i.IsAvailable,
                    IsMain = i.IsMain,
                })
                .ToList(),
        };

        return Ok(dto);
    }

    [HttpPost]
    [Authorize(Roles = AppRoles.RestaurantOwner)]
    public async Task<IActionResult> Create(
        [FromBody] CreateRestaurantRequest request,
        CancellationToken cancellationToken)
    {
        var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (ownerId is null)
            return Unauthorized();

        var restaurant = new Restaurant
        {
            Name = request.Name,
            Description = request.Description,
            Rating = request.Rating,
            DeliveryTimeMin = request.DeliveryTimeMin,
            DeliveryTimeMax = request.DeliveryTimeMax,
            DeliveryFee = request.DeliveryFee,
            OwnerId = ownerId,
        };

        _dbContext.Restaurants.Add(restaurant);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = restaurant.Id }, new { id = restaurant.Id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = AppRoles.RestaurantOwner + "," + AppRoles.Admin)]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateRestaurantRequest request,
        CancellationToken cancellationToken)
    {
        var restaurant = await _dbContext.Restaurants
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (restaurant is null)
            return NotFound(new { message = "المطعم غير موجود" });

        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!User.IsInRole(AppRoles.Admin) && restaurant.OwnerId != currentUserId)
            return Forbid();

        restaurant.Name = request.Name;
        restaurant.Description = request.Description;
        restaurant.Rating = request.Rating;
        restaurant.DeliveryTimeMin = request.DeliveryTimeMin;
        restaurant.DeliveryTimeMax = request.DeliveryTimeMax;
        restaurant.DeliveryFee = request.DeliveryFee;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = AppRoles.RestaurantOwner + "," + AppRoles.Admin)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var restaurant = await _dbContext.Restaurants
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (restaurant is null)
            return NotFound(new { message = "المطعم غير موجود" });

        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!User.IsInRole(AppRoles.Admin) && restaurant.OwnerId != currentUserId)
            return Forbid();

        _dbContext.Restaurants.Remove(restaurant);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    // ── Owner's own restaurant(s) ─────────────────────────────────────────────

    [HttpGet("my")]
    [Authorize(Roles = AppRoles.RestaurantOwner)]
    public async Task<IActionResult> GetMyRestaurants(CancellationToken cancellationToken)
    {
        var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var restaurants = await _dbContext.Restaurants
            .Include(r => r.Owner)
            .Include(r => r.Items)
            .Where(r => r.OwnerId == ownerId)
            .OrderBy(r => r.Name)
            .ToListAsync(cancellationToken);

        if (restaurants.Count == 0)
            return NotFound(new { message = "لا يوجد مطعم مسجل لهذا الحساب" });

        return Ok(restaurants.Select(r => new RestaurantDetailDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            Rating = r.Rating,
            DeliveryTimeMin = r.DeliveryTimeMin,
            DeliveryTimeMax = r.DeliveryTimeMax,
            DeliveryFee = r.DeliveryFee,
            OwnerName = r.Owner.FullName,
            Items = r.Items.Select(MapItemToDto).ToList(),
        }).ToList());
    }

    // ── Restaurant items CRUD ─────────────────────────────────────────────────

    [HttpGet("{id:int}/items")]
    [Authorize(Roles = AppRoles.RestaurantOwner)]
    public async Task<IActionResult> GetItems(int id, CancellationToken cancellationToken)
    {
        var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var restaurant = await _dbContext.Restaurants
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (restaurant is null)
            return NotFound(new { message = "المطعم غير موجود" });

        if (restaurant.OwnerId != ownerId)
            return Forbid();

        var items = await _dbContext.RestaurantItems
            .Where(i => i.RestaurantId == id)
            .Select(i => MapItemToDto(i))
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost("{id:int}/items")]
    [Authorize(Roles = AppRoles.RestaurantOwner)]
    public async Task<IActionResult> CreateItem(
        int id,
        [FromBody] CreateRestaurantItemRequest request,
        CancellationToken cancellationToken)
    {
        var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var restaurant = await _dbContext.Restaurants
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (restaurant is null)
            return NotFound(new { message = "المطعم غير موجود" });

        if (restaurant.OwnerId != ownerId)
            return Forbid();
        

        var item = new RestaurantItem
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            IsAvailable = request.IsAvailable,
            IsMain = request.IsMain,
            RestaurantId = id,
            
        };

        _dbContext.RestaurantItems.Add(item);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Created(string.Empty, MapItemToDto(item));
    }


//////////////update item
    [HttpPut("{id:int}/items/{itemId:int}")]
    [Authorize(Roles = AppRoles.RestaurantOwner)]
    public async Task<IActionResult> UpdateItem(
        int id,
        int itemId,
        [FromBody] UpdateRestaurantItemRequest request,
        CancellationToken cancellationToken)
    {
        var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var restaurant = await _dbContext.Restaurants
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (restaurant is null)
            return NotFound(new { message = "المطعم غير موجود" });

        if (restaurant.OwnerId != ownerId)
            return Forbid();

        var item = await _dbContext.RestaurantItems
            .FirstOrDefaultAsync(i => i.Id == itemId && i.RestaurantId == id, cancellationToken);

        if (item is null)
            return NotFound(new { message = "الصنف غير موجود" });

        item.Name = request.Name;
        item.Description = request.Description;
        item.Price = request.Price;
        item.IsAvailable = request.IsAvailable;
        item.IsMain = request.IsMain;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:int}/items/{itemId:int}")]
    [Authorize(Roles = AppRoles.RestaurantOwner)]
    public async Task<IActionResult> DeleteItem(
        int id,
        int itemId,
        CancellationToken cancellationToken)
    {
        var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var restaurant = await _dbContext.Restaurants
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (restaurant is null)
            return NotFound(new { message = "المطعم غير موجود" });

        if (restaurant.OwnerId != ownerId)
            return Forbid();

        var item = await _dbContext.RestaurantItems
            .FirstOrDefaultAsync(i => i.Id == itemId && i.RestaurantId == id, cancellationToken);

        if (item is null)
            return NotFound(new { message = "الصنف غير موجود" });

        _dbContext.RestaurantItems.Remove(item);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static RestaurantItemDto MapItemToDto(RestaurantItem item) => new()
    {
        Id = item.Id,
        Name = item.Name,
        Description = item.Description,
        Price = item.Price,
        IsAvailable = item.IsAvailable,
        IsMain = item.IsMain,
    };

    // ── Restaurant's own orders ───────────────────────────────────────────────

    [HttpGet("my/orders")]
    [Authorize(Roles = AppRoles.RestaurantOwner)]
    public async Task<IActionResult> GetMyRestaurantOrders(
        [FromQuery] int restaurantId,
        CancellationToken cancellationToken)
    {
        var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // Verify this restaurant belongs to the caller
        var restaurant = await _dbContext.Restaurants
            .FirstOrDefaultAsync(r => r.Id == restaurantId && r.OwnerId == ownerId, cancellationToken);

        if (restaurant is null)
            return NotFound(new { message = "المطعم غير موجود أو لا تملك صلاحية الوصول إليه" });

        // Fetch orders that contain a part belonging to this restaurant
        var orders = await _dbContext.Orders
            .Include(o => o.Items)
            .Include(o => o.User)
            .Include(o => o.Driver)
            .Include(o => o.RestaurantParts)
            .Where(o => o.RestaurantParts.Any(p => p.RestaurantId == restaurantId))
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(orders.Select(o => MapRestaurantOrderToDto(o, restaurantId, restaurant.Name)).ToList());
    }

    [HttpPut("my/orders/{orderId:int}/status")]
    [Authorize(Roles = AppRoles.RestaurantOwner)]
    public async Task<IActionResult> UpdateMyRestaurantOrderStatus(
        int orderId,
        [FromQuery] int restaurantId,
        [FromBody] UpdateRestaurantOrderStatusRequest request,
        CancellationToken cancellationToken)
    {
        var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // Verify this restaurant belongs to the caller
        var restaurant = await _dbContext.Restaurants
            .FirstOrDefaultAsync(r => r.Id == restaurantId && r.OwnerId == ownerId, cancellationToken);

        if (restaurant is null)
            return NotFound(new { message = "المطعم غير موجود أو لا تملك صلاحية الوصول إليه" });

        // Validate requested status
        if (!Enum.TryParse<OrderStatus>(request.Status, ignoreCase: true, out var parsedStatus))
            return BadRequest(new { message = "حالة الطلب غير صحيحة" });

        // Restaurant owner may only set these part-level statuses
        OrderStatus[] allowedForOwner =
        [
            OrderStatus.Accepted,
            OrderStatus.Preparing,
            OrderStatus.ReadyForPickup,
            OrderStatus.Cancelled,
        ];
        if (!allowedForOwner.Contains(parsedStatus))
            return BadRequest(new { message = "غير مسموح بتعيين هذه الحالة من المطعم" });

        // Load the order with all its restaurant parts
        var order = await _dbContext.Orders
            .Include(o => o.RestaurantParts)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

        if (order is null)
            return NotFound(new { message = "الطلب غير موجود" });

        // Find the part that belongs to this restaurant
        var part = order.RestaurantParts
            .FirstOrDefault(p => p.RestaurantId == restaurantId);

        if (part is null)
            return NotFound(new { message = "لا يوجد جزء لهذا المطعم في الطلب" });

        // Update the part status
        part.Status = parsedStatus;

        // ── Propagate to Order.Status ─────────────────────────────────────────
        if (parsedStatus == OrderStatus.Cancelled)
        {
            // One restaurant cancels → whole order is cancelled
            order.Status = OrderStatus.Cancelled;
        }
        else if (order.RestaurantParts.All(p => p.Status == OrderStatus.ReadyForPickup))
        {
            // Every restaurant is ready → driver can now see and accept the order
            order.Status = OrderStatus.ReadyForPickup;
        }
        // else: order stays Pending (still waiting for other restaurants)

        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static RestaurantOrderDto MapRestaurantOrderToDto(
        Order order,
        int restaurantId,
        string restaurantName) =>
        new()
        {
            Id           = order.Id,
            TotalPrice   = order.TotalPrice,
            // Use the restaurant's own part status until it reaches ReadyForPickup.
            // After that the restaurant is done, so surface the overall Order.Status
            // so the restaurant sees driver progress (PickedUp → OnTheWay → Completed).
            Status       = ToFrontendStatus(ResolveRestaurantStatus(order, restaurantId)),
            Notes        = order.Notes,
            CreatedAt    = order.CreatedAt,
            CustomerName = order.User.FullName,
            DriverName   = order.Driver?.FullName,
            Items        = [..order.Items
                .Where(i => i.RestaurantName == restaurantName)
                .Select(i => new RestaurantOrderItemDto
                {
                    ItemName  = i.ItemName,
                    UnitPrice = i.UnitPrice,
                    Quantity  = i.Quantity,
                })],
        };

    /// <summary>
    /// Returns the status to show the restaurant owner.
    /// While the restaurant is still working (part status &lt; ReadyForPickup),
    /// the part-level status is used.  Once the restaurant is done, the
    /// overall order status drives the display so the owner can see the
    /// driver's progress all the way to Completed.
    /// </summary>
    private static OrderStatus ResolveRestaurantStatus(Order order, int restaurantId)
    {
        var partStatus = order.RestaurantParts
            .FirstOrDefault(p => p.RestaurantId == restaurantId)?.Status;

        // If the part doesn't exist fall back to the order status
        if (partStatus is null)
            return order.Status;

        // Stages where the restaurant still controls the status
        bool restaurantIsStillWorking = partStatus is
            OrderStatus.Pending or
            OrderStatus.Accepted or
            OrderStatus.Preparing or
            OrderStatus.Cancelled;

        return restaurantIsStillWorking ? partStatus.Value : order.Status;
    }

    private static string ToFrontendStatus(OrderStatus status) => status switch
    {
        OrderStatus.Pending => "pending",
        OrderStatus.Accepted => "accepted",
        OrderStatus.Preparing => "preparing",
        OrderStatus.ReadyForPickup => "ready_for_pickup",
        OrderStatus.PickedUp => "picked_up",
        OrderStatus.OnTheWay => "on_the_way",
        OrderStatus.Completed => "completed",
        OrderStatus.Cancelled => "cancelled",
        _ => status.ToString().ToLowerInvariant(),
    };
}
