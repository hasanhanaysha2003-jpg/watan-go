namespace WatanGo.Models;

public enum OrderStatus
{
    Pending,
    Accepted,
    Preparing,
    ReadyForPickup,
    PickedUp,
    OnTheWay,
    Completed,
    Cancelled,
}
