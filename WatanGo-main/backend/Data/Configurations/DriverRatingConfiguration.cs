using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatanGo.Models;

namespace WatanGo.Data.Configurations;

public sealed class DriverRatingConfiguration : IEntityTypeConfiguration<DriverRating>
{
    public void Configure(EntityTypeBuilder<DriverRating> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Stars)
            .IsRequired();

        builder.Property(r => r.Comment)
            .HasMaxLength(1000);

        // Driver FK — deleting a driver cascades to their ratings
        builder.HasOne(r => r.Driver)
            .WithMany(u => u.ReceivedRatings)
            .HasForeignKey(r => r.DriverId)
            .OnDelete(DeleteBehavior.Cascade);

        // User FK — deleting a user sets their ratings' UserId to null
        builder.HasOne(r => r.User)
            .WithMany(u => u.GivenRatings)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // RideOrder FK — optional; set null if ride is deleted
        builder.HasOne(r => r.RideOrder)
            .WithMany()
            .HasForeignKey(r => r.RideOrderId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
