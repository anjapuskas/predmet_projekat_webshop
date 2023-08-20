using WebShop.Model;

namespace WebShop.DTO
{
    public class ProfileDTO
    {
        public int Id { get; set; }     
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public DateTime DateOfBirth { get; set; }

        public IFormFile? PictureFile { get; set; }
    }
}
