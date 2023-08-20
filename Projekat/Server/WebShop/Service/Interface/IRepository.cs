using WebShop.Model;

namespace WebShop.Service.Interface
{
    public interface IRepository : IDisposable
    {
        IGenericRepository<User> _userRepository { get; }
        IGenericRepository<Product> _productRepository { get; }
        IGenericRepository<OrderProduct> _orderProductRepository { get; }
        IGenericRepository<Order> _orderRepository { get; }

        Task SaveChanges();
    }
}
