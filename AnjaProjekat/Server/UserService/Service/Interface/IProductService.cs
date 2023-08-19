using System.Security.Claims;
using UserService.DTO;
using UserService.Model;

namespace UserService.Service.Interface
{
    public interface IProductService
    {
        Task<List<ProductItemDTO>> addProduct(ProductDTO addProductDTO, ClaimsPrincipal claimsPrincipal);
        Task<List<ProductItemDTO>> updateProduct(ProductDTO updateProductDTO, ClaimsPrincipal claimsPrincipal);

        Task<List<ProductItemDTO>> getAllProducts();

        Task<Product> getProduct(long id);

        Task<List<ProductItemDTO>> getAllProductsForSeller(long id);
        Task<Boolean> delete(long id, ClaimsPrincipal claimsPrincipal);


    }
}
