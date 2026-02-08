
namespace server.model
{
    public class PackageItem
    {
        public int Id { get; set; }
        public string TrackingNumber { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Sender { get; set; } = string.Empty;
        public string ResidentName { get; set; } = string.Empty;
        public string FlatNo { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending, Delivered
        public DateTime ExpectedDate { get; set; }
        public DateTime? DeliveredAt { get; set; }
        public string DeliveryOtp { get; set; } = string.Empty;
    }
}


