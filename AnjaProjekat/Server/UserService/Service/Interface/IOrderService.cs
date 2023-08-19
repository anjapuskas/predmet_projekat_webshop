using System.Security.Claims;
using UserService.DTO;
using UserService.Model;

namespace UserService.Service.Interface
{
    public interface IOrderService
    {
        Task<Boolean> addOrder(CreateOrderDTO createOrderDTO);

        Task<List<OrderDTO>> getAllBuyerOrders(long id);

        Task<List<OrderDTO>> getSellerOrders(OrderStatus orderStatus, System.Security.Claims.ClaimsPrincipal user);

        Task<List<OrderDTO>> getAdminOrders();

        Task<List<OrderDTO>> cancelOrder(long id, ClaimsPrincipal claimsPrincipal);
        Task<List<ProductItemDTO>> getProductsForOrder(long id, System.Security.Claims.ClaimsPrincipal user);
    }
}
