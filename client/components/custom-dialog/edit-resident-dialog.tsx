"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminService } from "@/service/adminService";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  flatNo: z.string().min(1, "Flat No. is required"),
  contact: z
    .string()
    .min(10, "Contact must be 10 digit only")
    .regex(/^\d+$/, "Contact must be numeric"),
  emergencyContact: z
    .string()
    .min(10, "Emergency contact must be 10 digit only")
    .regex(/^\d+$/, "Emergency contact must be numeric"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string(),
});

type FormType = z.infer<typeof formSchema>;

interface EditResidentDialogProps {
  residentId: number;
  onUpdate?: () => void;
}

const EditResidentDialog = ({
  residentId,
  onUpdate,
}: EditResidentDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      flatNo: "",
      contact: "",
      emergencyContact: "",
      email: "",
      password: "dummyPassword",
    },
  });

  const fetchResident = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getResident(residentId);
      const resident = response.data;

      setValue("name", resident.name);
      setValue("flatNo", resident.flatNo);
      setValue("contact", resident.contact);
      setValue("emergencyContact", resident.emergencyContact || "");
      setValue("email", resident.email);
    } catch (error) {
      console.error("Error fetching resident:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateResident = async (data: FormType) => {
    try {
      setLoading(true);
      await AdminService.updateResident(residentId, data);
      toast.success("Resident updated successfully!");
      setOpen(false);
      reset();
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error("Failed to update resident. Please try again.");
      console.error("Error updating resident:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      fetchResident();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(updateResident)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Resident</DialogTitle>
            <DialogDescription>
              Update resident details below. Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="edit-flatNo">Flat No.</Label>
                <Input id="edit-flatNo" {...register("flatNo")} />
                {errors.flatNo && (
                  <p className="text-red-500 text-sm">
                    {errors.flatNo.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="edit-contact">Contact</Label>
                <Input id="edit-contact" {...register("contact")} />
                {errors.contact && (
                  <p className="text-red-500 text-sm">
                    {errors.contact.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="edit-emergencyContact">Emergency Contact</Label>
                <Input
                  id="edit-emergencyContact"
                  {...register("emergencyContact")}
                />
                {errors.emergencyContact && (
                  <p className="text-red-500 text-sm">
                    {errors.emergencyContact.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <input type="hidden" {...register("password")} />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditResidentDialog;
