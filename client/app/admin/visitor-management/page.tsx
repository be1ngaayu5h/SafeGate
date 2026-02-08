"use client";
import DatePicker from "@/components/custom-date-picker";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminService } from "@/service/adminService";
import { Home, UserCheck, Users, UserX } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ActiveVisitors {
  id: number;
  name: string;
  flatNo: string;
  relation: string;
  purpose: string;
  checkInTime: string;
  checkOutTime: string;
  status: "APPROVED" | "DECLINED" | "PENDING";
}

const Page = () => {
  const [activeVisitors, setactiveVisitors] = useState<ActiveVisitors[]>([]);

  useEffect(() => {
    async function fetchActiveVisitors() {
      const response = await AdminService.getActiveVisitors();
      setactiveVisitors(response.data);
    }

    fetchActiveVisitors();
  }, []);

  return (
    <div className="px-7 py-5 pb-5">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Visitors
                </p>
                <p className="text-2xl font-bold text-gray-900">10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Leave</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Staying</p>
                <p className="text-2xl font-bold text-purple-600">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Active Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Purpose</th>
                  <th className="text-left p-2">Flat</th>
                  <th className="text-left p-2">Check In Time</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Check Out Time</th>
                </tr>
              </thead>
              <tbody>
                {activeVisitors.map((visitor, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{visitor.name}</td>
                    <td className="p-2">{visitor.purpose}</td>
                    <td className="p-2">{visitor.flatNo}</td>
                    <td className="p-2">{visitor.checkInTime}</td>
                    <td className="p-2">
                      <Badge variant="default">{visitor.status}</Badge>
                    </td>
                    <td className="p-2">{visitor.checkOutTime ?? "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div>
        <Card className="mt-8">
          <CardHeader className="space-y-4">
            <CardTitle>Search Visitors</CardTitle>
            <DatePicker />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Purpose</th>
                    <th className="text-left p-2">Flat</th>
                    <th className="text-left p-2">Time In</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Time Out</th>
                  </tr>
                </thead>
                <tbody>
                  {activeVisitors.map((visitor, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{visitor.name}</td>
                      <td className="p-3">{visitor.purpose}</td>
                      <td className="p-3">{visitor.flatNo}</td>
                      <td className="p-3">{visitor.checkInTime}</td>
                      <td className="p-3">
                        <Badge variant="default">{visitor.status}</Badge>
                      </td>
                      <td className="p-2">{visitor.checkOutTime ?? "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
