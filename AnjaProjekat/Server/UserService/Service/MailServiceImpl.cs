using AutoMapper;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using UserService.Data;
using UserService.DTO;
using UserService.Model;
using UserService.Service.Interface;

namespace UserService.Service
{
    public class MailServiceImpl : IMailService
    {

        private readonly IConfiguration _configuration;


        public MailServiceImpl(IConfiguration configuration)
        {
            _configuration = configuration;

        }

        public async Task SendEmail(string subject, string body, string to)
        {
            var message = new MimeMessage
            {
                Subject = subject,
                Body = new TextPart(MimeKit.Text.TextFormat.Plain) { Text = body },
            };

            message.From.Add(new MailboxAddress(_configuration["Email:UserName"], _configuration["Email:From"]));
            message.To.Add(MailboxAddress.Parse(to));

            SmtpClient smtp = new SmtpClient();
            smtp.CheckCertificateRevocation = false;
            await smtp.ConnectAsync(_configuration["Email:Host"], int.Parse(_configuration["Email:Port"]!), SecureSocketOptions.Auto);
            await smtp.AuthenticateAsync(_configuration["Email:From"], _configuration["Email:Password"]);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
    }
}
