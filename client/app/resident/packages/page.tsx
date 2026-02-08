"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NewPackageModal } from "@/components/new-package-modal";
import { PackageManagement } from "@/components/package-management";
import { ResidentService } from "@/service/residentService";
import { toast } from "sonner";
import UpdatePackageModal from "@/components/update-package-modal";

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

export default function ResidentPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [showNewPackageModal, setShowNewPackageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(
    null
  );
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock flat number - in real app this would come from user context
  const mockFlatNo = "A101";

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await ResidentService.getPackages(mockFlatNo);
      setPackages(response.data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async (packageData: any) => {
    try {
      const newPackage = {
        ...packageData,
        residentName: packageData.residentName || "Current Resident",
        flatNo: mockFlatNo,
        status: "Pending",
      };

      const result = await ResidentService.createPackage(newPackage);
      toast.success("Package created successfully!");
      fetchPackages();
      return result.data; // Return the created package data
    } catch (error: any) {
      console.error("Error creating package:", error);
      const errorMessage = error.response?.data || "Failed to create package";
      toast.error(errorMessage);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleUpdatePackage = async (packageData: any) => {
    try {
      await ResidentService.updatePackageDetails(selectedPackage!.id, packageData);
      toast.success("Package updated successfully!");
      fetchPackages();
    } catch (error: any) {
      console.error("Error updating package:", error);
      const errorMessage = error.response?.data || "Failed to update package";
      toast.error(errorMessage);
    }
  };

  const openUpdateModal = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setShowUpdateModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading packages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Packages</h1>
          <p className="text-gray-600">
            Track and manage your package deliveries
          </p>
        </div>
        <Button onClick={() => setShowNewPackageModal(true)}>
          Add New Package
        </Button>
      </div>

      {/* Package Management Component */}
      <PackageManagement 
        userRole="resident" 
        flatNo={mockFlatNo} 
        onUpdatePackage={openUpdateModal}
      />

      {/* New Package Modal */}
      {showNewPackageModal && (
        <NewPackageModal
          onClose={() => setShowNewPackageModal(false)}
          onSubmit={handleCreatePackage}
        />
      )}


      {/* Update Package Modal */}
      {showUpdateModal && selectedPackage && (
        <UpdatePackageModal
          packageinfo={selectedPackage}
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedPackage(null);
          }}
          onUpdate={handleUpdatePackage}
        />
      )}
    </div>
  );
}
