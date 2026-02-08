"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { GuardService } from "@/service/guardService";
import { Package, Shield, CheckCircle, XCircle } from "lucide-react";

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

interface OtpVerificationModalProps {
  package: PackageItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OtpVerificationModal({ 
  package: packageItem, 
  isOpen, 
  onClose, 
  onSuccess 
}: OtpVerificationModalProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"success" | "error" | null>(null);

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationResult(null);
      
      await GuardService.verifyPackageOtp(packageItem.id, otp.trim());
      
      setVerificationResult("success");
      toast.success("OTP verified successfully! Package marked as delivered.");
      
      // Close modal after a short delay to show success
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
      
    } catch (error: any) {
      setVerificationResult("error");
      const errorMessage = error.response?.data || "Failed to verify OTP";
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setOtp("");
    setVerificationResult(null);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Verify Delivery OTP
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Package Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Package className="w-8 h-8 text-gray-400 mt-1" />
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="font-medium text-sm">Tracking: {packageItem.trackingNumber}</p>
                    <p className="text-sm text-gray-600">{packageItem.description}</p>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>From: {packageItem.sender}</p>
                    <p>To: {packageItem.residentName} (Flat {packageItem.flatNo})</p>
                    <p>Expected: {formatDate(packageItem.expectedDate)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* OTP Input */}
          <div className="space-y-2">
            <Label htmlFor="otp">Enter Delivery OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="text-center text-lg font-mono tracking-widest"
              disabled={isVerifying}
            />
            <p className="text-xs text-gray-500">
              Enter the OTP provided by the delivery company or resident
            </p>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              verificationResult === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {verificationResult === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {verificationResult === "success" 
                  ? "OTP verified successfully!" 
                  : "Invalid OTP. Please try again."
                }
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleVerifyOtp}
              disabled={isVerifying || !otp.trim()}
              className="flex-1"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isVerifying}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
