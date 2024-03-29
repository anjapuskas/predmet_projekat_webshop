﻿using WebShop.Model;

namespace WebShop.DTO
{
    public class UserVerifyDTO
    {
        public int Id { get; set; }     
        public string Name { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string DateOfBirth { get; set; }
        public string UserStatus { get; set; }
    }
}
