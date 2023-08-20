using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WebShop.Model;

namespace WebShop.Configuration
{
    public class ProductConfigurations : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(product => product.Id);
            builder.Property(product => product.Id).ValueGeneratedOnAdd();
            builder.Property(product => product.Name).HasMaxLength(60);
            builder.Property(product => product.Name).IsRequired();
            builder.HasIndex(product => product.Name).IsUnique();
            builder.HasOne(p => p.Seller).WithMany(u => u.Products).HasForeignKey(p => p.SellerId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
