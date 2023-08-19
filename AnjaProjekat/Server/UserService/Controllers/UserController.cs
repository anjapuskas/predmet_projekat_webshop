using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserService.DTO;
using UserService.Service.Interface;

namespace UserService.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> login(LoginAttemptDTO loginDTO)
        {
            LoginResultDTO loginResult = await _userService.login(loginDTO);
            return Ok(loginResult);
        }

        [HttpPost("google/login")]
        public async Task<IActionResult> googleLogin(GoogleLoginAttemptDTO loginDTO)
        {
            LoginResultDTO loginResult = await _userService.googleLogin(loginDTO);
            return Ok(loginResult);
        }

        [HttpPost("register")]
        public async Task<IActionResult> register([FromForm]RegisterDTO registerDTO)
        {
            Boolean boolean= await _userService.register(registerDTO);
            return Ok(boolean);
        }

        [HttpGet("home")]
        [Authorize]
        public string home(LoginAttemptDTO loginDTO)
        {
            return "Hello world";
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> updateProfile([FromForm]ProfileDTO profileDTO)
        {
            ProfileResultDTO profileResultDTO = await _userService.updateProfile(profileDTO, User);
            return (Ok(profileResultDTO));
        }

        [Authorize]
        [HttpGet("profile/image/{id}")]
        public async Task<IActionResult> profileImage(long id)
        {
            ProfileImageDTO file = await _userService.getProfileImage(id);
            return Ok(file);
        }

        [HttpGet("verify")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> getSellersForVerification()
        {
            List<UserVerifyDTO> users = await _userService.getSellersForVerification();
            return Ok(users);
        }

        [HttpPost("verify/{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> verifyOrder(long id)
        {
            List<UserVerifyDTO> users = await _userService.verifyUser(id);
            return Ok(users);
        }

        [HttpPost("reject/{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> rejectOrder(long id)
        {
            List<UserVerifyDTO> users = await _userService.rejectUser(id);
            return Ok(users);
        }
    }
}