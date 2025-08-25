
using System.ComponentModel.DataAnnotations;

namespace MemberManagementAPI.Models
{
    public class Member
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string MemberNo { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string FHName { get; set; } = string.Empty;

        public DateTime? DateOfBirth { get; set; }

        [StringLength(10)]
        public string? Mobile { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(100)]
        public string? Designation { get; set; }

        public DateTime? DOJJob { get; set; }

        public DateTime? DORetirement { get; set; }

        [StringLength(100)]
        public string? Branch { get; set; }

        public DateTime? DOJSociety { get; set; }

        [StringLength(500)]
        public string? OfficeAddress { get; set; }

        [StringLength(500)]
        public string? ResidenceAddress { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(20)]
        public string? PhoneOffice { get; set; }

        [StringLength(20)]
        public string? PhoneResidence { get; set; }

        [StringLength(200)]
        public string? Nominee { get; set; }

        [StringLength(50)]
        public string? NomineeRelation { get; set; }

        public decimal ShareAmount { get; set; } = 0;

        public decimal CDAmount { get; set; } = 0;

        [StringLength(100)]
        public string? BankName { get; set; }

        [StringLength(100)]
        public string? PayableAt { get; set; }

        [StringLength(50)]
        public string? AccountNo { get; set; }

        [StringLength(20)]
        public string? Status { get; set; } = "Active";

        public DateTime? Date { get; set; }

        [StringLength(500)]
        public string? PhotoPath { get; set; }

        [StringLength(500)]
        public string? SignaturePath { get; set; }

        public decimal? ShareDeduction { get; set; }

        public decimal? Withdrawal { get; set; }

        public decimal? GLoanInstalment { get; set; }

        public decimal? ELoanInstalment { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
