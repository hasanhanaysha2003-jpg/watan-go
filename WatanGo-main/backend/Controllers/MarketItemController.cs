using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatanGo.Constants;
using WatanGo.Contracts.Market;
using WatanGo.Data;
using WatanGo.Models;

namespace WatanGo.Controllers;

[ApiController]
[Route("api/market-items")]
public sealed class MarketItemController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public MarketItemController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? name,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] bool? inStock,
        CancellationToken cancellationToken)
    {
        var query = _dbContext.MarketItems.AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
            query = query.Where(i => i.Name.Contains(name));

        if (minPrice.HasValue)
            query = query.Where(i => i.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(i => i.Price <= maxPrice.Value);

        if (inStock.HasValue && inStock.Value)
            query = query.Where(i => i.Quantity > 0);

        var items = await query
            .OrderBy(i => i.Name)
            .Select(i => new MarketItemDto
            {
                Id = i.Id,
                Name = i.Name,
                Description = i.Description,
                Price = i.Price,
                Rating = i.Rating,
                Quantity = i.Quantity,
            })
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await _dbContext.MarketItems
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

        if (item is null)
            return NotFound(new { message = "المنتج غير موجود" });

        return Ok(new MarketItemDto
        {
            Id = item.Id,
            Name = item.Name,
            Description = item.Description,
            Price = item.Price,
            Rating = item.Rating,
            Quantity = item.Quantity,
        });
    }

    [HttpPost]
    [Authorize(Roles = AppRoles.MarketOwner + "," + AppRoles.Admin)]
    public async Task<IActionResult> Create(
        [FromBody] CreateMarketItemRequest request,
        CancellationToken cancellationToken)
    {
        var item = new MarketItem
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Rating = request.Rating,
            Quantity = request.Quantity,
        };

        _dbContext.MarketItems.Add(item);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = item.Id }, new { id = item.Id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = AppRoles.MarketOwner + "," + AppRoles.Admin)]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateMarketItemRequest request,
        CancellationToken cancellationToken)
    {
        var item = await _dbContext.MarketItems
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

        if (item is null)
            return NotFound(new { message = "المنتج غير موجود" });

        item.Name = request.Name;
        item.Description = request.Description;
        item.Price = request.Price;
        item.Rating = request.Rating;
        item.Quantity = request.Quantity;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = AppRoles.MarketOwner + "," + AppRoles.Admin)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var item = await _dbContext.MarketItems
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

        if (item is null)
            return NotFound(new { message = "المنتج غير موجود" });

        _dbContext.MarketItems.Remove(item);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
