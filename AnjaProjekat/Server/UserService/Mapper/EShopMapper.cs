using AutoMapper;
using UserService.DTO;
using UserService.Model;

namespace UserService.Mapper
{
    public class EShopMapper : Profile
    {
        public EShopMapper()
        {
            CreateMap<User, LoginResultDTO>().ReverseMap();
            CreateMap<RegisterDTO, User>().ReverseMap();
            CreateMap<ProfileDTO, User>().ReverseMap();
            CreateMap<ProductDTO, Product>().ReverseMap();
            CreateMap<ProductItemDTO, Product>().ReverseMap();
            CreateMap<Product, ProductDTO>().ReverseMap();
            CreateMap<Order, CreateOrderDTO>().ReverseMap();
            CreateMap<OrderDTO, Order>().ReverseMap();
            CreateMap<UserVerifyDTO, User>().ReverseMap();
        }
    }
}
