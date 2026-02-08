"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Clock,
  User,
  Calendar,
  MapPin,
  AlertCircle,
  Tag,
} from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Open":
      return "bg-red-100 text-red-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Resolved":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface ComplaintModalProps {
  complaint: any;
  onClose: () => void;
}

export function ComplaintModal({ complaint, onClose }: ComplaintModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Complaint Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{complaint.title}</h3>
            <div className="flex gap-2">
              <Badge className={getStatusColor(complaint.status)}>
                {complaint.status}
              </Badge>
              <Badge className={getPriorityColor(complaint.priority)}>
                {complaint.priority} Priority
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Complaint ID
                </label>
                <p className="mt-1 font-mono">#{complaint.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Category
                </label>
                <p className="mt-1">{complaint.category}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Date Submitted
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(complaint.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Location
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{complaint.flatNo}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Priority Level
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <span>{complaint.priority}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Assigned To
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{complaint.assignedTo || "Not assigned yet"}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Resident
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{complaint.residentName}</span>
                </div>
              </div>

              {complaint.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Last Updated
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{new Date(complaint.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <p className="mt-2 p-4 bg-gray-50 rounded-lg">
              {complaint.description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

