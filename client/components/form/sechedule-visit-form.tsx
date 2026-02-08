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

const formSchema = z.object({
  username: z.string().min(6, {
    message: "Name must be at least 6 characters.",
  }),
  vehicleNo: z.string(),
  timing: z.string(),
  relation: z.string(),
});

type LoginForm = z.infer<typeof formSchema>;

const ScheduleVisitForm = ({
  setIsSubmiteed,
}: {
  setIsSubmiteed: (status: boolean) => void;
}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      vehicleNo: "",
    },
  });

  function onSubmit(values: LoginForm) {
    console.log(values);
    setIsSubmiteed(true);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <input
                  type="text"
                  placeholder="Enter your username"
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
          name="vehicleNo"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Vehicle No</FormLabel>
              <FormControl>
                <input
                  type="text"
                  placeholder="Enter vehicle no"
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Timing */}
        <FormField
          control={form.control}
          name="timing"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>At What time coming</FormLabel>
              <FormControl>
                <input
                  type="text"
                  placeholder="At what time coming"
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

export default ScheduleVisitForm;
