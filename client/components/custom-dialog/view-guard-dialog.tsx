"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AdminService } from "@/service/adminService";
import { useState } from "react";
import { User, Mail, Phone, Shield, Clock } from "lucide-react";

interface Guard {
  id: number;
  name: string;
  email: string;
  contact: string;
  shift: string;
  checkInTime: string;
  checkOutTime: string;
}

interface ViewGuardDialogProps {
  guardId: number;
}

const ViewGuardDialog = ({ guardId }: ViewGuardDialogProps) => {
  const [guard, setGuard] = useState<Guard | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGuard = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getGuard(guardId);
      setGuard(response.data);
    } catch (error) {
      console.error("Error fetching guard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" onClick={fetchGuard}>
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Security Personnel Details</DialogTitle>
          <DialogDescription>
            Complete information about the security personnel
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : guard ? (
          <div className="space-y-6">
            {/* Header with name and status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{guard.name}</h3>
                  <p className="text-sm text-gray-500">ID: {guard.id}</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {guard.shift}
              </Badge>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Contact Information</h4>

              <div className="grid gap-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900">{guard.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Contact</p>
                    <p className="text-sm text-gray-900">{guard.contact}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Shift</p>
                    <p className="text-sm text-gray-900">{guard.shift}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Check In Time
                    </p>
                    <p className="text-sm text-gray-900">
                      {guard.checkInTime || "Not checked in"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Check Out Time
                    </p>
                    <p className="text-sm text-gray-900">
                      {guard.checkOutTime || "Not checked out"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Failed to load guard details</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewGuardDialog;
