using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.model;

namespace server.controller
{
    [Route("api/admin/complaints")]
    [ApiController]
    public class AdminComplaintController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminComplaintController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? status, [FromQuery] string? priority)
        {
            var q = _db.Complaints.AsQueryable();
            if (!string.IsNullOrWhiteSpace(status)) q = q.Where(c => c.Status == status);
            if (!string.IsNullOrWhiteSpace(priority)) q = q.Where(c => c.Priority == priority);
            var list = await q.OrderByDescending(c => c.CreatedAt).ToListAsync();
            return Ok(list);
        }

        [HttpPut("{id}/assign")]
        public async Task<IActionResult> Assign([FromRoute] int id, [FromBody] string assignedTo)
        {
            var entity = await _db.Complaints.FindAsync(id);
            if (entity == null) return NotFound();
            entity.AssignedTo = assignedTo;
            entity.Status = entity.Status == "Pending" ? "Open" : entity.Status;
            entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus([FromRoute] int id, [FromBody] string status)
        {
            var entity = await _db.Complaints.FindAsync(id);
            if (entity == null) return NotFound();
            entity.Status = status;
            entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(entity);
        }
    }
}


