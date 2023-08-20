using WebShop.Model;

namespace WebShop.DTO
{
    public class ProfileResultDTO
    {  
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public DateTime DateOfBirth { get; set; }

        public byte[] Picture { get; set; }
    }
}
