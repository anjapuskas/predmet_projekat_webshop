using WebShop.Model;

namespace WebShop.DTO
{
    public class OrderDTO
    {
        public long Id { get; set; }
        public double Price { get; set; }
        public string Address { get; set; }
        public string Created { get; set; }
        public string DeliveryTime { get; set; }
        public string OrderStatus { get; set; }
        public long UserId { get; set; }
    }
}
