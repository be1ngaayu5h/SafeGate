"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GuardService } from "@/service/guardService";
import { toast } from "sonner";
import { Clock, CheckCircle } from "lucide-react";

interface VisitorRequest {
  id: number;
  name: string;
  flatNo: string;
  relation: string;
  purpose: string;
  visitDate: string;
  checkInTime?: string;
  // checkOutTime removed - guards can only check in visitors
  status: "PENDING" | "APPROVED" | "DECLINED";
  createdByResident: boolean;
}

export function VisitorManagement() {
  const [visitors, setVisitors] = useState<VisitorRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    try {
      const response = await GuardService.requestVisitStatus();
      setVisitors(response.data);
    } catch (error) {
      toast.error("Failed to load visitors");
      console.error("Error loading visitors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Guards can only view visitor requests, not approve/deny them
  // Approval/denial is the resident's responsibility

  // Guards can only check in visitors, not check them out
  // Checkout functionality is not available for guards

  const handleCheckinVisitor = async (visitorId: number) => {
    try {
      await GuardService.checkinVisitor(visitorId);
      toast.success("Visitor checked in successfully!");
      loadVisitors(); // Refresh the list
    } catch (error) {
      toast.error("Failed to check in visitor");
      console.error("Error checking in visitor:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "APPROVED":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case "DECLINED":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return "Not set";
    return new Date(dateTimeString).toLocaleString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading visitors...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Management</CardTitle>
        <CardDescription>
          Manage visitor requests and track entry/exit
        </CardDescription>
      </CardHeader>
      <CardContent>
        {visitors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No visitor requests found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Flat</TableHead>
                <TableHead>Relation</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">{visitor.name}</TableCell>
                  <TableCell>{visitor.flatNo}</TableCell>
                  <TableCell>{visitor.relation}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={visitor.purpose}>
                    {visitor.purpose}
                  </TableCell>
                  <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                  <TableCell>
                    {visitor.checkInTime ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {formatDateTime(visitor.checkInTime)}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Not checked in
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      {/* Guards can only check in approved visitors */}
                      {visitor.status === "APPROVED" && !visitor.checkInTime && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckinVisitor(visitor.id)}
                          className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Check In
                        </Button>
                      )}
                      {/* For pending visitors, guards can only view - no actions */}
                      {visitor.status === "PENDING" && (
                        <span className="text-sm text-muted-foreground">
                          Awaiting resident approval
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
