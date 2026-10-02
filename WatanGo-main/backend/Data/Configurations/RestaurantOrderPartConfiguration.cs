using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WatanGo.Models;

namespace WatanGo.Data.Configurations;

public sealed class RestaurantOrderPartConfiguration : IEntityTypeConfiguration<RestaurantOrderPart>
{
    // Reuse the same snake_case converter used by OrderConfiguration
    private static readonly ValueConverter<OrderStatus, string> StatusConverter = new(
        v => JsonNamingPolicy.SnakeCaseLower.ConvertName(v.ToString()),
        v => Enum.GetValues<OrderStatus>()
            .First(e => JsonNamingPolicy.SnakeCaseLower.ConvertName(e.ToString()) == v));

    public void Configure(EntityTypeBuilder<RestaurantOrderPart> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.RestaurantName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Status)
            .HasConversion(StatusConverter)
            .HasMaxLength(50)
            .IsRequired();

        // Cascade: deleting the parent order removes all its parts
        builder.HasOne(p => p.Order)
            .WithMany(o => o.RestaurantParts)
            .HasForeignKey(p => p.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Restrict: deleting a restaurant does not cascade into historical order parts
        builder.HasOne(p => p.Restaurant)
            .WithMany(r => r.OrderParts)
            .HasForeignKey(p => p.RestaurantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
