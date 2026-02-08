import axios from "axios";

export class ResidentService {
  static async requestVisit(body: any) {
    return await axios.post("http://localhost:8080/resident/request-visit", body);
  }

  static async requestVisitStatus() {
    return await axios.get("http://localhost:8080/resident/request-visit-status");
  }

  // Visitor management methods for residents - using Java backend
  static async getPendingApprovals(flatNo: string) {
    return await axios.get(`http://localhost:8080/resident/pending-approvals`, {
      params: { flatNo }
    });
  }

  static async approveVisit(visitorId: number) {
    return await axios.post(`http://localhost:8080/resident/approve-visit/${visitorId}`);
  }

  static async declineVisit(visitorId: number) {
    return await axios.post(`http://localhost:8080/resident/decline-visit/${visitorId}`);
  }

  static async getTodayVisits(flatNo: string) {
    return await axios.get(`http://localhost:8080/resident/today-visits`, {
      params: { flatNo }
    });
  }

  static async getScheduledVisits(flatNo: string, date?: string) {
    const params: any = { flatNo };
    if (date) params.date = date;
    return await axios.get(`http://localhost:8080/resident/scheduled-visits`, { params });
  }

  static async scheduleVisit(body: any) {
    return await axios.post("http://localhost:8080/resident/schedule-visit", body);
  }

  // Package management methods for residents - using .NET backend
  static async createPackage(packageData: any) {
    return await axios.post(`http://localhost:5192/api/packages`, packageData);
  }

  static async getPackages(flatNo?: string, status?: string, date?: Date) {
    const params: any = {};
    if (flatNo) params.flatNo = flatNo;
    if (status) params.status = status;
    if (date) params.date = date.toISOString().split('T')[0];
    
    return await axios.get(`http://localhost:5192/api/packages`, { params });
  }

  static async updatePackageDetails(id: number, packageData: any) {
    return await axios.put(`http://localhost:5192/api/packages/${id}/details`, packageData);
  }

  // .NET Complaint endpoints for resident
  static async listComplaints(flatNo?: string) {
    const params = flatNo ? { flatNo } : {};
    return await axios.get(`http://localhost:5192/api/resident/complaints`, {
      params,
    });
  }

  static async createComplaint(body: any) {
    return await axios.post(
      `http://localhost:5192/api/resident/complaints`,
      body,
    );
  }

  static async updateComplaint(id: number, body: any) {
    return await axios.put(
      `http://localhost:5192/api/resident/complaints/${id}`,
      body,
    );
  }

}
