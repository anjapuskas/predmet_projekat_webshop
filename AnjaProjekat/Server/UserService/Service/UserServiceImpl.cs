using AutoMapper;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserService.Data;
using UserService.DTO;
using UserService.Exceptions;
using UserService.Model;
using UserService.Service.Interface;

namespace UserService.Service
{
    public class UserServiceImpl : IUserService
    {

        private readonly IMapper _mapper;
        private readonly IMailService _mailService;
        private readonly IRepository _repository;
        private readonly IConfiguration _configuration;

        public UserServiceImpl(IMapper mapper, IMailService mailService, IRepository repository, IConfiguration configuration)
        {
            _mapper = mapper;
            _mailService = mailService; 
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

            if (user.UserRole == UserRole.SELLER && user.UserStatus != UserStatus.VERIFIED)
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
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.UserRole.ToString())
            };

            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("ApplicationSettings")["secret"]));

            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: "https://localhost:44350/",
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

        public async Task<ProfileResultDTO> updateProfile(ProfileDTO profileDTO, ClaimsPrincipal claimsPrincipal)
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

            User user = await _repository._userRepository.Get(userId);
            user.FirstName = profileDTO.FirstName;
            user.LastName = profileDTO.LastName;
            user.Address = profileDTO.Address;
            user.DateOfBirth = profileDTO.DateOfBirth;

            if(profileDTO.PictureFile != null)
                using (var ms = new MemoryStream())
                {
                    profileDTO.PictureFile.CopyTo(ms);
                    var pictureByte = ms.ToArray();
                    user.Picture = pictureByte;

                }

            _repository._userRepository.Update(user);
            await _repository.SaveChanges();

            ProfileResultDTO profileResultDTO = new ProfileResultDTO();
            profileResultDTO.FirstName = profileDTO.FirstName;
            profileResultDTO.LastName = profileDTO.LastName;
            profileResultDTO.Address = profileDTO.Address;
            profileResultDTO.DateOfBirth = profileDTO.DateOfBirth;
            profileResultDTO.Picture = user.Picture;

            return profileResultDTO;

        }

        public async Task<List<UserVerifyDTO>> getSellersForVerification()
        {
            var users = await _repository._userRepository.GetAll();
            List<User> usersList = users.Where(u => u.UserRole == UserRole.SELLER).ToList();
            List<UserVerifyDTO> userVerifyDTOs = new List<UserVerifyDTO>();
            foreach (User user in usersList)
            {
                UserVerifyDTO userVerifyDTO = _mapper.Map<UserVerifyDTO>(user);
                userVerifyDTO.UserStatus= Enum.GetName(typeof(UserStatus), user.UserStatus);
                userVerifyDTO.DateOfBirth = user.DateOfBirth.ToString("yyyy.MM.dd HH:mm:ss");
                userVerifyDTO.Name = user.FirstName + " " + user.LastName;
                userVerifyDTOs.Add(userVerifyDTO);
            }

            return userVerifyDTOs;
        }

        private string resolveImage (string oldImage, IFormFile newImage, string username)
        {


            if (oldImage != null)
            {
                if (File.Exists(oldImage))
                {
                    File.Delete(oldImage);
                }
            }

            string imagePath = "C:\\Images\\Users";
            
            string imageName = username + Path.GetExtension(newImage.FileName);
            imagePath = Path.Combine(imagePath, imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create, FileAccess.Write))
            {
                newImage.CopyToAsync(fileStream);
            }

            return imagePath;
        }

        public async Task<ProfileImageDTO> getProfileImage(long id)
        {
            User user = await _repository._userRepository.Get(id);
            ProfileImageDTO profileImage = new ProfileImageDTO();
            profileImage.Name = user.FirstName + user.LastName;
            profileImage.Picture = user.Picture;
            return profileImage;
        }

        public async Task<User> getUser(long id)
        {
            return  await  _repository._userRepository.Get(id);
        }

        public async Task<List<UserVerifyDTO>> verifyUser(long id)
        {
            User user = await _repository._userRepository.Get(id);
            user.UserStatus = UserStatus.VERIFIED;
            _repository._userRepository.Update(user);
            await _repository.SaveChanges();

            string message = "You have been approved!";
            await _mailService.SendEmail("Verification approved", message, user.Email);
            return await getSellersForVerification();
        }

        public async Task<List<UserVerifyDTO>> rejectUser(long id)
        {
            User user = await _repository._userRepository.Get(id);
            user.UserStatus = UserStatus.REJECTED;
            _repository._userRepository.Update(user);
            await _repository.SaveChanges();

            string message = "You have been rejected!";
            await _mailService.SendEmail("Verification rejected", message, user.Email);
            return await getSellersForVerification();
        }
    }
}
