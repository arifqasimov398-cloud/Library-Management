namespace Web.Domain
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public  DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Reader> Readers { get; set; }
        protected override void OnModelCreating(ModelBuilder mdb)
        {
            mdb.Entity<Book>(entity => { 
                entity.Property(e=>e.Title).HasMaxLength(150).IsRequired();
                entity.Property(e=> e.Price).HasColumnType("decimal(10,2)");
                entity.Property(e => e.CategoryId).IsRequired();
                entity.Property(e => e.Author).HasMaxLength(100);
                entity.HasOne(e=> e.Category)
                    .WithMany(c => c.Books)
                    .HasForeignKey(b => b.CategoryId);
              
            });
            mdb.Entity<Category>(entity =>
            {
                entity.Property(e => e.Name).HasMaxLength(50).IsRequired();
                entity.Property(c => c.Id).ValueGeneratedOnAdd();
            });
            mdb.Entity<Reader>(entity =>
            {
                entity.Property(e => e.FullName).HasMaxLength(100).IsRequired();
                entity.Property(e=> e.Email).HasMaxLength(100).IsRequired();
            });

        }
    }
}
