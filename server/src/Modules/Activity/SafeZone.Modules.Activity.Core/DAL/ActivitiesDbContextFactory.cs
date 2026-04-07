// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Design;

// namespace SafeZone.Modules.Activity.Core.DAL;

// internal sealed class ActivitiesDbContextFactory 
//     : IDesignTimeDbContextFactory<ActivitiesDbContext>
// {
//     public ActivitiesDbContext CreateDbContext(string[] args)
//     {
//         var optionsBuilder = new DbContextOptionsBuilder<ActivitiesDbContext>();

//         var connectionString =
//             "Data Source=PSL-AANSONG\\SQLEXPRESS;Database=SafeZone;Integrated Security=True;TrustServerCertificate=True;Encrypt=True;Max Pool Size=100;Min Pool Size=5;Connection Timeout=30;MultipleActiveResultSets=True;";

//         optionsBuilder.UseSqlServer(connectionString);

//         return new ActivitiesDbContext(optionsBuilder.Options);
//     }
// }