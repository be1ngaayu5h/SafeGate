"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResidentService } from "@/service/residentService";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const updatePackageSchema = z.object({
  description: z.string().min(1, "Description is required"),
  sender: z.string().min(1, "Sender is required"),
  residentName: z.string().min(1, "Resident name is required"),
  flatNo: z.string().min(1, "Flat number is required"),
  expectedDate: z.string().min(1, "Expected date is required"),
  deliveryOtp: z.string().optional(),
  trackingNumber: z.string().min(1, "Tracking number is required"),
});

type UpdatePackageFormData = z.infer<typeof updatePackageSchema>;

interface UpdatePackageModalProps {
  packageinfo: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => Promise<void>;
}

export default function UpdatePackageModal({
  packageinfo,
  isOpen,
  onClose,
  onUpdate,
}: UpdatePackageModalProps) {
  const [loading, setLoading] = useState(false);

  

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdatePackageFormData>({
    resolver: zodResolver(updatePackageSchema),
  });

  useEffect(() => {
    if (packageinfo && isOpen) {
      setValue("description", packageinfo.description || "");
      setValue("sender", packageinfo.sender || "");
      setValue("residentName", packageinfo.residentName || "");
      setValue("flatNo", packageinfo.flatNo || "");
      setValue(
        "expectedDate",
        packageinfo.expectedDate
          ? new Date(packageinfo.expectedDate).toISOString().split("T")[0]
          : "",
      );
      setValue("deliveryOtp", packageinfo.deliveryOtp || "");
      setValue("trackingNumber", packageinfo.trackingNumber);
    }
  }, [packageinfo, isOpen, setValue]);

  const onSubmit = async (data: UpdatePackageFormData) => {
    if (!packageinfo) return;

    try {
      setLoading(true);

      const updateData = {
        trackingNumber: data.trackingNumber,
        description: data.description,
        sender: data.sender,
        residentName: data.residentName,
        flatNo: data.flatNo,
        expectedDate: new Date(data.expectedDate).toISOString(),
        deliveryOtp: data.deliveryOtp,
      };

      // Call the parent's onUpdate function with the updated data
      await onUpdate(updateData);
      onClose();
      reset();
    } catch (error: any) {
      console.error("Error updating package:", error);
      const errorMessage = error.response?.data || "Failed to update package";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!packageinfo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Package Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trackingNumber">Tracking Number</Label>
            <Input
              id="trackingNumber"
              {...register("trackingNumber")}
              placeholder="Enter tracking number"
              className="bg-gray-50"
              readOnly
            />
            <p className="text-xs text-gray-500">
              Tracking number cannot be changed
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="residentName">Resident Name</Label>
              <Input
                id="residentName"
                {...register("residentName")}
                placeholder="Enter resident name"
                className={errors.residentName ? "border-red-500" : ""}
              />
              {errors.residentName && (
                <p className="text-xs text-red-500">
                  {errors.residentName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="flatNo">Flat Number</Label>
              <Input
                id="flatNo"
                {...register("flatNo")}
                placeholder="Enter flat number"
                className={errors.flatNo ? "border-red-500" : ""}
              />
              {errors.flatNo && (
                <p className="text-xs text-red-500">{errors.flatNo.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter package description"
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender">Sender</Label>
            <Input
              id="sender"
              {...register("sender")}
              placeholder="Enter sender name"
              className={errors.sender ? "border-red-500" : ""}
            />
            {errors.sender && (
              <p className="text-xs text-red-500">{errors.sender.message}</p>
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
                {...register("deliveryOtp")}
                placeholder="OTP received from delivery company"
              />
            </div>
          </div>

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
              type="submit"
              disabled={
                loading ||
                packageinfo.status === "Delivered"
              }
            >
              {loading ? "Updating..." : "Update Package"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
