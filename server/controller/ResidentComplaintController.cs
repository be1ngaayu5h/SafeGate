using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.model;

namespace server.controller
{
    [Route("api/resident/complaints")]
    [ApiController]
    public class ResidentComplaintController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ResidentComplaintController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? flatNo)
        {
            var query = _db.Complaints.AsQueryable();
            if (!string.IsNullOrWhiteSpace(flatNo)) query = query.Where(c => c.FlatNo == flatNo);
            var list = await query.OrderByDescending(c => c.CreatedAt).ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var item = await _db.Complaints.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        public class CreateComplaintDto
        {
            public string Title { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public string Category { get; set; } = string.Empty;
            public string Priority { get; set; } = "Medium";
            public string ResidentName { get; set; } = string.Empty;
            public string FlatNo { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateComplaintDto dto)
        {
            var entity = new Complaint
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                Priority = dto.Priority,
                ResidentName = dto.ResidentName,
                FlatNo = dto.FlatNo,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };
            _db.Complaints.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(entity);
        }

        public class UpdateComplaintDto
        {
            public string? Title { get; set; }
            public string? Description { get; set; }
            public string? Category { get; set; }
            public string? Priority { get; set; }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateComplaintDto dto)
        {
            var entity = await _db.Complaints.FindAsync(id);
            if (entity == null) return NotFound();
            if (dto.Title != null) entity.Title = dto.Title;
            if (dto.Description != null) entity.Description = dto.Description;
            if (dto.Category != null) entity.Category = dto.Category;
            if (dto.Priority != null) entity.Priority = dto.Priority;
            entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(entity);
        }
    }
}


