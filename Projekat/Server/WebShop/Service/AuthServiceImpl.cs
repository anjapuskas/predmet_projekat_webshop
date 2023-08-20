using AutoMapper;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebShop.Data;
using WebShop.DTO;
using WebShop.Exceptions;
using WebShop.Model;
using WebShop.Service.Interface;

namespace WebShop.Service
{
    public class AuthServiceImpl : IAuthService
    {

        private readonly IMapper _mapper;
        private readonly IRepository _repository;
        private readonly IConfiguration _configuration;

        public AuthServiceImpl(IMapper mapper, IRepository repository, IConfiguration configuration)
        {
            _mapper = mapper;
            _repository = repository;
            _configuration = configuration; 
        }

        public async Task<LoginResultDTO> login(LoginAttemptDTO login)
        {
            var users = await _repository._userRepository.GetAll();
            User? user = users.FirstOrDefault(u => u.Username == login.Username);

            if(user == null)
            {
                throw new CredentialsException("User does not exist");
            }

            if (user.UserRole == UserRole.SELLER && user.UserStatus == UserStatus.ON_HOLD)
            {
                throw new CredentialsException("User is not verified. Please wait from verification from Admin.");
            }

            if (user.UserRole == UserRole.SELLER && user.UserStatus == UserStatus.REJECTED)
            {
                throw new CredentialsException("User is rejected and can not log in.");
            }


            if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            {
                throw new CredentialsException("Incorrect login credentials!");
            }
            List<Claim> claims = new List<Claim>
            {
                new Claim("id", user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.UserRole.ToString())
            };

            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("Jwt")["secret"]));

            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims: claims, 
                expires: DateTime.Now.AddMinutes(20), 
                signingCredentials: signinCredentials 
            );

            string token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            LoginResultDTO loginResult = _mapper.Map<LoginResultDTO>(user);
            loginResult.Token = token;
            loginResult.UserStatus = Enum.GetName(typeof(UserStatus), user.UserStatus);

            return loginResult;

        }

        public async Task<LoginResultDTO> googleLogin(GoogleLoginAttemptDTO login)
        {

            var validiran = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string>() { _configuration.GetSection("ApplicationSettings")["GoogleLogin"] }
            };

            var googleInfo = await GoogleJsonWebSignature.ValidateAsync(login.Token, validiran);

            var users = await _repository._userRepository.GetAll();
            User? user = users.FirstOrDefault(u => u.Email == googleInfo.Email);

            if (user == null)
            {
                User newUser = new User();
                newUser.Email = googleInfo.Email;
                newUser.FirstName = googleInfo.GivenName;
                newUser.LastName = googleInfo.FamilyName;
                newUser.Username = googleInfo.Email.Split("@")[0];
                newUser.Address = "";
                newUser.Password = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString("n").Substring(0, 8));
                newUser.DateOfBirth = DateTime.MinValue;
                newUser.UserRole = UserRole.BUYER;
                newUser.UserStatus = UserStatus.VERIFIED;

                await _repository._userRepository.Insert(newUser);
                await _repository.SaveChanges();

                user = newUser;
            }


            List<Claim> claims = new List<Claim>
            {
                new Claim("id", user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.UserRole.ToString())
            };
            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("Jwt")["secret"]));

            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(20),
                signingCredentials: signinCredentials
            );

            string token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            LoginResultDTO loginResult = _mapper.Map<LoginResultDTO>(user);
            loginResult.Token = token;
            loginResult.UserStatus = Enum.GetName(typeof(UserStatus), user.UserStatus);

            return loginResult;

        }

        public async Task<bool> register(RegisterDTO registerDTO)
        {
            User newUser = _mapper.Map<User>(registerDTO);

            var users = await _repository._userRepository.GetAll();
            User? user = users.FirstOrDefault(u => u.Username == newUser.Username);

            if (user != null)
            {
                throw new CredentialsException("Username already exists!");
            }

            user = null;
            user = users.FirstOrDefault(u => u.Email == newUser.Email);
            if (user != null)
            {
                throw new CredentialsException("Email already exists!");
            }

            newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);

            if(newUser.UserRole == UserRole.SELLER)
            {
                newUser.UserStatus = UserStatus.ON_HOLD;
            } else
            {
                newUser.UserStatus = UserStatus.VERIFIED;
            }

            if (registerDTO.PictureFile != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    registerDTO.PictureFile.CopyTo(memoryStream);
                    var pictureByte = memoryStream.ToArray();
                    newUser.Picture = pictureByte;
                }
            }

            await _repository._userRepository.Insert(newUser);
            await _repository.SaveChanges();

            return true;

        }
    }
}
