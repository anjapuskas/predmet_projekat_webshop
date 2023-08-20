namespace WebShop.Service.Interface
{
    public interface IMailService
    {
        Task SendEmail(string subject, string body, string to);
    }
}
