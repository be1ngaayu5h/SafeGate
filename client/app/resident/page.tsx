"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, QrCode, Clock, CheckCircle, XCircle, Calendar, RotateCcw } from "lucide-react";
import { VisitorModal } from "@/components/visitor-modal";
import { NewVisitorModal } from "@/components/new-visitor-modal";
import { ResidentService } from "@/service/residentService";
import { QRScannerModal } from "@/components/qr-scanner-modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface VisitorRequest {
  id: number;
  name: string;
  phone?: string;
  purpose: string;
  date: string;
  timeSlot?: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "COMPLETED";
  vehicleNumber?: string;
  company?: string;
  hostName?: string;
  flatNumber: string;
  qrCode?: string;
  approvedBy?: string;
  approvedAt?: string;
  relation: string;
  checkInTime?: string;
}

export default function VisitsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRequest | null>(null);
  const [showNewVisitorModal, setShowNewVisitorModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [visitorList, setVisitorList] = useState<VisitorRequest[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [filteredHistory, setFilteredHistory] = useState<VisitorRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const flatNo = "A101"; // Hardcoded flat number as requested

  useEffect(() => {
    loadVisitorData();
  }, []);

  const loadVisitorData = async () => {
    setIsLoading(true);
    try {
      const [pendingResp, todayResp, scheduledResp] = await Promise.all([
        ResidentService.getPendingApprovals(flatNo),
        ResidentService.getTodayVisits(flatNo),
        ResidentService.getScheduledVisits(flatNo)
      ]);

      const pending = pendingResp.data || [];
      const today = todayResp.data || [];
      const scheduled = scheduledResp.data || [];

      // Combine all visitors and map to consistent format
      const allVisitors = [...pending, ...today, ...scheduled].map((v: any) => ({
        id: v.id,
        name: v.name,
        phone: v.phone || "",
        purpose: v.purpose,
        date: v.visitDate || new Date().toISOString().slice(0, 10),
        timeSlot: v.timeSlot || "",
        status: v.status === "PENDING" ? "PENDING" : 
                v.status === "APPROVED" ? "APPROVED" : 
                v.status === "DECLINED" ? "DECLINED" : "COMPLETED",
        vehicleNumber: v.vehicleNumber || "",
        company: v.company || "",
        hostName: v.hostName || "Resident",
        flatNumber: v.flatNo || flatNo,
        qrCode: String(v.id),
        approvedBy: v.approvedBy || "",
        approvedAt: v.approvedAt || "",
        relation: v.relation || "",
        checkInTime: v.checkInTime || ""
      }));

      setVisitorList(allVisitors);
    } catch (error) {
      console.error("Error loading visitor data:", error);
      toast.error("Failed to load visitor data");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVisitors = visitorList.filter((visitor) => {
    if (selectedTab === "all") return true;
    return visitor.status.toLowerCase() === selectedTab.toLowerCase();
  });

  const handleAddVisitor = async (newVisitor: any) => {
    try {
      await ResidentService.scheduleVisit({
        name: newVisitor.name,
        flatNo,
        purpose: newVisitor.purpose,
        relation: newVisitor.relation,
      });
      toast.success("Visit scheduled successfully!");
      setShowNewVisitorModal(false);
      loadVisitorData(); // Refresh the list
    } catch (error) {
      console.error("Error scheduling visit:", error);
      toast.error("Failed to schedule visit");
    }
  };

  const handleApproveVisit = async (visitorId: number) => {
    try {
      await ResidentService.approveVisit(visitorId);
      toast.success("Visit approved successfully!");
      loadVisitorData(); // Refresh the list
    } catch (error) {
      console.error("Error approving visit:", error);
      toast.error("Failed to approve visit");
    }
  };

  const handleDeclineVisit = async (visitorId: number) => {
    try {
      await ResidentService.declineVisit(visitorId);
      toast.success("Visit declined successfully!");
      loadVisitorData(); // Refresh the list
    } catch (error) {
      console.error("Error declining visit:", error);
      toast.error("Failed to decline visit");
    }
  };

  const applyFilter = async () => {
    if (!filterDate) return;
    try {
      const resp = await ResidentService.getScheduledVisits(flatNo, filterDate);
      const visitors = resp.data || [];
      const mapped = visitors.map((v: any) => ({
        id: v.id,
        name: v.name,
        phone: v.phone || "",
        purpose: v.purpose,
        date: v.visitDate || filterDate,
        timeSlot: v.timeSlot || "",
        status: v.status === "PENDING" ? "PENDING" : 
                v.status === "APPROVED" ? "APPROVED" : 
                v.status === "DECLINED" ? "DECLINED" : "COMPLETED",
        vehicleNumber: v.vehicleNumber || "",
        company: v.company || "",
        hostName: v.hostName || "Resident",
        flatNumber: v.flatNo || flatNo,
        qrCode: String(v.id),
        approvedBy: v.approvedBy || "",
        approvedAt: v.approvedAt || "",
        relation: v.relation || "",
        checkInTime: v.checkInTime || ""
      }));
      setFilteredHistory(mapped);
    } catch (error) {
      console.error("Error applying filter:", error);
      toast.error("Failed to filter visits");
    }
  };

  const resetFilter = () => {
    setFilterDate("");
    setFilteredHistory([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "DECLINED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />;
      case "DECLINED":
        return <XCircle className="w-4 h-4" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
          <p className="text-gray-600">
            Manage visitor requests and access for Flat {flatNo}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewVisitorModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Visit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{visitorList.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {visitorList.filter((v) => v.status === "PENDING").length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">
                  {visitorList.filter((v) => v.status === "APPROVED").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold">
                  {visitorList.filter((v) => v.date === new Date().toISOString().slice(0, 10)).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredVisitors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No visitor requests found</div>
          ) : (
            filteredVisitors.map((visitor) => (
              <Card
                key={visitor.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{visitor.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={getStatusColor(visitor.status)}
                      >
                        <div className="flex items-center gap-1">
                          {getStatusIcon(visitor.status)}
                          {visitor.status}
                        </div>
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">ID: {visitor.id}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <span>Purpose: {visitor.purpose}</span>
                      <span>Date: {visitor.date}</span>
                      <span>Relation: {visitor.relation}</span>
                      <span>Phone: {visitor.phone || "N/A"}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVisitor(visitor)}
                      >
                        View Details
                      </Button>
                      {visitor.status === "PENDING" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproveVisit(visitor.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeclineVisit(visitor.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Deny
                          </Button>
                        </>
                      )}
                      {visitor.status === "APPROVED" && (
                        <Button variant="outline" size="sm">
                          <QrCode className="w-4 h-4 mr-1" />
                          Show QR
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : visitorList.filter(v => v.status === "PENDING").length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No pending requests</div>
          ) : (
            visitorList.filter(v => v.status === "PENDING").map((visitor) => (
              <Card
                key={visitor.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{visitor.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={getStatusColor(visitor.status)}
                      >
                        <div className="flex items-center gap-1">
                          {getStatusIcon(visitor.status)}
                          {visitor.status}
                        </div>
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">ID: {visitor.id}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <span>Purpose: {visitor.purpose}</span>
                      <span>Date: {visitor.date}</span>
                      <span>Relation: {visitor.relation}</span>
                      <span>Phone: {visitor.phone || "N/A"}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVisitor(visitor)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveVisit(visitor.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeclineVisit(visitor.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Deny
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : visitorList.filter(v => v.status === "APPROVED").length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No approved requests</div>
          ) : (
            visitorList.filter(v => v.status === "APPROVED").map((visitor) => (
              <Card
                key={visitor.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{visitor.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={getStatusColor(visitor.status)}
                      >
                        <div className="flex items-center gap-1">
                          {getStatusIcon(visitor.status)}
                          {visitor.status}
                        </div>
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">ID: {visitor.id}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <span>Purpose: {visitor.purpose}</span>
                      <span>Date: {visitor.date}</span>
                      <span>Relation: {visitor.relation}</span>
                      <span>Phone: {visitor.phone || "N/A"}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVisitor(visitor)}
                      >
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <QrCode className="w-4 h-4 mr-1" />
                        Show QR
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filter by Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-center mb-3">
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="max-w-xs"
                />
                <Button onClick={applyFilter}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" onClick={resetFilter}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              <div className="space-y-3">
                {filteredHistory.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    {filterDate ? `No visits on ${filterDate}` : "Select a date to filter visits"}
                  </div>
                ) : (
                  filteredHistory.map((visitor) => (
                    <div
                      key={visitor.id}
                      className="flex items-center justify-between border rounded p-3"
                    >
                      <div>
                        <div className="font-medium">{visitor.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Purpose: {visitor.purpose} | Date: {visitor.date} | Status: {visitor.status}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={getStatusColor(visitor.status)}
                      >
                        {visitor.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedVisitor && (
        <VisitorModal
          visitor={selectedVisitor}
          onClose={() => setSelectedVisitor(null)}
        />
      )}

      {showNewVisitorModal && (
        <NewVisitorModal
          onClose={() => setShowNewVisitorModal(false)}
          onSubmit={handleAddVisitor}
        />
      )}

      {showQRScanner && (
        <QRScannerModal onClose={() => setShowQRScanner(false)} />
      )}
    </div>
  );
}
