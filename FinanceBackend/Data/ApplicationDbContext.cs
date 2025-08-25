using FinanceBackend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FinanceBackend.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<SocietyAdmin> SocietyAdmins { get; set; }
        public DbSet<Society> Societies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Society>().Property(s => s.Cash).HasPrecision(18, 2);
            modelBuilder.Entity<Society>().Property(s => s.Bonus).HasPrecision(18, 2);
            modelBuilder.Entity<Society>().Property(s => s.LAS).HasPrecision(18, 2);
            modelBuilder.Entity<Society>().Property(s => s.Dividend).HasPrecision(18, 2);
            modelBuilder.Entity<Society>().Property(s => s.Overdraft).HasPrecision(18, 2);
            modelBuilder.Entity<Society>().Property(s => s.CurrentDeposit).HasPrecision(18, 2);
            modelBuilder.Entity<Society>().Property(s => s.Loan).HasPrecision(18, 2);
            modelBuilder.Entity<Society>().Property(s => s.EmergencyLoan).HasPrecision(18, 2);
            modelBuilder.Entity<Society>().Property(s => s.ShareLimit).HasPrecision(18, 2);
            modelBuilder.Entity<Society>().Property(s => s.LoanLimit).HasPrecision(18, 2);
            modelBuilder.Entity<Society>().Property(s => s.EmergencyLoanLimit).HasPrecision(18, 2);
            modelBuilder.Entity<Society>().Property(s => s.ChequeBounceCharge).HasPrecision(18, 2);
            modelBuilder.Entity<Society>().Property(s => s.ChequeReturnCharge).HasPrecision(18, 2);
        }
    }
}
