namespace UserService.Model
{
    public class User : EntityBase
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public UserRole UserRole { get; set; }
        public UserStatus UserStatus { get; set; }
        public byte[]? Picture { get; set; }
        public virtual List<Product>? Products { get; set; }

    }
}
