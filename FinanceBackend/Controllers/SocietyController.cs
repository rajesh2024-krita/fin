using FinanceBackend.Data;
using FinanceBackend.Models;
using FinanceBackend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace FinanceBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SocietyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SocietyController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password ?? ""));
            return Convert.ToBase64String(bytes);
        }

        [HttpPost("create-with-admin")]
        [Authorize] // Authorization required
        public async Task<IActionResult> CreateSocietyWithAdmin([FromBody] CreateSocietyWithAdminDto dto)
        {
            // 1️⃣ Create Society
            var society = new Society
            {
                Name = dto.Name,
                RegistrationNumber = dto.RegistrationNumber,
                Address = dto.Address,
                City = dto.City,
                Phone = dto.Phone,
                Fax = dto.Fax,
                Email = dto.Email,
                Website = dto.Website,
                Dividend = dto.Dividend,
                Overdraft = dto.Overdraft,
                CurrentDeposit = dto.CurrentDeposit,
                Loan = dto.Loan,
                EmergencyLoan = dto.EmergencyLoan,
                LAS = dto.LAS,
                ShareLimit = dto.ShareLimit,
                LoanLimit = dto.LoanLimit,
                EmergencyLoanLimit = dto.EmergencyLoanLimit,
                ChequeBounceCharge = dto.ChequeBounceCharge,
                ChequeReturnCharge = dto.ChequeReturnCharge,
                Cash = dto.Cash,
                Bonus = dto.Bonus
            };

            _context.Societies.Add(society);
            await _context.SaveChangesAsync();

            // 2️⃣ Create SocietyAdmin
            var societyAdmin = new SocietyAdmin
            {
                Username = dto.AdminFullName,
                Email = dto.AdminEmail,
                PasswordHash = HashPassword(dto.AdminPassword),
                SocietyId = society.Id
            };

            _context.SocietyAdmins.Add(societyAdmin);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Society and Society Admin created successfully",
                SocietyId = society.Id,
                SocietyAdminId = societyAdmin.Id
            });
        }
    }
}
