using System.Security.Claims;
using WebShop.DTO;
using WebShop.Model;

namespace WebShop.Service.Interface
{
    public interface IAuthService
    {
        Task<LoginResultDTO> login(LoginAttemptDTO login);
        Task<LoginResultDTO> googleLogin(GoogleLoginAttemptDTO login);
        Task<Boolean> register(RegisterDTO registerDTO);

    }
}
