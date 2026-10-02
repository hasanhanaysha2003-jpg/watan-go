using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatanGo.Constants;
using WatanGo.Contracts.Cart;
using WatanGo.Contracts.Orders;
using WatanGo.Data;
using WatanGo.Models;

namespace WatanGo.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize(Roles = AppRoles.User)]
public sealed class CartController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public CartController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // ─── GET /api/cart ────────────────────────────────────────────────────────

    [HttpGet]
    public async Task<IActionResult> GetCart(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var cart = await GetOrCreateCartAsync(userId, cancellationToken);
        return Ok(MapCartToDto(cart));
    }

    // ─── POST /api/cart/items ─────────────────────────────────────────────────

    [HttpPost("items")]
    public async Task<IActionResult> AddItem(
        [FromBody] AddCartItemRequest request,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        // Validate: exactly one of the two IDs must be provided
        if (request.RestaurantItemId is null && request.MarketItemId is null)
            return BadRequest(new { message = "يجب تحديد عنصر من المطعم أو من السوق" });
        if (request.RestaurantItemId is not null && request.MarketItemId is not null)
            return BadRequest(new { message = "لا يمكن إضافة عنصرين في نفس الوقت" });
        if (request.Quantity < 1)
            return BadRequest(new { message = "الكمية يجب أن تكون 1 على الأقل" });

        var cart = await GetOrCreateCartAsync(userId, cancellationToken);
        decimal deliveryFee = 0m;

        if (request.RestaurantItemId is not null)
        {
            var restaurantItem = await _dbContext.RestaurantItems
                .Include(ri => ri.Restaurant)
                .FirstOrDefaultAsync(ri => ri.Id == request.RestaurantItemId, cancellationToken);

            if (restaurantItem is null)
                return NotFound(new { message = "عنصر المطعم غير موجود" });
            if (!restaurantItem.IsAvailable)
                return UnprocessableEntity(new { message = "هذا العنصر غير متاح حالياً" });

            deliveryFee = restaurantItem.Restaurant.DeliveryFee;

            // If same item already in cart, increase quantity
            var existing = cart.Items.FirstOrDefault(ci => ci.RestaurantItemId == request.RestaurantItemId);
            if (existing is not null)
            {
                existing.Quantity += request.Quantity;
                await _dbContext.SaveChangesAsync(cancellationToken);
                return Ok(MapCartToDto(await ReloadCartAsync(cart.Id, cancellationToken)));
            }
        }
        else // market item
        {
            var marketItem = await _dbContext.MarketItems
                .FirstOrDefaultAsync(mi => mi.Id == request.MarketItemId, cancellationToken);

            if (marketItem is null)
                return NotFound(new { message = "عنصر السوق غير موجود" });
            if (marketItem.Quantity < 1)
                return UnprocessableEntity(new { message = "هذا العنصر غير متوفر في المخزون" });

            // If same item already in cart, increase quantity
            var existing = cart.Items.FirstOrDefault(ci => ci.MarketItemId == request.MarketItemId);
            if (existing is not null)
            {
                existing.Quantity += request.Quantity;
                await _dbContext.SaveChangesAsync(cancellationToken);
                return Ok(MapCartToDto(await ReloadCartAsync(cart.Id, cancellationToken)));
            }
        }

        var cartItem = new CartItem
        {
            CartId = cart.Id,
            Quantity = request.Quantity,
            RestaurantItemId = request.RestaurantItemId,
            MarketItemId = request.MarketItemId,
            RestaurantDeliveryFee = deliveryFee,
        };

        _dbContext.CartItems.Add(cartItem);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(MapCartToDto(await ReloadCartAsync(cart.Id, cancellationToken)));
    }

    // ─── PUT /api/cart/items/{id} ─────────────────────────────────────────────

    [HttpPut("items/{id:int}")]
    public async Task<IActionResult> UpdateItem(
        int id,
        [FromBody] UpdateCartItemRequest request,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        if (request.Quantity < 1)
            return BadRequest(new { message = "الكمية يجب أن تكون 1 على الأقل" });

        var cartItem = await _dbContext.CartItems
            .Include(ci => ci.Cart)
            .FirstOrDefaultAsync(ci => ci.Id == id, cancellationToken);

        if (cartItem is null) return NotFound(new { message = "العنصر غير موجود في السلة" });
        if (cartItem.Cart.UserId != userId) return Forbid();

        cartItem.Quantity = request.Quantity;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(MapCartToDto(await ReloadCartAsync(cartItem.CartId, cancellationToken)));
    }

    // ─── DELETE /api/cart/items/{id} ──────────────────────────────────────────

    [HttpDelete("items/{id:int}")]
    public async Task<IActionResult> RemoveItem(int id, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var cartItem = await _dbContext.CartItems
            .Include(ci => ci.Cart)
            .FirstOrDefaultAsync(ci => ci.Id == id, cancellationToken);

        if (cartItem is null) return NotFound(new { message = "العنصر غير موجود في السلة" });
        if (cartItem.Cart.UserId != userId) return Forbid();

        _dbContext.CartItems.Remove(cartItem);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(MapCartToDto(await ReloadCartAsync(cartItem.CartId, cancellationToken)));
    }

    // ─── DELETE /api/cart ─────────────────────────────────────────────────────

    [HttpDelete]
    public async Task<IActionResult> ClearCart(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var cart = await _dbContext.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

        if (cart is null) return Ok();

        _dbContext.CartItems.RemoveRange(cart.Items);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(MapCartToDto(cart));
    }

    // ─── POST /api/cart/checkout ──────────────────────────────────────────────

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout(
        [FromQuery] string? notes,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var cart = await ReloadCartForUserAsync(userId, cancellationToken);

        if (cart is null || cart.Items.Count == 0)
            return BadRequest(new { message = "السلة فارغة" });

        // Build order items and calculate totals
        var orderItems = new List<OrderItem>();
        decimal itemsSubtotal = 0m;

        // Track distinct restaurants: restaurantId → (restaurantName, deliveryFee snapshot)
        var distinctRestaurants = new Dictionary<int, (string Name, decimal DeliveryFee)>();
        decimal deliveryFeesTotal = 0m;

        foreach (var ci in cart.Items)
        {
            if (ci.RestaurantItem is not null)
            {
                var item = ci.RestaurantItem;
                var restaurantName = item.Restaurant.Name;
                var lineTotal = item.Price * ci.Quantity;
                itemsSubtotal += lineTotal;

                // Charge delivery fee once per restaurant
                decimal feeForThisLine = 0m;
                if (!distinctRestaurants.ContainsKey(item.RestaurantId))
                {
                    distinctRestaurants[item.RestaurantId] = (restaurantName, ci.RestaurantDeliveryFee);
                    feeForThisLine = ci.RestaurantDeliveryFee;
                    deliveryFeesTotal += feeForThisLine;
                }

                orderItems.Add(new OrderItem
                {
                    Quantity = ci.Quantity,
                    ItemName = item.Name,
                    UnitPrice = item.Price,
                    DeliveryFee = feeForThisLine,
                    ItemType = "restaurant",
                    RestaurantName = restaurantName,
                });
            }
            else if (ci.MarketItem is not null)
            {
                var item = ci.MarketItem;

                if (item.Quantity < ci.Quantity)
                    return UnprocessableEntity(new { message = $"الكمية المتاحة من '{item.Name}' هي {item.Quantity} فقط" });

                var lineTotal = item.Price * ci.Quantity;
                itemsSubtotal += lineTotal;

                item.Quantity -= ci.Quantity;

                orderItems.Add(new OrderItem
                {
                    Quantity = ci.Quantity,
                    ItemName = item.Name,
                    UnitPrice = item.Price,
                    DeliveryFee = 0m,
                    ItemType = "market",
                    RestaurantName = null,
                });
            }
        }

        var grandTotal = itemsSubtotal + deliveryFeesTotal;

        // Market-only orders are instantly ready — no preparation needed
        bool hasRestaurantItems = distinctRestaurants.Count > 0;
        var initialStatus = hasRestaurantItems ? OrderStatus.Pending : OrderStatus.ReadyForPickup;

        // Build one RestaurantOrderPart per distinct restaurant
        var restaurantParts = distinctRestaurants
            .Select(kv => new RestaurantOrderPart
            {
                RestaurantId   = kv.Key,
                RestaurantName = kv.Value.Name,
                Status         = OrderStatus.Pending,
            })
            .ToList();

        var order = new Order
        {
            UserId          = userId,
            TotalPrice      = grandTotal,
            Status          = initialStatus,
            Notes           = notes,
            CreatedAt       = DateTime.UtcNow,
            Items           = orderItems,
            RestaurantParts = restaurantParts,
        };

        _dbContext.Orders.Add(order);

        // Clear the cart
        _dbContext.CartItems.RemoveRange(cart.Items);

        await _dbContext.SaveChangesAsync(cancellationToken);

        // Return the created order with parts
        var savedOrder = await _dbContext.Orders
            .Include(o => o.Items)
            .Include(o => o.User)
            .Include(o => o.RestaurantParts)
            .FirstAsync(o => o.Id == order.Id, cancellationToken);

        return CreatedAtAction("GetById", "Order", new { id = order.Id }, MapOrderToDto(savedOrder));
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private async Task<Cart> GetOrCreateCartAsync(string userId, CancellationToken ct)
    {
        var cart = await _dbContext.Carts
            .Include(c => c.Items)
                .ThenInclude(ci => ci.RestaurantItem)
                    .ThenInclude(ri => ri!.Restaurant)
            .Include(c => c.Items)
                .ThenInclude(ci => ci.MarketItem)
            .FirstOrDefaultAsync(c => c.UserId == userId, ct);

        if (cart is not null) return cart;

        cart = new Cart { UserId = userId, CreatedAt = DateTime.UtcNow };
        _dbContext.Carts.Add(cart);
        await _dbContext.SaveChangesAsync(ct);
        cart.Items = [];
        return cart;
    }

    private async Task<Cart> ReloadCartAsync(int cartId, CancellationToken ct) =>
        await _dbContext.Carts
            .Include(c => c.Items)
                .ThenInclude(ci => ci.RestaurantItem)
                    .ThenInclude(ri => ri!.Restaurant)
            .Include(c => c.Items)
                .ThenInclude(ci => ci.MarketItem)
            .FirstAsync(c => c.Id == cartId, ct);

    private async Task<Cart?> ReloadCartForUserAsync(string userId, CancellationToken ct) =>
        await _dbContext.Carts
            .Include(c => c.Items)
                .ThenInclude(ci => ci.RestaurantItem)
                    .ThenInclude(ri => ri!.Restaurant)
            .Include(c => c.Items)
                .ThenInclude(ci => ci.MarketItem)
            .FirstOrDefaultAsync(c => c.UserId == userId, ct);

    private static CartDto MapCartToDto(Cart cart)
    {
        var itemDtos = cart.Items
            .Select(ci => MapCartItemToDto(ci))
            .ToList();

        var itemsSubtotal = itemDtos.Sum(i => i.UnitPrice * i.Quantity);

        // Sum one delivery fee per distinct restaurant (identified by RestaurantItemId's restaurant)
        var seenRestaurantDeliveryFees = new HashSet<decimal>();
        var deliveryFeesTotal = 0m;

        foreach (var ci in cart.Items)
        {
            if (ci.RestaurantItemId is not null && ci.RestaurantItem is not null)
            {
                var restaurantId = ci.RestaurantItem.RestaurantId;
                if (!cart.Items
                    .Where(x => x.RestaurantItemId is not null && x.RestaurantItem is not null)
                    .Where(x => x.RestaurantItem!.RestaurantId == restaurantId)
                    .Any(x => x.Id < ci.Id)) // first occurrence only
                {
                    deliveryFeesTotal += ci.RestaurantDeliveryFee;
                }
            }
        }

        return new CartDto
        {
            Id = cart.Id,
            CreatedAt = cart.CreatedAt,
            Items = itemDtos,
            ItemsSubtotal = itemsSubtotal,
            DeliveryFeesTotal = deliveryFeesTotal,
            GrandTotal = itemsSubtotal + deliveryFeesTotal,
        };
    }

    private static CartItemDto MapCartItemToDto(CartItem ci)
    {
        if (ci.RestaurantItem is not null)
        {
            return new CartItemDto
            {
                Id = ci.Id,
                Quantity = ci.Quantity,
                RestaurantDeliveryFee = ci.RestaurantDeliveryFee,
                ItemName = ci.RestaurantItem.Name,
                UnitPrice = ci.RestaurantItem.Price,
                ItemType = "restaurant",
                RestaurantName = ci.RestaurantItem.Restaurant.Name,
                RestaurantItemId = ci.RestaurantItemId,
                MarketItemId = null,
            };
        }

        if (ci.MarketItem is not null)
        {
            return new CartItemDto
            {
                Id = ci.Id,
                Quantity = ci.Quantity,
                RestaurantDeliveryFee = 0m,
                ItemName = ci.MarketItem.Name,
                UnitPrice = ci.MarketItem.Price,
                ItemType = "market",
                RestaurantName = null,
                RestaurantItemId = null,
                MarketItemId = ci.MarketItemId,
            };
        }

        // Orphaned item (both FKs null after SetNull)
        return new CartItemDto
        {
            Id = ci.Id,
            Quantity = ci.Quantity,
            RestaurantDeliveryFee = ci.RestaurantDeliveryFee,
            ItemName = "[محذوف]",
            UnitPrice = 0m,
            ItemType = "unknown",
        };
    }

    private static OrderDto MapOrderToDto(Order o) => new()
    {
        Id           = o.Id,
        TotalPrice   = o.TotalPrice,
        Status       = o.Status,
        Notes        = o.Notes,
        CreatedAt    = o.CreatedAt,
        CustomerName = o.User.FullName,
        Items = o.Items.Select(oi => new OrderItemDto
        {
            Id             = oi.Id,
            Quantity       = oi.Quantity,
            ItemName       = oi.ItemName,
            UnitPrice      = oi.UnitPrice,
            DeliveryFee    = oi.DeliveryFee,
            ItemType       = oi.ItemType,
            RestaurantName = oi.RestaurantName,
            LineTotal      = oi.UnitPrice * oi.Quantity,
        }).ToList(),
        RestaurantParts = [..o.RestaurantParts.Select(p => new RestaurantOrderPartDto
        {
            Id             = p.Id,
            RestaurantId   = p.RestaurantId,
            RestaurantName = p.RestaurantName,
            Status         = p.Status,
        })],
    };
}
