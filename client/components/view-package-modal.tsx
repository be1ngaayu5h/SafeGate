"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, MapPin, User, Truck } from "lucide-react";

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

interface ViewPackageModalProps {
  package: PackageItem;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewPackageModal({
  package: packageData,
  isOpen,
  onClose,
}: ViewPackageModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isOverdue = (expectedDate: string) => {
    return new Date(expectedDate) < new Date();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Package Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header with Tracking Number and Status */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{packageData.trackingNumber}</h3>
              <p className="text-sm text-gray-600">Package ID: {packageData.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  packageData.status === "Delivered" ? "default" : "secondary"
                }
              >
                {packageData.status}
              </Badge>
              {isOverdue(packageData.expectedDate) && packageData.status === "Pending" && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Description</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {packageData.description}
            </p>
          </div>

          {/* Package Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Sender</span>
              </div>
              <p className="font-medium">{packageData.sender}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Recipient</span>
              </div>
              <p className="font-medium">{packageData.residentName}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Flat Number</span>
              </div>
              <p className="font-medium">{packageData.flatNo}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Expected Date</span>
              </div>
              <p className="font-medium">{formatDate(packageData.expectedDate)}</p>
            </div>
          </div>

          {/* Delivery Information */}
          {packageData.deliveryOtp && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Delivery OTP</h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                  {packageData.deliveryOtp}
                </Badge>
              </div>
            </div>
          )}

          {/* Delivery Status */}
          {packageData.deliveredAt && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Delivery Information</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>Delivered on: {formatDateTime(packageData.deliveredAt)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
