namespace WatanGo.Contracts.Orders;

public sealed class UpdateOrderStatusRequest
{
    /// <summary>
    /// Accepts both PascalCase ("PickedUp") and snake_case ("picked_up").
    /// Parsed explicitly by the controller via TryParseOrderStatus.
    /// </summary>
    public string Status { get; init; } = string.Empty;
}
