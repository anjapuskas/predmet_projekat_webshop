using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserService.Model;

namespace UserService.Configuration
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(order => order.Id);
            builder.Property(order => order.Id).ValueGeneratedOnAdd();
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
