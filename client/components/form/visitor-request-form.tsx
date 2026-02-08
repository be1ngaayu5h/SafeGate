"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GuardService } from "@/service/guardService";

const formSchema = z.object({
  name: z.string().min(1, "name is required"),
  flatNo: z.string().min(1, "flatNo is required"),
  purpose: z.string().min(1, "purpose is required"),
  relation: z.string().min(1, "relation is required"),
});

type LoginForm = z.infer<typeof formSchema>;

const VisitorRequestForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      flatNo: "",
      purpose: "",
      relation: "",
    },
  });

  async function onSubmit(values: LoginForm) {
    await GuardService.requestVisit(values);
    window.location.href = "/resident";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Username Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <input
                  type="text"
                  placeholder="Enter visitor name"
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="flatNo"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Flat No.</FormLabel>
              <FormControl>
                <input
                  type="text"
                  placeholder="Enter Flat No."
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vehicle Number */}
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <input
                  type="text"
                  placeholder="Enter purpose"
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Relation */}
        <FormField
          control={form.control}
          name="relation"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Relation With User</FormLabel>
              <FormControl>
                <input
                  type="text"
                  placeholder="Relation With User"
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default VisitorRequestForm;
