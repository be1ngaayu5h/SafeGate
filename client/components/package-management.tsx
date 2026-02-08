"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { GuardService } from "@/service/guardService";
import { OtpVerificationModal } from "@/components/otp-verification-modal";
import { Shield, Package } from "lucide-react";

interface PackageItem {
  id: number;
  trackingNumber: string;
  description: string;
  sender: string;
  residentName: string;
  flatNo: string;
  status: string;
  expectedDate: string;
  deliveredAt?: string;
  deliveryOtp: string;
}

interface PackageManagementProps {
  userRole: "resident" | "security";
  flatNo?: string;
  onUpdatePackage?: (pkg: PackageItem) => void;
}

export function PackageManagement({
  userRole,
  flatNo,
  onUpdatePackage,
}: PackageManagementProps) {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [selectedPackageForOtp, setSelectedPackageForOtp] =
    useState<PackageItem | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, [statusFilter, dateFilter]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      let response;

      if (userRole === "resident") {
        response = await GuardService.getAllPackages(
          statusFilter,
          dateFilter ? new Date(dateFilter) : undefined
        );
      } else {
        if (statusFilter) {
          response = await GuardService.getPackagesByStatus(
            statusFilter,
            dateFilter ? new Date(dateFilter) : undefined
          );
        } else {
          response = await GuardService.getAllPackages(
            undefined,
            dateFilter ? new Date(dateFilter) : undefined
          );
        }
      }

      let filteredPackages = response.data;

      // Filter by flat number for residents
      if (userRole === "resident" && flatNo) {
        filteredPackages = filteredPackages.filter(
          (pkg: PackageItem) => pkg.flatNo === flatNo
        );
      }

      setPackages(filteredPackages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (packageId: number, newStatus: string) => {
    try {
      setUpdatingStatus(packageId);

      if (userRole === "security" && newStatus !== "Delivered") {
        toast.error("Security guards can only update status to 'Delivered'");
        return;
      }

      await GuardService.updatePackageStatus(packageId, newStatus);
      toast.success("Package status updated successfully!");
      fetchPackages();
    } catch (error: any) {
      console.error("Error updating package status:", error);
      const errorMessage =
        error.response?.data || "Failed to update package status";
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleOtpVerification = (pkg: PackageItem) => {
    setSelectedPackageForOtp(pkg);
    setShowOtpModal(true);
  };

  const handleOtpSuccess = () => {
    fetchPackages();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading packages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="statusFilter">Filter by Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateFilter">Filter by Date</Label>
          <Input
            id="dateFilter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setStatusFilter("");
            setDateFilter("");
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Packages List */}
      {packages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No packages found</div>
      ) : (
        <div className="grid gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {pkg.trackingNumber}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      From: {pkg.sender} • To: {pkg.residentName} (Flat{" "}
                      {pkg.flatNo})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        pkg.status === "Delivered" ? "default" : "secondary"
                      }
                    >
                      {pkg.status}
                    </Badge>
                    {pkg.deliveryOtp && (
                      <Badge variant="outline" className="text-xs">
                        OTP: {pkg.deliveryOtp}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-700">{pkg.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>Expected: {formatDate(pkg.expectedDate)}</span>
                    {pkg.deliveredAt && (
                      <span>Delivered: {formatDateTime(pkg.deliveredAt)}</span>
                    )}
                  </div>

                  {/* Status Update Controls */}
                  {userRole === "security" && pkg.status === "Pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleOtpVerification(pkg)}
                        className="flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Verify OTP & Deliver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(pkg.id, "Delivered")}
                        disabled={updatingStatus === pkg.id}
                      >
                        {updatingStatus === pkg.id
                          ? "Updating..."
                          : "Mark as Delivered"}
                      </Button>
                    </div>
                  )}

                  {/* Resident Update Controls */}
                  {userRole === "resident" && pkg.status === "Pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdatePackage?.(pkg)}
                        className="flex items-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        Update Package
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && selectedPackageForOtp && (
        <OtpVerificationModal
          package={selectedPackageForOtp}
          isOpen={showOtpModal}
          onClose={() => {
            setShowOtpModal(false);
            setSelectedPackageForOtp(null);
          }}
          onSuccess={handleOtpSuccess}
        />
      )}
    </div>
  );
}
