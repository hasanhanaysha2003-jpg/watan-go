using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WatanGo.Models;

namespace WatanGo.Data.Configurations;

public sealed class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    private static readonly ValueConverter<OrderStatus, string> StatusConverter = new(
        v => JsonNamingPolicy.SnakeCaseLower.ConvertName(v.ToString()),
        v => Enum.GetValues<OrderStatus>()
            .First(e => JsonNamingPolicy.SnakeCaseLower.ConvertName(e.ToString()) == v));

    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.TotalPrice).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(o => o.Status)
            .HasConversion(StatusConverter)
            .HasMaxLength(50)
            .IsRequired();
        builder.Property(o => o.Notes).HasMaxLength(500);
        builder.Property(o => o.CreatedAt).IsRequired();

        builder.HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(o => o.DriverLat).HasColumnType("decimal(9,6)");
        builder.Property(o => o.DriverLng).HasColumnType("decimal(9,6)");
        builder.Property(o => o.UserLat).HasColumnType("decimal(9,6)");
        builder.Property(o => o.UserLng).HasColumnType("decimal(9,6)");

        builder.HasOne(o => o.Driver)
            .WithMany(u => u.AssignedOrders)
            .HasForeignKey(o => o.DriverId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
