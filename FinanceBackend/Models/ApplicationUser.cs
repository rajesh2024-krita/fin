using Microsoft.AspNetCore.Identity;

namespace FinanceBackend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public int? SocietyId { get; set; }
    }
}
