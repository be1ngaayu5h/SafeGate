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
import { User, Mail, Phone, MapPin, Shield } from "lucide-react";

interface Resident {
  id: number;
  name: string;
  email: string;
  flatNo: string;
  contact: string;
  emergencyContact: string;
  status: boolean;
}

interface ViewResidentDialogProps {
  residentId: number;
}

const ViewResidentDialog = ({ residentId }: ViewResidentDialogProps) => {
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchResident = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getResident(residentId);
      setResident(response.data);
    } catch (error) {
      console.error("Error fetching resident:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" onClick={fetchResident}>
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resident Details</DialogTitle>
          <DialogDescription>
            Complete information about the resident
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : resident ? (
          <div className="space-y-6">
            {/* Header with name and status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{resident.name}</h3>
                  <p className="text-sm text-gray-500">ID: {resident.id}</p>
                </div>
              </div>
              <Badge
                variant={resident.status ? "default" : "secondary"}
                className={
                  resident.status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {resident.status ? "Active" : "Inactive"}
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
                    <p className="text-sm text-gray-900">{resident.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Primary Contact
                    </p>
                    <p className="text-sm text-gray-900">{resident.contact}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Emergency Contact
                    </p>
                    <p className="text-sm text-gray-900">
                      {resident.emergencyContact || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Flat Number
                    </p>
                    <p className="text-sm text-gray-900">{resident.flatNo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Failed to load resident details</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewResidentDialog;
