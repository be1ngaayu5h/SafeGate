namespace server.model;

public class Complaint
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // Maintenance, Security, etc.
    public string Priority { get; set; } = "Medium"; // Low, Medium, High
    public string Status { get; set; } = "Pending"; // Pending, In Progress, Resolved, Rejected
    public string ResidentName { get; set; } = string.Empty;
    public string FlatNo { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string? AssignedTo { get; set; }
}


