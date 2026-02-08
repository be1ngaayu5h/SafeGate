import axios from "axios";

export class GuardService {
  static async requestVisit(body: any) {
    return await axios.post("http://localhost:8080/guard/request-visit", body);
  }

  static async requestVisitStatus() {
    return await axios.get("http://localhost:8080/guard/request-visit-status");
  }

  static async validateVisit(visitorId: number) {
    return await axios.get(`http://localhost:8080/guard/validate-visit`, {
      params: { visitorId },
    });
  }

  // Guards can only check in visitors, not check them out
  // Checkout functionality is not available for guards

  static async checkinVisitor(visitorId: number) {
    return await axios.post(
      `http://localhost:8080/guard/visitor/${visitorId}/checkin`
    );
  }

  static async guardCheckIn(guardId: number) {
    return await axios.post(`http://localhost:8080/guard/checkin/${guardId}`);
  }

  static async guardCheckOut(guardId: number) {
    return await axios.post(`http://localhost:8080/guard/checkout/${guardId}`);
  }

  // Package management methods for security guards - using .NET backend
  static async getAllPackages(status?: string, date?: Date) {
    const params: any = {};
    if (status) params.status = status;
    if (date) params.date = date.toISOString().split('T')[0];
    
    return await axios.get(`http://localhost:5192/api/packages`, { params });
  }

  static async getPackagesByStatus(status: string, date?: Date) {
    const params: any = {};
    if (date) params.date = date.toISOString().split('T')[0];
    
    return await axios.get(
      `http://localhost:5192/api/packages/status/${status}`,
      { params }
    );
  }

  static async updatePackageStatus(id: number, status: string) {
    return await axios.put(`http://localhost:5192/api/packages/${id}/status`, {
      status,
    });
  }

  static async getPackageById(id: number) {
    return await axios.get(`http://localhost:5192/api/packages/${id}`);
  }
}
