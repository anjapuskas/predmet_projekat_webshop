using UserService.Data;

namespace UserService.Service
{
    public class JobService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        public JobService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<EShopDbContext>();

                    // Pronađite porudžbine koje treba ažurirati
                    var orders = dbContext.Order
                        .Where(o => o.OrderStatus == Model.OrderStatus.ORDERED && o.DeliveryTime <= DateTime.Now)
                        .ToList();

                    // Ažurirajte status porudžbina
                    foreach (var order in orders)
                    {
                        order.OrderStatus = Model.OrderStatus.DELIVERED;
                    }

                    await dbContext.SaveChangesAsync();
                }
                

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
