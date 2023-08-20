namespace WebShop.DTO
{
    public class CreateOrderDTO
    {
        public List<ProductDTO> Products { get; set; }
        public string Comment { get; set; }
        public string Address { get; set; } 
        public double Price { get; set; }
        public int Amount { get; set; }
        public long UserId { get; set; }
    }
}
