using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WebShop.Model;

namespace WebShop.Configuration
{
    public class UserConfigurations : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(user => user.Id);
            builder.Property(user => user.Id).ValueGeneratedOnAdd();
            builder.Property(user => user.Username).HasMaxLength(30);
            builder.Property(user => user.Username).IsRequired();
            builder.HasIndex(user => user.Username).IsUnique();
            builder.Property(user => user.Email).HasMaxLength(320);
            builder.Property(user => user.Email).IsRequired();
            builder.HasIndex(user => user.Email).IsUnique();
            builder.Property(user => user.Password).IsRequired();
            builder.Property(user => user.FirstName).HasMaxLength(60);
            builder.Property(user => user.FirstName).IsRequired();
            builder.Property(user => user.LastName).HasMaxLength(60);
            builder.Property(user => user.LastName).IsRequired();
            builder.Property(user => user.DateOfBirth).IsRequired();
            builder.Property(user => user.Address).IsRequired(false);
            builder.Property(user => user.UserRole).HasConversion(new EnumToStringConverter<UserRole>());
            builder.Property(user => user.UserStatus).HasConversion(new EnumToStringConverter<UserStatus>());

            builder.HasData(new User
            {
                Id = 1,
                Username = "anjaAdmin",
                Email = "anjaAdmin@gmail.com",
                FirstName = "Anja",
                LastName = "Puskas",
                Password = BCrypt.Net.BCrypt.HashPassword("anjaAdmin"),
                Address = "Lukijana Musickog 43",
                UserRole = UserRole.ADMIN,
                UserStatus = UserStatus.VERIFIED,
                DateOfBirth = new DateTime(1996, 5, 24)
            });
        }
    }
}
