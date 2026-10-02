using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatanGo.Models;

namespace WatanGo.Data.Configurations;

public sealed class RestaurantItemConfiguration : IEntityTypeConfiguration<RestaurantItem>
{
    public void Configure(EntityTypeBuilder<RestaurantItem> builder)
    {
        builder.HasKey(i => i.Id);

        builder.Property(i => i.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(i => i.Description)
            .HasMaxLength(1000);

        builder.Property(i => i.Price)
            .HasColumnType("decimal(18,2)");

        builder.HasOne(i => i.Restaurant)
            .WithMany(r => r.Items)
            .HasForeignKey(i => i.RestaurantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
