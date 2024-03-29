﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebShop.Model;

namespace WebShop.Configuration
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(order => order.Id);
            builder.Property(order => order.Id).ValueGeneratedOnAdd();
            builder.Property(user => user.DeliveryTime).IsRequired(false);
            builder.HasMany(x => x.OrderProducts)
                              .WithOne(x => x.Order)
                              .OnDelete(DeleteBehavior.Cascade);

            builder.Property(x => x.OrderStatus)
                   .HasConversion(
                        x => x.ToString(),
                        x => Enum.Parse<OrderStatus>(x)
                    );
        }
    }
}
