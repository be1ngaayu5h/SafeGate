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
import React, { useState } from "react";
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

interface AddResidentDialogProps {
  onSuccess?: () => void;
}

const AddResidentDialog = ({ onSuccess }: AddResidentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
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

  const addResident = async (data: FormType) => {
    try {
      setLoading(true);
      await AdminService.addResident(data);
      toast.success("Resident added successfully!");
      reset();
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to add resident. Please try again.");
      console.error("Error adding resident:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Resident</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(addResident)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Resident</DialogTitle>
            <DialogDescription>
              Add resident details below. Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="flatNo">Flat No.</Label>
            <Input id="flatNo" {...register("flatNo")} />
            {errors.flatNo && (
              <p className="text-red-500 text-sm">{errors.flatNo.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="contact">Contact</Label>
            <Input id="contact" {...register("contact")} />
            {errors.contact && (
              <p className="text-red-500 text-sm">{errors.contact.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input id="emergencyContact" {...register("emergencyContact")} />
            {errors.emergencyContact && (
              <p className="text-red-500 text-sm">
                {errors.emergencyContact.message}
              </p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register("email")} />
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
              {loading ? "Adding..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResidentDialog;
