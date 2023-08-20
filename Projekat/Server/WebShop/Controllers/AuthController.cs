using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebShop.DTO;
using WebShop.Service.Interface;

namespace WebShop.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class AuthController : ControllerBase
    {

        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> login(LoginAttemptDTO loginDTO)
        {
            LoginResultDTO loginResult = await _authService.login(loginDTO);
            return Ok(loginResult);
        }

        [HttpPost("google/login")]
        public async Task<IActionResult> googleLogin(GoogleLoginAttemptDTO loginDTO)
        {
            LoginResultDTO loginResult = await _authService.googleLogin(loginDTO);
            return Ok(loginResult);
        }

        [HttpPost("register")]
        public async Task<IActionResult> register([FromForm]RegisterDTO registerDTO)
        {
            Boolean boolean= await _authService.register(registerDTO);
            return Ok(boolean);
        }
    }
}