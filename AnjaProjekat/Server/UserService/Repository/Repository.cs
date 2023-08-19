using Microsoft.EntityFrameworkCore;
using UserService.Model;
using UserService.Service.Interface;

namespace UserService.Repository
{
    public class Repository : IRepository
    {
        private readonly DbContext _context;

        public IGenericRepository<User> _userRepository { get; } = null!;

        public IGenericRepository<Product> _productRepository { get; } = null!;

        public IGenericRepository<OrderProduct> _orderProductRepository { get; } = null!;

        public IGenericRepository<Order> _orderRepository { get; } = null!;

        public Repository(DbContext context, IGenericRepository<User> userRepository, IGenericRepository<Product> productRepository,
            IGenericRepository<OrderProduct> orderProductRepository, IGenericRepository<Order> orderRepository)
        {
            _context = context;
            _userRepository = userRepository;
            _productRepository = productRepository;
            _orderProductRepository = orderProductRepository;
            _orderRepository = orderRepository;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

    }
}
