"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Shield } from "lucide-react";

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

interface UpdateStatusModalProps {
  package: PackageItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (packageId: number, newStatus: string) => Promise<void>;
}

export function UpdateStatusModal({
  package: packageData,
  isOpen,
  onClose,
  onUpdate,
}: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedStatus) return;

    try {
      setLoading(true);
      await onUpdate(packageData.id, selectedStatus);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Update Package Status
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Package Info Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">{packageData.trackingNumber}</span>
            </div>
            <p className="text-sm text-gray-600">
              {packageData.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>To: {packageData.residentName} (Flat {packageData.flatNo})</span>
              <Badge variant="secondary">{packageData.status}</Badge>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label htmlFor="status">New Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Note: Security guards can update package status to track delivery progress.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedStatus || loading}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
