"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GuardService } from "@/service/guardService";
import { toast } from "sonner";

interface VisitorRequestFormProps {
  onSuccess?: () => void;
}

export function VisitorRequestForm({ onSuccess }: VisitorRequestFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    flatNo: "",
    relation: "",
    purpose: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await GuardService.requestVisit(formData);
      toast.success("Visitor request created successfully!");
      setFormData({ name: "", flatNo: "", relation: "", purpose: "" });
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create visitor request");
      console.error("Error creating visitor request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Request Visitor Entry</CardTitle>
        <CardDescription>
          Create a new visitor request for entry
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Visitor Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter visitor name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="flatNo">Flat Number</Label>
            <Input
              id="flatNo"
              value={formData.flatNo}
              onChange={(e) => handleInputChange("flatNo", e.target.value)}
              placeholder="Enter flat number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relation">Relation</Label>
            <Input
              id="relation"
              value={formData.relation}
              onChange={(e) => handleInputChange("relation", e.target.value)}
              placeholder="e.g., Family, Friend, Delivery"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Visit</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => handleInputChange("purpose", e.target.value)}
              placeholder="Enter purpose of visit"
              required
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
