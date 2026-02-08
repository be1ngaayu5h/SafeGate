"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ViewPackageModal } from "@/components/view-package-modal";
import { UpdateStatusModal } from "@/components/update-status-modal";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Shield,
} from "lucide-react";

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

export default function SecurityDashboardPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(
    null
  );
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, [statusFilter, dateFilter]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      let response;

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

      setPackages(response.data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPackages = () => {
    let filtered = packages;

    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.sender.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getPackageStats = () => {
    const total = packages.length;
    const pending = packages.filter((pkg) => pkg.status === "Pending").length;
    const delivered = packages.filter(
      (pkg) => pkg.status === "Delivered"
    ).length;
    const overdue = packages.filter(
      (pkg) =>
        pkg.status === "Pending" && new Date(pkg.expectedDate) < new Date()
    ).length;

    return { total, pending, delivered, overdue };
  };

  const stats = getPackageStats();
  const filteredPackages = getFilteredPackages();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isOverdue = (expectedDate: string) => {
    return new Date(expectedDate) < new Date();
  };

  const handleViewPackage = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setShowViewModal(true);
  };

  const handleUpdateStatus = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setShowUpdateStatusModal(true);
  };

  const handleStatusUpdate = async (packageId: number, newStatus: string) => {
    try {
      await GuardService.updatePackageStatus(packageId, newStatus);
      toast.success("Package status updated successfully!");
      fetchPackages();
      setShowUpdateStatusModal(false);
      setSelectedPackage(null);
    } catch (error: any) {
      console.error("Error updating package status:", error);
      const errorMessage =
        error.response?.data || "Failed to update package status";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <p className="text-gray-600">
          Monitor package deliveries and manage security operations
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Packages
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Delivery
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.delivered}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.overdue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Package Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end mb-6">
            <div className="space-y-2">
              <Label htmlFor="searchTerm">Search Packages</Label>
              <Input
                id="searchTerm"
                placeholder="Search by tracking, resident, flat, or sender"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

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
                setSearchTerm("");
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Packages List */}
          {filteredPackages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No packages found matching your criteria
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`${
                    isOverdue(pkg.expectedDate) && pkg.status === "Pending"
                      ? "border-red-200 bg-red-50"
                      : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {pkg.trackingNumber}
                          {isOverdue(pkg.expectedDate) &&
                            pkg.status === "Pending" && (
                              <Badge variant="destructive" className="text-xs">
                                Overdue
                              </Badge>
                            )}
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
                        <p className="text-sm text-gray-700">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>Expected: {formatDate(pkg.expectedDate)}</span>
                        {pkg.deliveredAt && (
                          <span>
                            Delivered: {formatDateTime(pkg.deliveredAt)}
                          </span>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPackage(pkg)}
                          className="flex items-center gap-2"
                        >
                          <Package className="w-4 h-4" />
                          View Package
                        </Button>
                        {pkg.status === "Pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(pkg)}
                            className="flex items-center gap-2"
                          >
                            <Shield className="w-4 h-4" />
                            Update Status
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Package Modal */}
      {showViewModal && selectedPackage && (
        <ViewPackageModal
          package={selectedPackage}
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedPackage(null);
          }}
        />
      )}

      {/* Update Status Modal */}
      {showUpdateStatusModal && selectedPackage && (
        <UpdateStatusModal
          package={selectedPackage}
          isOpen={showUpdateStatusModal}
          onClose={() => {
            setShowUpdateStatusModal(false);
            setSelectedPackage(null);
          }}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
