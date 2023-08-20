using AutoMapper;
using System.Security.Claims;
using WebShop.Data;
using WebShop.DTO;
using WebShop.Model;
using WebShop.Service.Interface;

namespace WebShop.Service
{
    public class OrderServiceImpl : IOrderService
    {

        private readonly IMapper _mapper;
        private readonly IRepository _repository;
        private readonly IProductService _productService;
        private readonly IUserService _userService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public OrderServiceImpl(IMapper mapper, IRepository repository, IProductService productService, IUserService userService, IHttpContextAccessor httpContextAccessor)
        {
            _mapper = mapper;
            _repository = repository;
            _productService = productService;
            _userService = userService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> addOrder(CreateOrderDTO createOrderDTO)
        {
            Order order = _mapper.Map<Order>(createOrderDTO);
            order.Buyer = await _userService.getUser(order.UserId);
            order.Created = DateTime.Now;
            order.DeliveryTime = DateTime.Now.AddHours(1).AddHours(new Random().Next(24));
            order.OrderProducts = new List<OrderProduct>();
            List<long> differentSellerIds = new List<long>();

            foreach (ProductDTO product in createOrderDTO.Products)
            {
                OrderProduct orderProduct = new OrderProduct();
                orderProduct.ProductId = product.Id;
                orderProduct.OrderId = order.Id;
                orderProduct.Order = order;
                orderProduct.Product = await _productService.getProduct(product.Id);
                orderProduct.Price = product.Price;
                orderProduct.Amount = product.Amount;

                if(orderProduct.Product.Amount < product.Amount)
                {
                    throw new Exception("Nedovoljno kolicine za proizvod " + product.Name);
                }
                orderProduct.Product.Amount = orderProduct.Product.Amount - product.Amount;
                if(!differentSellerIds.Contains(orderProduct.Product.SellerId))
                {
                    differentSellerIds.Add(orderProduct.Product.SellerId);
                }

                order.OrderProducts.Add(orderProduct);
            }

            order.Price = order.Price + differentSellerIds.Count*10.0;
            await _repository._orderRepository.Insert(order);
            await _repository.SaveChanges();



            return true;
        }

        public async Task<List<OrderDTO>> getAllBuyerOrders(long id)
        {
            var orders = await _repository._orderRepository.GetAll();
            List<Order> ordersList = orders.Where(o => o.UserId == id).ToList();
            List<OrderDTO> orderDTOs = new List<OrderDTO>();
            foreach (Order order in ordersList)
            {
                OrderDTO orderDTO = _mapper.Map<OrderDTO>(order);
                orderDTO.OrderStatus = Enum.GetName(typeof(OrderStatus), order.OrderStatus);
                orderDTO.Created = order.Created.ToString("yyyy.MM.dd HH:mm:ss");
                orderDTO.DeliveryTime = order.DeliveryTime.ToString("yyyy.MM.dd HH:mm:ss");
                orderDTOs.Add(orderDTO);
            }

            return orderDTOs;
        }

        public async Task<List<OrderDTO>> getSellerOrders(OrderStatus orderStatus, System.Security.Claims.ClaimsPrincipal claimsPrincipal)
        {
            var userIdClaim = claimsPrincipal.Claims.First(c => c.Type == "id").Value;

            if(userIdClaim == null)
            {
                throw new Exception("Try logging in again");
            }

            if (!long.TryParse(userIdClaim, out long userId))
            {
                throw new Exception("Id must be a number.");
            }

            User user = await _userService.getUser(userId);

            if(user.UserRole == UserRole.SELLER && user.UserStatus != UserStatus.VERIFIED)
            {
                
                throw new Exception("User is not verified");
                
            }

            var orders = await _repository._orderRepository.GetAll();
            List<Order> ordersList = orders.Where(o => o.OrderStatus == orderStatus).ToList();
            List<OrderDTO> orderDTOs = new List<OrderDTO>();
            foreach (Order order in ordersList)
            {
                double price = 0.0;
                OrderDTO orderDTO = _mapper.Map<OrderDTO>(order);
                orderDTO.OrderStatus = Enum.GetName(typeof(OrderStatus), order.OrderStatus);
                orderDTO.Created = order.Created.ToString("yyyy.MM.dd HH:mm:ss");
                orderDTO.DeliveryTime = order.DeliveryTime.ToString("yyyy.MM.dd HH:mm:ss");
                var orderProducts = await _repository._orderProductRepository.GetAll();
                List<OrderProduct> orderProductList = orderProducts.Where(o => o.OrderId == order.Id).ToList();
                bool containsProduct = false;
                foreach (OrderProduct orderProduct in orderProductList)
                {
                    Product product = await _repository._productRepository.Get(orderProduct.ProductId);
                    if (product.SellerId == userId)
                    {
                        containsProduct = true;
                        price += product.Price * orderProduct.Amount;
                    }
                    
                }
                if(containsProduct)
                {
                    orderDTO.Price = price;
                    orderDTOs.Add(orderDTO);
                }
                
            }

            return orderDTOs;
        }

        public async Task<List<OrderDTO>> getAdminOrders()
        {
            var orders = await _repository._orderRepository.GetAll();
            List<Order> ordersList = orders.ToList();
            List<OrderDTO> orderDTOs = new List<OrderDTO>();
            foreach (Order order in ordersList)
            {
                OrderDTO orderDTO = _mapper.Map<OrderDTO>(order);
                orderDTO.OrderStatus = Enum.GetName(typeof(OrderStatus), order.OrderStatus);
                orderDTO.Created = order.Created.ToString("yyyy.MM.dd HH:mm:ss");
                orderDTO.DeliveryTime = order.DeliveryTime.ToString("yyyy.MM.dd HH:mm:ss");
                orderDTOs.Add(orderDTO);
            }

            return orderDTOs;
        }

        public async Task<List<OrderDTO>> cancelOrder(long id, ClaimsPrincipal claimsPrincipal)
        {

            var userIdClaim = claimsPrincipal.Claims.First(c => c.Type == "id").Value;

            if (userIdClaim == null)
            {
                throw new Exception("Try logging in again");
            }

            if (!long.TryParse(userIdClaim, out long userId))
            {
                throw new Exception("Id must be a number.");
            }

            Order order = await _repository._orderRepository.Get(id);
            if (order == null)
            {
                throw new Exception("Order does not exist.");
            }
            TimeSpan pastTime = DateTime.Now - order.Created; ;
            if (pastTime.TotalHours > 1)
            {
                throw new Exception("The time has passed for cancelling the order.");
            }

            order.OrderStatus = OrderStatus.CANCELLED;
            var orderProducts = await _repository._orderProductRepository.GetAll();
            List<OrderProduct> orderProductsList = orderProducts.Where(op => op.OrderId == order.Id).ToList();
            foreach (OrderProduct orderProduct in order.OrderProducts)
            {
                var product = await _repository._productRepository.Get(orderProduct.ProductId);
                product.Amount += orderProduct.Amount;
                _repository._productRepository.Update(product);
            }

            _repository._orderRepository.Update(order);
            await _repository.SaveChanges();
            return await getAllBuyerOrders(userId);
        }

        public async Task<List<ProductItemDTO>> getProductsForOrder(long id, ClaimsPrincipal claimsPrincipal)
        {
            var userIdClaim = claimsPrincipal.Claims.First(c => c.Type == "id").Value;

            if (userIdClaim == null)
            {
                throw new Exception("Try logging in again");
            }

            if (!long.TryParse(userIdClaim, out long userId))
            {
                throw new Exception("Id must be a number.");
            }

            Order order = await _repository._orderRepository.Get(id);
            if (order == null)
            {
                throw new Exception("Order does not exist.");
            }
            List<ProductItemDTO> productDTOs = new List<ProductItemDTO>();


            var orderProducts = await _repository._orderProductRepository.GetAll();
            List<OrderProduct> orderProductList = orderProducts.Where(o => o.OrderId == order.Id).ToList();

            foreach (OrderProduct orderProduct in orderProductList)
            {
                Product product = await _repository._productRepository.Get(orderProduct.ProductId);
                if (product.SellerId == userId)
                {
                    ProductItemDTO productItemDTO = _mapper.Map<ProductItemDTO>(product);
                    productItemDTO.Amount = orderProduct.Amount;
                    productDTOs.Add(productItemDTO);
                }
            }
            return productDTOs;
        }
    }
}
