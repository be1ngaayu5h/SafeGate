"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GuardService } from "@/service/guardService";
import { toast } from "sonner";
import { LogIn, LogOut, Clock, Calendar, User } from "lucide-react";

interface GuardAttendanceProps {
  guardId: number;
  guardName: string;
}

export function GuardAttendance({ guardId, guardName }: GuardAttendanceProps) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      await GuardService.guardCheckIn(guardId);
      setIsCheckedIn(true);
      toast.success("Successfully checked in!");
    } catch (error) {
      toast.error("Failed to check in");
      console.error("Error checking in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    try {
      await GuardService.guardCheckOut(guardId);
      setIsCheckedIn(false);
      toast.success("Successfully checked out!");
    } catch (error) {
      toast.error("Failed to check out");
      console.error("Error checking out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Guard Attendance
          </CardTitle>
          <CardDescription>
            Manage your check-in and check-out status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-medium">{guardName}</span>
            </div>
            <Badge variant={isCheckedIn ? "default" : "secondary"}>
              {isCheckedIn ? "Checked In" : "Checked Out"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Current Time</div>
              <div className="text-lg font-mono font-bold">
                {formatTime(currentTime)}
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Today's Date</div>
              <div className="text-sm font-medium">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {!isCheckedIn ? (
              <Button
                onClick={handleCheckIn}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {isLoading ? "Checking In..." : "Check In"}
              </Button>
            ) : (
              <Button
                onClick={handleCheckOut}
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoading ? "Checking Out..." : "Check Out"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
