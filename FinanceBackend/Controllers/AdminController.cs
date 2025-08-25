// using FinanceBackend.Data;
// using FinanceBackend.Models;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.IdentityModel.Tokens;
// using System.IdentityModel.Tokens.Jwt;
// using System.Security.Claims;
// using System.Security.Cryptography;
// using System.Text;

// namespace FinanceBackend.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class AdminController : ControllerBase
//     {
//         private readonly ApplicationDbContext _context;
//         private readonly IConfiguration _config;

//         public AdminController(ApplicationDbContext context, IConfiguration config)
//         {
//             _context = context;
//             _config = config;
//         }

//         // ✅ Password Hash
//         private string HashPassword(string password)
//         {
//             using var sha256 = SHA256.Create();
//             var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
//             return Convert.ToBase64String(bytes);
//         }

//         // ✅ Signup (Admin only)
//         [HttpPost("signup")]
//         public async Task<IActionResult> Signup([FromBody] AdminSignupDto request)
//         {
//             if (await _context.Admins.AnyAsync(a => a.Username == request.Username))
//                 return BadRequest("Username already exists");

//             var admin = new Admin
//             {
//                 Username = request.Username,
//                 PasswordHash = HashPassword(request.Password)
//             };

//             _context.Admins.Add(admin);
//             await _context.SaveChangesAsync();

//             return Ok(new { message = "Admin registered successfully" });
//         }

//         // ✅ Login (Admin or SocietyAdmin)
//         [HttpPost("login")]
//         public async Task<IActionResult> Login([FromBody] AdminLoginDto request)
//         {
//             var hashed = HashPassword(request.Password);

//             // 1️⃣ Check Admin table
//             var admin = await _context.Admins
//                 .FirstOrDefaultAsync(a => a.Username == request.Username && a.PasswordHash == hashed);

//             if (admin != null)
//             {
//                 var token = GenerateJwtToken(admin.Username, "Admin");
//                 return Ok(new { token });
//             }

//             // 2️⃣ Check SocietyAdmin table
//             var societyAdmin = await _context.SocietyAdmins
//                 .FirstOrDefaultAsync(sa => sa.Username == request.Username && sa.PasswordHash == hashed);

//             if (societyAdmin != null)
//             {
//                 var token = GenerateJwtToken(societyAdmin.Username, "SocietyAdmin");
//                 return Ok(new { token });
//             }

//             // 3️⃣ Invalid credentials
//             return Unauthorized("Invalid credentials");
//         }

//         // ✅ Generate JWT dynamically based on role
//         private string GenerateJwtToken(string username, string role)
//         {
//             var claims = new[]
//             {
//                 new Claim(JwtRegisteredClaimNames.Sub, username),
//                 new Claim(ClaimTypes.Role, role),
//                 new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
//             };

//             var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
//             var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//             var token = new JwtSecurityToken(
//                 issuer: _config["Jwt:Issuer"],
//                 audience: _config["Jwt:Audience"],
//                 claims: claims,
//                 expires: DateTime.UtcNow.AddHours(1),
//                 signingCredentials: creds
//             );

//             return new JwtSecurityTokenHandler().WriteToken(token);
//         }
//     }
// }


using FinanceBackend.Data;
using FinanceBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FinanceBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AdminController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] AdminSignupDto request)
        {
            if (await _context.Admins.AnyAsync(a => a.Username == request.Username))
                return BadRequest("Username already exists");

            var admin = new Admin
            {
                Username = request.Username,
                PasswordHash = HashPassword(request.Password)
            };

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Admin registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginDto request)
        {
            var hashed = HashPassword(request.Password);

            // 1️⃣ Try Admin login first
            var admin = await _context.Admins
                .FirstOrDefaultAsync(a => a.Username == request.Username && a.PasswordHash == hashed);

            if (admin != null)
            {
                var token = GenerateJwtToken(admin.Username, "Admin");
                return Ok(new { token });
            }

            // 2️⃣ If Admin login fails, try SocietyAdmin
            var societyAdmin = await _context.SocietyAdmins
                .FirstOrDefaultAsync(s => s.Username == request.Username && s.PasswordHash == hashed);

            if (societyAdmin != null)
            {
                var token = GenerateJwtToken(societyAdmin.Username, "SocietyAdmin");
                return Ok(new { token });
            }

            return Unauthorized("Invalid credentials");
        }

        private string GenerateJwtToken(string username, string role)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
