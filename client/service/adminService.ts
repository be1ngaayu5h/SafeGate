import axios from "axios";

export class AdminService {
  static async addGuard(body: any) {
    return await axios.post("http://localhost:8080/admin/add-guard", body);
  }
  static async getGuards() {
    return await axios.get("http://localhost:8080/admin/get-guards");
  }

  static async addResident(body: any) {
    return await axios.post("http://localhost:8080/admin/add-resident", body);
  }

  static async getResidents() {
    return await axios.get("http://localhost:8080/admin/get-residents");
  }
  static async getActiveVisitors() {
    return await axios.get("http://localhost:8080/admin/active-visitors");
  }

  static async getResidentVisitorRequests(flatNo: string) {
    return await axios.get("http://localhost:8080/resident/visitor-requests", {
      params: { flatNo },
    });
  }

  static async approveVisit(visitorId: number) {
    return await axios.post(
      `http://localhost:8080/resident/approve-visit/${visitorId}`,
    );
  }

  static async declineVisit(visitorId: number) {
    return await axios.post(
      `http://localhost:8080/resident/decline-visit/${visitorId}`,
    );
  }

  static async scheduleVisit(body: {
    name: string;
    flatNo: string;
    purpose: string;
    relation: string;
  }) {
    return await axios.post(
      `http://localhost:8080/resident/schedule-visit`,
      body,
    );
  }

  static async getResidentTodayVisits(flatNo: string) {
    return await axios.get("http://localhost:8080/resident/today-visits", {
      params: { flatNo },
    });
  }

  static async getPendingApprovals(flatNo: string) {
    return await axios.get("http://localhost:8080/resident/pending-approvals", {
      params: { flatNo },
    });
  }

  static async getScheduledVisits(flatNo: string, date?: string) {
    const params = date ? { flatNo, date } : { flatNo };
    return await axios.get("http://localhost:8080/resident/scheduled-visits", {
      params,
    });
  }

  static async searchResidents(searchTerm?: string) {
    const params = searchTerm ? { search: searchTerm } : {};
    return await axios.get("http://localhost:8080/admin/search-residents", {
      params,
    });
  }

  static async getResident(id: number) {
    return await axios.get(`http://localhost:8080/admin/resident/${id}`);
  }

  static async updateResident(id: number, body: any) {
    return await axios.put(
      `http://localhost:8080/admin/update-resident/${id}`,
      body,
    );
  }

  static async searchGuards(searchTerm?: string) {
    const params = searchTerm ? { search: searchTerm } : {};
    return await axios.get("http://localhost:8080/admin/search-guards", {
      params,
    });
  }

  static async getGuard(id: number) {
    return await axios.get(`http://localhost:8080/admin/guard/${id}`);
  }

  static async updateGuard(id: number, body: any) {
    return await axios.put(
      `http://localhost:8080/admin/update-guard/${id}`,
      body,
    );
  }

  static async getGuardsByDate(date: string) {
    return await axios.get(`http://localhost:8080/admin/guards-by-date`, {
      params: { date },
    });
  }

  // .NET complaint APIs
  static async adminListComplaints(status?: string, priority?: string) {
    const params: any = {};
    if (status) params.status = status;
    if (priority) params.priority = priority;
    
    try {
      const response = await axios.get(`http://localhost:5192/api/admin/complaints`, {
        params,
      });
      return response;
    } catch (error) {
      console.error("Error fetching complaints:", error);
      throw error;
    }
  }

  static async adminAssignComplaint(id: number, assignedTo: string) {
    try {
      const response = await axios.put(
        `http://localhost:5192/api/admin/complaints/${id}/assign`,
        assignedTo,
        { 
          headers: { "Content-Type": "application/json" },
        }
      );
      return response;
    } catch (error) {
      console.error("Error assigning complaint:", error);
      throw error;
    }
  }

  static async adminUpdateComplaintStatus(id: number, status: string) {
    try {
      const response = await axios.put(
        `http://localhost:5192/api/admin/complaints/${id}/status`,
        status,
        { 
          headers: { "Content-Type": "application/json" },
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating complaint status:", error);
      throw error;
    }
  }
}
