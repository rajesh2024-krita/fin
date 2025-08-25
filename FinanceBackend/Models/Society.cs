namespace FinanceBackend.Models
{
    public class Society
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // changed from SocietyName
        public string RegistrationNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Fax { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public decimal Dividend { get; set; }
        public decimal Overdraft { get; set; }
        public decimal CurrentDeposit { get; set; }
        public decimal Loan { get; set; }
        public decimal EmergencyLoan { get; set; }
        public decimal LAS { get; set; } // changed from Las
        public decimal ShareLimit { get; set; }
        public decimal LoanLimit { get; set; }
        public decimal EmergencyLoanLimit { get; set; }
        public decimal ChequeBounceCharge { get; set; }
        public decimal ChequeReturnCharge { get; set; }
        public decimal Cash { get; set; }
        public decimal Bonus { get; set; }
    }
}
