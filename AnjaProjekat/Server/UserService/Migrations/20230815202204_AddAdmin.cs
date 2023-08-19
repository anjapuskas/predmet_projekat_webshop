using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserService.Migrations
{
    /// <inheritdoc />
    public partial class AddAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "DateOfBirth", "Email", "FirstName", "LastName", "Password", "Picture", "UserRole", "UserStatus", "Username" },
                values: new object[] { 9999L, "Lukijana Musickog 43", new DateTime(1996, 5, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "anjaAdmin@gmail.com", "Anja", "Puskas", "$2a$11$j67ITVKjQDQzEqpzj.3HYOYTwt8qucpOUZRJW.BvzGdmWg9DbtJ3y", null, "ADMIN", "VERIFIED", "anjaAdmin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1L);
        }
    }
}
