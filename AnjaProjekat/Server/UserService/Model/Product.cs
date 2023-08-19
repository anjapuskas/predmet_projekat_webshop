namespace UserService.Model
{
    public class Product :EntityBase
    {
        public string Name { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
        public string Description { get; set; }
        public byte[]? Picture { get; set; }
        public virtual User? Seller { get; set; }
        public long SellerId { get; set; }
        public List<OrderProduct> OrderProducts { get; set; }
    }
}
