using System.Security.Claims;
using UserService.DTO;
using UserService.Model;

namespace UserService.Service.Interface
{
    public interface IUserService
    {
        Task<LoginResultDTO> login(LoginAttemptDTO login);
        Task<LoginResultDTO> googleLogin(GoogleLoginAttemptDTO login);
        Task<Boolean> register(RegisterDTO registerDTO);
        Task<ProfileResultDTO> updateProfile(ProfileDTO profileDTO, ClaimsPrincipal claimsPrincipal);
        Task<ProfileImageDTO> getProfileImage(long id);
        Task<User> getUser(long id);
        Task<List<UserVerifyDTO>> getSellersForVerification();
        Task<List<UserVerifyDTO>> verifyUser(long id);
        Task<List<UserVerifyDTO>> rejectUser(long id);

    }
}
