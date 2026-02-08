"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisitorRequestForm } from "@/components/visitor-request-form";
import { VisitorManagement } from "@/components/visitor-management";
import { GuardAttendance } from "@/components/guard-attendance";
import { NewVisitorModal } from "@/components/new-visitor-modal";
import { Users, Clock, UserCheck, FileText, Plus, Shield, Activity } from "lucide-react";
import Link from "next/link";

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewVisitorModal, setShowNewVisitorModal] = useState(false);

  // Mock guard data - in real app, this would come from authentication context
  const mockGuard = {
    id: 1,
    name: "John Doe",
    shift: "DAY"
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Operations</h1>
          <p className="text-muted-foreground">
            Welcome back, {mockGuard.name} ({mockGuard.shift} Shift)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current Time</p>
            <p className="text-lg font-mono">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
          <Button onClick={() => setShowNewVisitorModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Request Visitor
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Today's Check-ins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Packages</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

  

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="visitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Management</CardTitle>
              <CardDescription>
                View visitor requests and check in approved visitors. Approval/denial is handled by residents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VisitorManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guard Attendance</CardTitle>
              <CardDescription>
                Manage your check-in and check-out status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GuardAttendance 
                guardId={mockGuard.id} 
                guardName={mockGuard.name} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Visitor Modal */}
      {showNewVisitorModal && (
        <NewVisitorModal
          isOpen={showNewVisitorModal}
          onClose={() => setShowNewVisitorModal(false)}
          onSuccess={() => {
            setShowNewVisitorModal(false);
            setActiveTab("visitors");
          }}
        />
      )}
    </div>
  );
}
