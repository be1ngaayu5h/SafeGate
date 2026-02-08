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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminService } from "@/service/adminService";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z
    .string()
    .min(10, "Contact must be 10 digit only")
    .regex(/^\d+$/, "Contact must be numeric"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  shift: z.string().min(1, "Shift is required"),
  password: z.string(),
});

type FormType = z.infer<typeof formSchema>;

interface EditGuardDialogProps {
  guardId: number;
  onUpdate?: () => void;
}

const EditGuardDialog = ({ guardId, onUpdate }: EditGuardDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      email: "",
      shift: "",
      password: "dummyPassword",
    },
  });

  const shiftValue = watch("shift");

  const fetchGuard = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getGuard(guardId);
      const guard = response.data;

      setValue("name", guard.name);
      setValue("contact", guard.contact);
      setValue("email", guard.email);
      setValue("shift", guard.shift);
    } catch (error) {
      console.error("Error fetching guard:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateGuard = async (data: FormType) => {
    try {
      setLoading(true);
      await AdminService.updateGuard(guardId, data);
      toast.success("Security personnel updated successfully!");
      setOpen(false);
      reset();
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error("Failed to update security personnel. Please try again.");
      console.error("Error updating guard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      fetchGuard();
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
        <form onSubmit={handleSubmit(updateGuard)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Security Personnel</DialogTitle>
            <DialogDescription>
              Update security personnel details below. Click save when you are
              done.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                <Label htmlFor="edit-guard-name">Name</Label>
                <Input id="edit-guard-name" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="edit-guard-contact">Contact</Label>
                <Input id="edit-guard-contact" {...register("contact")} />
                {errors.contact && (
                  <p className="text-red-500 text-sm">
                    {errors.contact.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="edit-guard-email">Email</Label>
                <Input id="edit-guard-email" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="edit-guard-shift">Shift</Label>
                <Select
                  onValueChange={(value) => setValue("shift", value)}
                  value={shiftValue}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MORNING">Morning</SelectItem>
                    <SelectItem value="EVENING">Evening</SelectItem>
                    <SelectItem value="NIGHT">Night</SelectItem>
                  </SelectContent>
                </Select>
                {errors.shift && (
                  <p className="text-red-500 text-sm">{errors.shift.message}</p>
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

export default EditGuardDialog;
