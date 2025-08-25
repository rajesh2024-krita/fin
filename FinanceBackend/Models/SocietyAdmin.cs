using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceBackend.Models
{
    public class SocietyAdmin
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [ForeignKey("Society")]
        public int SocietyId { get; set; }

        // Make nullable to avoid EF Core errors when not loaded
        public Society? Society { get; set; }
    }
}
