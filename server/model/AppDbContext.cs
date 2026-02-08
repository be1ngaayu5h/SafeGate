using Microsoft.EntityFrameworkCore;
using server.model;

namespace server.model;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Complaint> Complaints { get; set; }
    public DbSet<PackageItem> Packages { get; set; }
}
