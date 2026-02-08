"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Phone,
  Car,
  Building,
  Clock,
  CheckCircle,
  QrCode,
} from "lucide-react";
import QRCode from "react-qr-code";
import { AdminService } from "@/service/adminService";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "Completed":
      return "bg-blue-100 text-blue-800";
    case "Cancelled":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface VisitorModalProps {
  visitor: any;
  onClose: () => void;
}

export function VisitorModal({ visitor, onClose }: VisitorModalProps) {
  const qrData = JSON.stringify({
    id: visitor.id,
    name: visitor.name,
    phone: visitor.phone,
    purpose: visitor.purpose,
    date: visitor.date,
    timeSlot: visitor.timeSlot,
    flatNumber: visitor.flatNumber,
    qrCode: visitor.qrCode,
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Visitor Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{visitor.name}</h3>
              <Badge className={getStatusColor(visitor.status)}>
                {visitor.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Purpose
                  </label>
                  <p className="mt-1">{visitor.purpose}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Visit Date
                </label>
                <p className="mt-1">{visitor.date}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Time Slot
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{visitor.timeSlot}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Host
                </label>
                <p className="mt-1">
                  {visitor.hostName} - Flat {visitor.flatNumber}
                </p>
              </div>

              {visitor.approvedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Approved By
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{visitor.approvedBy}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {visitor.approvedAt}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button className="flex-1">Contact Visitor</Button>
              <Button variant="outline">Edit Details</Button>
              {visitor.status === "Pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await AdminService.approveVisit(Number(visitor.id));
                      location.reload();
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600"
                    onClick={async () => {
                      await AdminService.declineVisit(Number(visitor.id));
                      location.reload();
                    }}
                  >
                    Deny
                  </Button>
                </>
              )}
            </div>
          </div>

          {visitor.status === "Approved" && (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="font-medium mb-3 flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Visitor QR Code
                </h4>
                <div className="bg-white p-4 rounded-lg border">
                  <QRCode
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={qrData}
                    viewBox={`0 0 200 200`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Show this QR code to security for entry
                </p>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Download QR Code
                </Button>
                <Button variant="outline" className="w-full">
                  Share QR Code
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
