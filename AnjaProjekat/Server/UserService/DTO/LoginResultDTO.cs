namespace UserService.DTO
{
    public class LoginResultDTO
    {
        public int id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Image { get; set; }
        public string UserRole { get; set; }
        public string UserStatus { get; set; }
        public string Token { get; set; }
        public byte[]? Picture { get; set; }
    }
}
