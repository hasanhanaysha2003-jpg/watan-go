using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using WatanGo.Constants;
using WatanGo.Contracts.RideOrders;
using WatanGo.Data;
using WatanGo.Models;

namespace WatanGo.Hubs;

[Authorize]
public sealed class RideTrackingHub : Hub
{
    private readonly ApplicationDbContext _dbContext;

    public RideTrackingHub(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task JoinRide(int rideOrderId)
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            throw new HubException("غير مصرح");

        var order = await _dbContext.RideOrders
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == rideOrderId);

        if (order is null)
            throw new HubException("الطلب غير موجود");

        if (order.Status != "assigned")
            throw new HubException("لا يمكن الانضمام للتتبع في حالة الطلب الحالية");

        if (!IsLocationParticipant(order, userId, Context.User))
            throw new HubException("غير مصرح");

        await Groups.AddToGroupAsync(Context.ConnectionId, GetGroupName(rideOrderId));
    }

    public async Task SendLocationUpdate(
        int rideOrderId,
        string role,
        decimal lat,
        decimal lng)
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            throw new HubException("غير مصرح");

        var order = await _dbContext.RideOrders
            .FirstOrDefaultAsync(r => r.Id == rideOrderId);

        if (order is null)
            throw new HubException("الطلب غير موجود");

        if (order.Status != "assigned")
            throw new HubException("لا يمكن تحديث الموقع في حالة الطلب الحالية");

        var isDriver = Context.User?.IsInRole(AppRoles.Driver) == true && order.DriverId == userId;
        var isUser = Context.User?.IsInRole(AppRoles.User) == true && order.UserId == userId;

        if (!isDriver && !isUser)
            throw new HubException("غير مصرح");

        var expectedRole = isDriver ? "driver" : "user";
        var roleValue = (role ?? string.Empty).Trim().ToLowerInvariant();

        if (roleValue != expectedRole)
            throw new HubException("الدور غير صالح");

        var updatedAtUtc = DateTime.UtcNow;

        if (isDriver)
        {
            order.DriverLat = lat;
            order.DriverLng = lng;
            order.DriverUpdatedAtUtc = updatedAtUtc;
        }
        else
        {
            order.UserLat = lat;
            order.UserLng = lng;
            order.UserUpdatedAtUtc = updatedAtUtc;
        }

        await _dbContext.SaveChangesAsync();

        var update = new RideLocationUpdateDto
        {
            RideOrderId = order.Id,
            Role = expectedRole,
            Lat = lat,
            Lng = lng,
            UpdatedAtUtc = updatedAtUtc,
        };

        await Clients.Group(GetGroupName(rideOrderId))
            .SendAsync("LocationUpdated", update);
    }

    private static bool IsLocationParticipant(RideOrder order, string userId, ClaimsPrincipal? user)
    {
        var isDriver = user?.IsInRole(AppRoles.Driver) == true && order.DriverId == userId;
        var isUser = user?.IsInRole(AppRoles.User) == true && order.UserId == userId;

        return isDriver || isUser;
    }

    internal static string GetGroupName(int rideOrderId) => $"ride-{rideOrderId}";
}
