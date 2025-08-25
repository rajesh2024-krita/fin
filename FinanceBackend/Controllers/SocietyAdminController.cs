// using FinanceBackend.Data;
// using FinanceBackend.Models;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;

// namespace FinanceBackend.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class SocietyAdminController : ControllerBase
//     {
//         private readonly ApplicationDbContext _context;

//         public SocietyAdminController(ApplicationDbContext context)
//         {
//             _context = context;
//         }

//         // ✅ Get all SocietyAdmins
//         [HttpGet]
//         public async Task<ActionResult<IEnumerable<SocietyAdmin>>> GetSocietyAdmins()
//         {
//             return await _context.SocietyAdmins.ToListAsync();
//         }

//         // ✅ Get SocietyAdmin by Id
//         [HttpGet("{id}")]
//         public async Task<ActionResult<SocietyAdmin>> GetSocietyAdmin(int id)
//         {
//             var societyAdmin = await _context.SocietyAdmins.FindAsync(id);

//             if (societyAdmin == null)
//                 return NotFound();

//             return societyAdmin;
//         }

//         // ✅ Create new SocietyAdmin
//         [HttpPost]
//         public async Task<ActionResult<SocietyAdmin>> CreateSocietyAdmin(SocietyAdmin societyAdmin)
//         {
//             _context.SocietyAdmins.Add(societyAdmin);
//             await _context.SaveChangesAsync();

//             return CreatedAtAction(nameof(GetSocietyAdmin), new { id = societyAdmin.Id }, societyAdmin);
//         }

//         // ✅ Update SocietyAdmin
//         [HttpPut("{id}")]
//         public async Task<IActionResult> UpdateSocietyAdmin(int id, SocietyAdmin societyAdmin)
//         {
//             if (id != societyAdmin.Id)
//                 return BadRequest();

//             _context.Entry(societyAdmin).State = EntityState.Modified;

//             try
//             {
//                 await _context.SaveChangesAsync();
//             }
//             catch (DbUpdateConcurrencyException)
//             {
//                 if (!_context.SocietyAdmins.Any(e => e.Id == id))
//                     return NotFound();
//                 else
//                     throw;
//             }

//             return NoContent();
//         }

//         // ✅ Delete SocietyAdmin
//         [HttpDelete("{id}")]
//         public async Task<IActionResult> DeleteSocietyAdmin(int id)
//         {
//             var societyAdmin = await _context.SocietyAdmins.FindAsync(id);
//             if (societyAdmin == null)
//                 return NotFound();

//             _context.SocietyAdmins.Remove(societyAdmin);
//             await _context.SaveChangesAsync();

//             return NoContent();
//         }
//     }
// }

using FinanceBackend.Data;
using FinanceBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SocietyAdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SocietyAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SocietyAdmin>>> GetSocietyAdmins()
        {
            return await _context.SocietyAdmins.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SocietyAdmin>> GetSocietyAdmin(int id)
        {
            var societyAdmin = await _context.SocietyAdmins.FindAsync(id);
            if (societyAdmin == null) return NotFound();
            return societyAdmin;
        }

        [HttpPost]
        public async Task<ActionResult<SocietyAdmin>> CreateSocietyAdmin(SocietyAdmin societyAdmin)
        {
            _context.SocietyAdmins.Add(societyAdmin);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSocietyAdmin), new { id = societyAdmin.Id }, societyAdmin);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSocietyAdmin(int id, SocietyAdmin societyAdmin)
        {
            if (id != societyAdmin.Id) return BadRequest();
            _context.Entry(societyAdmin).State = EntityState.Modified;

            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.SocietyAdmins.Any(e => e.Id == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSocietyAdmin(int id)
        {
            var societyAdmin = await _context.SocietyAdmins.FindAsync(id);
            if (societyAdmin == null) return NotFound();
            _context.SocietyAdmins.Remove(societyAdmin);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
