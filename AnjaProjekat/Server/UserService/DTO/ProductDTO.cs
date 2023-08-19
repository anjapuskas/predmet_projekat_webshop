using UserService.Model;

namespace UserService.DTO
{
    public class ProductDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
        public string Description { get; set; }
        public IFormFile? PictureFile { get; set; }
    }
}
