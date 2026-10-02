using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatanGo.Models;

namespace WatanGo.Data.Configurations;

public sealed class MarketItemConfiguration : IEntityTypeConfiguration<MarketItem>
{
    public void Configure(EntityTypeBuilder<MarketItem> builder)
    {
        builder.HasKey(i => i.Id);

        builder.Property(i => i.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(i => i.Description)
            .HasMaxLength(1000);

        builder.Property(i => i.Price)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.Rating)
            .HasColumnType("decimal(3,1)");
    }
}
