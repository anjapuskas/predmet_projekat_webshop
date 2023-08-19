using UserService.Model;

namespace UserService.DTO
{
    public class RegisterDTO
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? Address { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string UserRole { get; set; }
        public IFormFile? PictureFile { get; set; }
    }
}
