using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.model;

namespace server.controller
{
    [Route("api/packages")]
    [ApiController]
    public class PackageController : ControllerBase
    {
        private readonly AppDbContext _db;
        public PackageController(AppDbContext db) { _db = db; }

        // Resident: register package
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PackageItem dto)
        {
            dto.Id = 0;
            _db.Packages.Add(dto);
            await _db.SaveChangesAsync();
            return Ok(dto);
        }

        // Resident/Security: list by flat/status
        [HttpGet]
        public async Task<IActionResult> List([FromQuery] string? flatNo, [FromQuery] string? status, [FromQuery] DateTime? date)
        {
            var q = _db.Packages.AsQueryable();
            if (!string.IsNullOrWhiteSpace(flatNo)) q = q.Where(p => p.FlatNo == flatNo);
            if (!string.IsNullOrWhiteSpace(status)) q = q.Where(p => p.Status == status);
            if (date.HasValue) q = q.Where(p => p.ExpectedDate.Date == date.Value.Date);

            var list = await q.OrderByDescending(p => p.ExpectedDate).ToListAsync();
            return Ok(list);
        }

        // Security: get packages by status only
        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetByStatus([FromRoute] string status, [FromQuery] DateTime? date)
        {
            var q = _db.Packages.Where(p => p.Status == status);
            if (date.HasValue) q = q.Where(p => p.ExpectedDate.Date == date.Value.Date);

            var list = await q.OrderByDescending(p => p.ExpectedDate).ToListAsync();
            return Ok(list);
        }

        // Security: verify OTP and update delivery status
        public class VerifyOtpDto
        {
            public string OTP { get; set; } = string.Empty;
        }

        [HttpPost("{id}/verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromRoute] int id, [FromBody] VerifyOtpDto dto)
        {
            var entity = await _db.Packages.FindAsync(id);
            if (entity == null) return NotFound();

            if (entity.Status == "Delivered")
            {
                return BadRequest("Package has already been delivered");
            }

            if (string.IsNullOrEmpty(entity.DeliveryOtp))
            {
                return BadRequest("Package does not have an OTP configured");
            }

            if (entity.DeliveryOtp != dto.OTP)
            {
                return BadRequest("Invalid OTP. Please check and try again.");
            }

            // OTP verified successfully
            entity.Status = "Delivered";
            entity.DeliveredAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "OTP verified successfully. Package marked as delivered.",
                package = entity
            });
        }

        // Security: update package status
        public class UpdateStatusDto
        {
            public string Status { get; set; } = string.Empty;
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus([FromRoute] int id, [FromBody] UpdateStatusDto dto)
        {
            var entity = await _db.Packages.FindAsync(id);
            if (entity == null) return NotFound();

            // Validate status values
            if (dto.Status != "Pending" && dto.Status != "Delivered")
            {
                return BadRequest("Status can only be 'Pending' or 'Delivered'");
            }

            entity.Status = dto.Status;
            if (dto.Status == "Delivered")
                entity.DeliveredAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(entity);
        }

        // Resident: edit package info before delivery
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] PackageItem dto)
        {
            var entity = await _db.Packages.FindAsync(id);
            if (entity == null) return NotFound();

            // Only allow updating if package is not delivered
            if (entity.Status == "Delivered")
            {
                return BadRequest("Package cannot be updated after it has been delivered");
            }

            Console.WriteLine(dto.TrackingNumber);

            entity.Description = dto.Description;
            entity.Sender = dto.Sender;
            entity.ResidentName = dto.ResidentName;
            entity.FlatNo = dto.FlatNo;
            entity.ExpectedDate = dto.ExpectedDate;
            entity.DeliveryOtp = dto.DeliveryOtp;
            entity.TrackingNumber = dto.TrackingNumber;

            await _db.SaveChangesAsync();
            return Ok(entity);
        }

        // Resident: update package details (alias for Update)
        [HttpPut("{id}/details")]
        public async Task<IActionResult> UpdateDetails([FromRoute] int id, [FromBody] PackageItem dto)
        {
            return await Update(id, dto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var entity = await _db.Packages.FindAsync(id);
            if (entity == null) return NotFound();
            return Ok(entity);
        }
    }
}


