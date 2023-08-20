using System.Security.Claims;
using WebShop.DTO;
using WebShop.Model;

namespace WebShop.Service.Interface
{
    public interface IUserService
    {
        Task<ProfileResultDTO> updateProfile(ProfileDTO profileDTO, ClaimsPrincipal claimsPrincipal);
        Task<ProfileImageDTO> getProfileImage(long id);
        Task<User> getUser(long id);
        Task<List<UserVerifyDTO>> getSellersForVerification();
        Task<List<UserVerifyDTO>> verifyUser(long id);
        Task<List<UserVerifyDTO>> rejectUser(long id);

    }
}
