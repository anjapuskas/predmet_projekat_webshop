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
    public class UserServiceImpl : IUserService
    {

        private readonly IMapper _mapper;
        private readonly IMailService _mailService;
        private readonly IRepository _repository;

        public UserServiceImpl(IMapper mapper, IMailService mailService, IRepository repository)
        {
            _mapper = mapper;
            _mailService = mailService; 
            _repository = repository;
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
