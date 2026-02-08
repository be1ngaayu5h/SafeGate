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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminService } from "@/service/adminService";
import { toast } from "sonner";
import { useState } from "react";

const guardSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  contact: z
    .string()
    .min(10, "Contact must be 10 digit only")
    .regex(/^\d+$/, "Contact must be numeric"),
  email: z.string().email("Invalid Email"),
  shift: z.string().min(1, "Shift is required"),
  password: z.string().min(1, "Password is required"),
});

type GuardFromData = z.infer<typeof guardSchema>;

interface AddSecurityDialogProps {
  onSuccess?: () => void;
}

export default function AddSecurityDialog({
  onSuccess,
}: AddSecurityDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<GuardFromData>({
    resolver: zodResolver(guardSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      shift: "Day",
      password: "dummyPassword",
    },
  });

  const onSubmit = async (data: GuardFromData) => {
    try {
      setLoading(true);
      await AdminService.addGuard(data);
      toast.success("Security personnel added successfully!");
      reset();
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to add security personnel. Please try again.");
      console.error("Error adding guard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Security Personal</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Security Personal</DialogTitle>
            <DialogDescription>
              Fill in the details and click save when you are done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Pedro Duarte"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                {...register("contact")}
                placeholder="9645123595"
              />
              {errors.contact && (
                <p className="text-sm text-red-500">{errors.contact.message}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="security1@gmail.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="shift">Shift</Label>
              <Input id="shift" {...register("shift")} placeholder="day" />
              {errors.shift && (
                <p className="text-sm text-red-500">{errors.shift.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
