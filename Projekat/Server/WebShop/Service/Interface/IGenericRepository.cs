using WebShop.Model;

namespace WebShop.Service.Interface
{
    public interface IGenericRepository<T> where T : EntityBase
    {
        Task<IQueryable<T>> GetAll();
        Task<T?> Get(long id);
        Task Insert(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}
