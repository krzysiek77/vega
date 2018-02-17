using Microsoft.EntityFrameworkCore;
using vega.Models;

namespace vega.Persistence
{
    public class VegaDbContext : DbContext
    {
        public VegaDbContext(DbContextOptions<VegaDbContext> options)
            : base(options)
        {
        }

        public DbSet<Make> Makes { get; set; }
        public DbSet<Model> Models { get; set; }
        public DbSet<Feature> Features { get; set; }

        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehicleFeature> VehicleFeatures { get; set; }

        // composite unique key
        protected override void OnModelCreating (ModelBuilder modelBuilder) 
        {
            modelBuilder.Entity<VehicleFeature>()
                .HasKey(t => new { t.VehicleId, t.FeatureId });
        }
    }
}