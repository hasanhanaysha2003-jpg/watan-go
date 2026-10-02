using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatanGo.Models;

namespace WatanGo.Data.Configurations;

public sealed class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.HasKey(ci => ci.Id);

        builder.Property(ci => ci.Quantity).IsRequired();
        builder.Property(ci => ci.RestaurantDeliveryFee).HasColumnType("decimal(18,2)");

        builder.HasOne(ci => ci.Cart)
            .WithMany(c => c.Items)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ci => ci.RestaurantItem)
            .WithMany()
            .HasForeignKey(ci => ci.RestaurantItemId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(ci => ci.MarketItem)
            .WithMany()
            .HasForeignKey(ci => ci.MarketItemId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
