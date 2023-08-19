using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserService.DTO;
using UserService.Model;
using UserService.Service.Interface;

namespace UserService.Configuration
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {

        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("add")]
        [Authorize(Roles = "BUYER,SELLER")]
        public async Task<IActionResult> addOrder([FromBody] CreateOrderDTO createOrderDTO)
        {
            Boolean addOrderResult = await _orderService.addOrder(createOrderDTO);
            return Ok(addOrderResult);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "BUYER")]
        public async Task<IActionResult> getAllBuyerOrders(long id)
        {
            List<OrderDTO> orders = await _orderService.getAllBuyerOrders(id);
            return Ok(orders);
        }

        [HttpGet("new")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> getNewSellerOrders()
        {
            List<OrderDTO> orders = await _orderService.getSellerOrders(OrderStatus.ORDERED, User);
            return Ok(orders);
        }

        [HttpGet("delivered")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> getDeliveredSellerOrders()
        {
            List<OrderDTO> orders = await _orderService.getSellerOrders(OrderStatus.DELIVERED, User);
            return Ok(orders);
        }

        [HttpGet("admin")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> getAdminOrders()
        {
            List<OrderDTO> orders = await _orderService.getAdminOrders();
            return Ok(orders);
        }

        [HttpPost("cancel/{id}")]
        [Authorize(Roles = "BUYER")]
        public async Task<IActionResult> cancelOrder(long id)
        {
            List<OrderDTO> orders = await _orderService.cancelOrder(id, User);
            return Ok(orders);
        }

        [HttpGet("products/{id}")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> getProductsForOrder(long id)
        {
            List<ProductItemDTO> products = await _orderService.getProductsForOrder(id, User);
            return Ok(products);
        }
    }
}
