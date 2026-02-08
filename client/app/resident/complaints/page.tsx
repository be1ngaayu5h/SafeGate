"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Clock, CheckCircle, AlertCircle, XCircle, Search } from "lucide-react";
import { ResidentService } from "@/service/residentService";
import { ComplaintModal } from "@/components/complaint-modal";
import { UpdateComplaintModal } from "@/components/update-complaint-modal";
import { NewComplaintModal } from "@/components/new-complaint-modal";
import { Input } from "@/components/ui/input";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Pending":
      return <Clock className="w-4 h-4" />;
    case "Open":
      return <AlertCircle className="w-4 h-4" />;
    case "In Progress":
      return <AlertCircle className="w-4 h-4" />;
    case "Resolved":
      return <CheckCircle className="w-4 h-4" />;
    case "Rejected":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Open":
      return "bg-red-100 text-red-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Resolved":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ComplaintsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [updateComplaint, setUpdateComplaint] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const flatNo = "A101"; // Replace with actual flat no from user context

  async function loadComplaints() {
    try {
      setLoading(true);
      const resp = await ResidentService.listComplaints(flatNo);
      setItems(resp.data || []);
    } catch (error) {
      console.error("Error loading complaints:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  const filteredComplaints = items.filter((complaint) => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = selectedTab === "all" || 
                       complaint.status.toLowerCase().replace(" ", "-") === selectedTab;
    
    return matchesSearch && matchesTab;
  });

  const getComplaintCount = (status: string) => {
    if (status === "all") return items.length;
    return items.filter((c) => c.status === status).length;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="text-gray-600">Manage and track your complaints</p>
        </div>
        <Button onClick={() => setShowNewComplaint(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Complaint
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{getComplaintCount("all")}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{getComplaintCount("Pending")}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{getComplaintCount("In Progress")}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold">{getComplaintCount("Resolved")}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="all">All ({getComplaintCount("all")})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({getComplaintCount("Pending")})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({getComplaintCount("In Progress")})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({getComplaintCount("Resolved")})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({getComplaintCount("Rejected")})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading complaints...</div>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No complaints found</p>
                </CardContent>
              </Card>
            ) : (
              filteredComplaints.map((complaint) => (
                <Card key={complaint.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        <Badge
                          variant="outline"
                          className={getStatusColor(complaint.status)}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(complaint.status)}
                            {complaint.status}
                          </div>
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(complaint.priority)}
                        >
                          {complaint.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: #{complaint.id}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Category: {complaint.category}</span>
                        <span>
                          Date: {new Date(complaint.createdAt).toLocaleString()}
                        </span>
                        {complaint.assignedTo && (
                          <span className="text-blue-600">
                            Assigned to: {complaint.assignedTo}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{complaint.description}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          View Details
                        </Button>
                        {complaint.status !== "Resolved" && complaint.status !== "Rejected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUpdateComplaint(complaint)}
                          >
                            Update
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}

      {updateComplaint && (
        <UpdateComplaintModal
          complaint={updateComplaint}
          onClose={() => setUpdateComplaint(null)}
          onUpdate={async (updated) => {
            await ResidentService.updateComplaint(Number(updateComplaint.id), {
              title: updated.title,
              description: updated.description,
              category: updated.category,
              priority: updated.priority,
            });
            await loadComplaints();
            setUpdateComplaint(null);
          }}
        />
      )}

      {showNewComplaint && (
        <NewComplaintModal
          onClose={() => setShowNewComplaint(false)}
          onSubmit={async (data) => {
            await ResidentService.createComplaint({
              ...data,
              flatNo,
              residentName: "John Doe", // Replace with actual logged-in user name
            });
            await loadComplaints();
            setShowNewComplaint(false);
          }}
        />
      )}
    </div>
  );
}
