using AutoMapper;
using System.Security.Claims;
using WebShop.Data;
using WebShop.DTO;
using WebShop.Model;
using WebShop.Service.Interface;

namespace WebShop.Service
{
    public class ProductServiceImpl : IProductService
    {

        private readonly IMapper _mapper;
        private readonly IRepository _repository;
        private readonly IUserService _userService;

        public ProductServiceImpl(IMapper mapper, IRepository repository, IUserService userService)
        {
            _mapper = mapper;
            _repository = repository;
            _userService = userService;
        }

        public async Task<List<ProductItemDTO>> addProduct(ProductDTO addProductDTO, ClaimsPrincipal claimsPrincipal)
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

            User user = await _userService.getUser(userId);

            if (user.UserRole == UserRole.SELLER && user.UserStatus != UserStatus.VERIFIED)
            {

                throw new Exception("User is not verified");
            }

            Product product = _mapper.Map<Product>(addProductDTO);
            product.Seller = user;
            product.SellerId = userId;

            if (addProductDTO.PictureFile != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    addProductDTO.PictureFile.CopyTo(memoryStream);
                    var pictureByte = memoryStream.ToArray();
                    product.Picture = pictureByte;
                }
            }

            await _repository._productRepository.Insert(product);
            await _repository.SaveChanges();

           return await getAllProductsForSeller(userId);
        }

        public async Task<List<ProductItemDTO>> updateProduct(ProductDTO updateProductDTO, ClaimsPrincipal claimsPrincipal)
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

            User user = await _userService.getUser(userId);

            if (user.UserRole == UserRole.SELLER && user.UserStatus != UserStatus.VERIFIED)
            {

                throw new Exception("User is not verified");
            }
            var products = await _repository._productRepository.GetAll();
            Product product = products.Where(p => p.Id == updateProductDTO.Id).FirstOrDefault();
            if (product == null)
            {
                throw new Exception("The product does not exist");
            }

            if (updateProductDTO.PictureFile != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    updateProductDTO.PictureFile.CopyTo(memoryStream);
                    var pictureByte = memoryStream.ToArray();
                    product.Picture = pictureByte;
                }
            } 
            product.Name = updateProductDTO.Name;
            product.Price = updateProductDTO.Price;
            product.Amount = updateProductDTO.Amount;
            product.Description = updateProductDTO.Description;

            _repository._productRepository.Update(product);
            await _repository.SaveChanges();

            return await getAllProductsForSeller(userId);
        }

        public async Task<List<ProductItemDTO>> getAllProducts()
        {
            var products = await _repository._productRepository.GetAll();
            List<Product> productList = products.Where(p => p.Amount > 0).ToList();
            List<ProductItemDTO> productDTOs = new List<ProductItemDTO>();
            foreach (Product product in productList)
            {
                productDTOs.Add(_mapper.Map<ProductItemDTO>(product));
            }

            return productDTOs;
        }

        public async Task<List<ProductItemDTO>> getAllProductsForSeller(long id)
        {

            User user = await _userService.getUser(id);

            if (user.UserRole == UserRole.SELLER && user.UserStatus != UserStatus.VERIFIED)
            {

                throw new Exception("User is not verified");
            }

            var products = await _repository._productRepository.GetAll();
            List<Product> productList = products.Where(p => p.Amount > 0 && p.SellerId == id).ToList();
            List<ProductItemDTO> productDTOs = new List<ProductItemDTO>();
            foreach (Product product in productList)
            {
                productDTOs.Add(_mapper.Map<ProductItemDTO>(product));
            }

            return productDTOs;
        }

        public Task<Product> getProduct(long id)
        {
            return _repository._productRepository.Get(id);
        }

        public async Task<bool> delete(long id, ClaimsPrincipal claimsPrincipal)
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

            User user = await _userService.getUser(userId);

            if (user.UserRole == UserRole.SELLER && user.UserStatus != UserStatus.VERIFIED)
            {

                throw new Exception("User is not verified");
            }

            var products = await _repository._productRepository.GetAll();
            Product product = products.Where(p => p.Id == id).FirstOrDefault();

            if (product == null)
            {

                throw new Exception("Proizvod ne postoji");
            }
            _repository._productRepository.Delete(product );
            await _repository.SaveChanges();
            return true;
        }
    }
}
