"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Truck, CheckCircle, Clock, MapPin, Copy } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "In Transit":
      return "bg-blue-100 text-blue-800";
    case "Out for Delivery":
      return "bg-purple-100 text-purple-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Pending":
      return <Clock className="w-4 h-4" />;
    case "In Transit":
      return <Truck className="w-4 h-4" />;
    case "Out for Delivery":
      return <MapPin className="w-4 h-4" />;
    case "Delivered":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

interface PackageModalProps {
  package: any;
  onClose: () => void;
}

export function PackageModal({ package: pkg, onClose }: PackageModalProps) {
  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(pkg.trackingNumber);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Package Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{pkg.description}</h3>
            <Badge className={getStatusColor(pkg.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(pkg.status)}
                {pkg.status}
              </div>
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Tracking Number
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm">
                    {pkg.trackingNumber}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyTrackingNumber}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Sender
                </label>
                <p className="mt-1">{pkg.sender}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Recipient
                </label>
                <p className="mt-1">{pkg.recipient}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Flat Number
                </label>
                <p className="mt-1">{pkg.flatNumber}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Expected Date
                </label>
                <p className="mt-1">{pkg.expectedDate}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Estimated Time
                </label>
                <p className="mt-1">{pkg.estimatedTime}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Current Location
                </label>
                <p className="mt-1">{pkg.location}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Delivery Instructions
                </label>
                <p className="mt-1 text-sm">{pkg.deliveryInstructions}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Tracking History</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Aug 7, 2024 - 2:30 PM</span>
                <span>Package picked up from sender</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Aug 7, 2024 - 6:45 PM</span>
                <span>In transit to distribution center</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Aug 8, 2024 - 8:00 AM</span>
                <span>Arrived at local facility</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1">Contact Delivery Partner</Button>
            <Button variant="outline">Report Issue</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
