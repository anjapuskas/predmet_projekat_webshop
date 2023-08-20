namespace WebShop.Model
{
    public class OrderProduct : EntityBase
    {
        public long OrderId { get; set; }
        public long ProductId { get; set; }
        public int Amount { get; set; }
        public double Price { get; set; }
        public Order Order { get; set; }
        public Product Product { get; set; }
    }
}
