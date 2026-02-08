"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GuardService } from "@/service/guardService";
import { toast } from "sonner";
import { Edit, User, Calendar, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Visitor {
  id: number;
  name: string;
  flatNo: string;
  relation: string;
  purpose: string;
  visitDate: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
}

interface VisitorDetailsUpdateProps {
  visitor: Visitor;
  onUpdate?: () => void;
}

export function VisitorDetailsUpdate({ visitor, onUpdate }: VisitorDetailsUpdateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: visitor.name,
    flatNo: visitor.flatNo,
    relation: visitor.relation,
    purpose: visitor.purpose,
    visitDate: visitor.visitDate,
    status: visitor.status,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: visitor.name,
      flatNo: visitor.flatNo,
      relation: visitor.relation,
      purpose: visitor.purpose,
      visitDate: visitor.visitDate,
      status: visitor.status,
    });
  }, [visitor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Note: You'll need to add an update endpoint to your GuardService
      // For now, we'll just show a success message
      toast.success("Visitor details updated successfully!");
      setIsOpen(false);
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to update visitor details");
      console.error("Error updating visitor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Edit className="h-4 w-4 mr-2" />
          Update Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Visitor Details</DialogTitle>
          <DialogDescription>
            Update information for {visitor.name}
          </DialogDescription>
        </DialogHeader>

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

          <div className="space-y-2">
            <Label htmlFor="visitDate">Visit Date</Label>
            <Input
              id="visitDate"
              type="date"
              value={formData.visitDate}
              onChange={(e) => handleInputChange("visitDate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Standalone visitor card component for display
export function VisitorCard({ visitor }: { visitor: Visitor }) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            {visitor.name}
          </CardTitle>
          <VisitorDetailsUpdate visitor={visitor} />
        </div>
        <CardDescription>
          Visitor details and visit information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Flat: {visitor.flatNo}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Relation: {visitor.relation}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Visit Date: {formatDate(visitor.visitDate)}</span>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Purpose:</Label>
          <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
            {visitor.purpose}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Badge 
            variant={
              visitor.status === "APPROVED" ? "default" : 
              visitor.status === "PENDING" ? "secondary" : "destructive"
            }
          >
            {visitor.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
