using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatanGo.Models;

namespace WatanGo.Data.Configurations;

public sealed class RideOrderConfiguration : IEntityTypeConfiguration<RideOrder>
{
    public void Configure(EntityTypeBuilder<RideOrder> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.PickupAddress)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(r => r.DestinationAddress)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(r => r.PickupLat).HasColumnType("decimal(9,6)");
        builder.Property(r => r.PickupLng).HasColumnType("decimal(9,6)");
        builder.Property(r => r.DestinationLat).HasColumnType("decimal(9,6)");
        builder.Property(r => r.DestinationLng).HasColumnType("decimal(9,6)");
        builder.Property(r => r.DistanceKm).HasColumnType("decimal(10,2)");
        builder.Property(r => r.Price).HasColumnType("decimal(18,2)");
        builder.Property(r => r.DriverLat).HasColumnType("decimal(9,6)");
        builder.Property(r => r.DriverLng).HasColumnType("decimal(9,6)");
        builder.Property(r => r.UserLat).HasColumnType("decimal(9,6)");
        builder.Property(r => r.UserLng).HasColumnType("decimal(9,6)");

        builder.Property(r => r.DeliveryType).IsRequired().HasMaxLength(20);
        builder.Property(r => r.Status).IsRequired().HasMaxLength(20);
        builder.Property(r => r.DurationLabel).HasMaxLength(50);

        builder.HasOne(r => r.User)
            .WithMany(u => u.RideOrders)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Driver)
            .WithMany()
            .HasForeignKey(r => r.DriverId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
