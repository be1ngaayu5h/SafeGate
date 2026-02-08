"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Search,
  User,
  Calendar,
  Tag,
  AlertTriangle,
  Clock,
  CheckCircle,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AdminService } from "@/service/adminService";

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Open":
      return "bg-red-100 text-red-800 border-red-200";
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Resolved":
      return "bg-green-100 text-green-800 border-green-200";
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Pending":
      return <Clock className="h-4 w-4" />;
    case "Open":
      return <AlertTriangle className="h-4 w-4" />;
    case "In Progress":
      return <Clock className="h-4 w-4" />;
    case "Resolved":
      return <CheckCircle className="h-4 w-4" />;
    case "Rejected":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
}

export default function ComplaintsPage() {
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignTo, setAssignTo] = useState("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    loadComplaints();
  }, [statusFilter, priorityFilter]);

  async function loadComplaints() {
    try {
      setLoading(true);
      const resp = await AdminService.adminListComplaints(
        statusFilter !== "all" ? statusFilter : undefined
      );
      setItems(resp.data || []);
    } catch (error) {
      console.error("Error loading complaints:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredComplaints = items.filter((complaint) => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.residentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === "all" || 
                           complaint.priority.toLowerCase() === priorityFilter.toLowerCase();
    
    return matchesSearch && matchesPriority;
  });

  const handleAssignComplaint = async (complaintId: number) => {
    if (!assignTo.trim()) {
      alert("Please enter a name to assign the complaint to");
      return;
    }
    
    try {
      await AdminService.adminAssignComplaint(complaintId, assignTo);
      await loadComplaints();
      setAssignTo("");
      alert("Complaint assigned successfully!");
    } catch (error) {
      console.error("Error assigning complaint:", error);
      alert("Failed to assign complaint");
    }
  };

  const handleUpdateStatus = async (complaintId: number) => {
    if (!newStatus.trim()) {
      alert("Please enter a status");
      return;
    }
    
    try {
      await AdminService.adminUpdateComplaintStatus(complaintId, newStatus);
      await loadComplaints();
      setNewStatus("");
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <h1 className="text-2xl font-bold">All Complaints</h1>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search complaints..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Complaints List */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading complaints...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No complaints found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredComplaints.map((complaint) => (
                  <Card
                    key={complaint.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-muted-foreground">
                              #{complaint.id}
                            </span>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(complaint.priority)}
                            >
                              {complaint.priority}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-800 border-gray-200"
                            >
                              {complaint.category}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">
                            {complaint.title}
                          </h3>
                          <p className="text-muted-foreground mb-3">
                            {complaint.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {complaint.residentName} - {complaint.flatNo}
                            </span>
                            <span>
                              {new Date(complaint.createdAt).toLocaleString()}
                            </span>
                            {complaint.assignedTo && (
                              <span className="text-blue-600">
                                Assigned to: {complaint.assignedTo}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant="outline"
                            className={getStatusColor(complaint.status)}
                          >
                            {complaint.status}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedComplaint(complaint)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Complaint Details Modal */}
      <Dialog
        open={!!selectedComplaint}
        onOpenChange={() => setSelectedComplaint(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {selectedComplaint?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-6">
              {/* Complaint Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Complaint Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={getStatusColor(selectedComplaint.status)}
                    >
                      {getStatusIcon(selectedComplaint.status)}
                      <span className="ml-1">{selectedComplaint.status}</span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(selectedComplaint.priority)}
                    >
                      {selectedComplaint.priority} Priority
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-800 border-gray-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {selectedComplaint.category}
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>{selectedComplaint.residentName}</strong> -{" "}
                        {selectedComplaint.flatNo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Submitted on {new Date(selectedComplaint.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">
                      {selectedComplaint.description}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-1">Assign To</h4>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter assignee name"
                          value={assignTo}
                          onChange={(e) => setAssignTo(e.target.value)}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAssignComplaint(selectedComplaint.id)}
                        >
                          Assign
                        </Button>
                      </div>
                      {selectedComplaint.assignedTo && (
                        <p className="text-sm text-blue-600 mt-1">
                          Currently assigned to: {selectedComplaint.assignedTo}
                        </p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Update Status</h4>
                      <div className="flex gap-2">
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(selectedComplaint.id)}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
