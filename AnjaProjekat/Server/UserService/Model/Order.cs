namespace UserService.Model
{
    public class Order : EntityBase
    {
        public double Price { get; set; }  
        public string Comment { get; set; } 
        public string Address { get; set; }
        public DateTime Created { get; set; }
        public DateTime DeliveryTime { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public List<OrderProduct> OrderProducts { get; set; }
        public User Buyer { get; set; }
        public int UserId { get; set; }


    }
}
