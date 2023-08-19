using Microsoft.EntityFrameworkCore;
using UserService.Model;

namespace UserService.Data
{
    public class EShopDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Product { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderProduct> OrderProduct { get; set; }

        public EShopDbContext(DbContextOptions<EShopDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(EShopDbContext).Assembly);
        }
    }
}
