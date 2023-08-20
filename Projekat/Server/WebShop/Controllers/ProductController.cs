using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebShop.DTO;
using WebShop.Model;
using WebShop.Service.Interface;

namespace WebShop.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {

        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost("add")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> addProduct([FromForm] ProductDTO productDTO)
        {
            List<ProductItemDTO> products = await _productService.addProduct(productDTO, User);
            return Ok(products);
        }

        [HttpPut("update")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> updateProduct([FromForm] ProductDTO productDTO)
        {
            List<ProductItemDTO> products = await _productService.updateProduct(productDTO, User);
            return Ok(products);
        }

        [HttpGet]
        [Authorize(Roles = "BUYER")]
        public async Task<IActionResult> getAllProducts()
        {
            List<ProductItemDTO> products = await _productService.getAllProducts();
            return Ok(products);
        }

        [HttpGet("seller/{id}")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> getAllProductsForSeller(long id)
        {
            List<ProductItemDTO> products = await _productService.getAllProductsForSeller(id);
            return Ok(products);
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> verifyOrder(long id)
        {
            await _productService.delete(id, User);
            return Ok();
        }

    }
}