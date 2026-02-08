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
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { ResidentService } from "@/service/residentService";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Copy, CheckCircle } from "lucide-react";

const newPackageSchema = z.object({
  trackingNumber: z.string().min(1, "Tracking number is required"),
  description: z.string().min(1, "Description is required"),
  sender: z.string().min(1, "Sender is required"),
  residentName: z.string().min(1, "Resident name is required"),
  flatNo: z.string().min(1, "Flat number is required"),
  expectedDate: z.string().min(1, "Expected date is required"),
  deliveryOtp: z.string().optional(),
});

type NewPackageFormData = z.infer<typeof newPackageSchema>;

interface NewPackageModalProps {
  onClose: () => void;
  onSubmit: (packageData: any) => void;
}

export function NewPackageModal({ onClose, onSubmit }: NewPackageModalProps) {
  const [loading, setLoading] = useState(false);
  const [createdPackage, setCreatedPackage] = useState<any>(null);
  const [otpCopied, setOtpCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewPackageFormData>({
    resolver: zodResolver(newPackageSchema),
    defaultValues: {
      trackingNumber: "",
      description: "",
      sender: "",
      residentName: "",
      flatNo: "A101",
      expectedDate: "",
      deliveryOtp: "",
    },
  });

  const onFormSubmit = async (data: NewPackageFormData) => {
    try {
      setLoading(true);

      const packageData = {
        ...data,
        status: "Pending",
      };

      const result = await onSubmit(packageData);
      setCreatedPackage(result);
      toast.success("Package registered successfully!");
    } catch (error) {
      console.error("Error registering package:", error);
      toast.error("Failed to register package. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setCreatedPackage(null);
    setOtpCopied(false);
    onClose();
  };

  const copyOtpToClipboard = async () => {
    if (createdPackage?.deliveryOtp) {
      try {
        await navigator.clipboard.writeText(createdPackage.deliveryOtp);
        setOtpCopied(true);
        toast.success("OTP copied to clipboard!");
        setTimeout(() => setOtpCopied(false), 2000);
      } catch (error) {
        toast.error("Failed to copy OTP");
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Register New Package</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                placeholder="Enter tracking number"
                {...register("trackingNumber")}
                className={errors.trackingNumber ? "border-red-500" : ""}
              />
              {errors.trackingNumber && (
                <p className="text-xs text-red-500">
                  {errors.trackingNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender">Sender</Label>
              <Input
                id="sender"
                placeholder="e.g., Amazon, Flipkart"
                {...register("sender")}
                className={errors.sender ? "border-red-500" : ""}
              />
              {errors.sender && (
                <p className="text-xs text-red-500">{errors.sender.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="residentName">Resident Name</Label>
              <Input
                id="residentName"
                placeholder="Enter resident name"
                {...register("residentName")}
                className={errors.residentName ? "border-red-500" : ""}
              />
              {errors.residentName && (
                <p className="text-xs text-red-500">
                  {errors.residentName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Package Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the package"
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedDate">Expected Date</Label>
              <Input
                id="expectedDate"
                type="date"
                {...register("expectedDate")}
                className={errors.expectedDate ? "border-red-500" : ""}
              />
              {errors.expectedDate && (
                <p className="text-xs text-red-500">
                  {errors.expectedDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryOtp">Delivery OTP</Label>
              <Input
                id="deliveryOtp"
                placeholder="Leave empty for auto-generation"
                {...register("deliveryOtp")}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Registering..." : "Register Package"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
