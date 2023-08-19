namespace UserService.Exceptions
{
    public class CredentialsException : Exception
    {
        public CredentialsException()
        {
        }

        public CredentialsException(string message) : base(message)
        {
        }
    }
}
