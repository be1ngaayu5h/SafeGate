import AddResidentDialog from "@/components/custom-dialog/add-resident-dialog";
import AddSecurityDialog from "@/components/custom-dialog/add-security-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Shield, UserRoundCheck } from "lucide-react";
import React from "react";

const Admin = () => {
  const stats = [
    {
      title: "Total Residents",
      value: "248",
      icon: Users,
      change: "+12 this month",
      color: "text-blue-600",
    },
    {
      title: "Security Personnel",
      value: "8",
      icon: Shield,
      change: "2 on duty",
      color: "text-green-600",
    },
    {
      title: "Total Visitors",
      value: "3",
      icon: UserRoundCheck,
      change: "+12 today",
      color: "text-green-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "access",
      message: "New resident registered - Unit 204",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "acess",
      message: "Security personnal",
      time: "4 hours ago",
      status: "success",
    },
    {
      id: 3,
      type: "access",
      message: "Visitor access granted - John Smith",
      time: "8 hours ago",
      status: "success",
    },
  ];

  return (
    <div className="px-3 sm:px-7 py-5 space-y-5">
      <h1 className="font-semibold text-3xl">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <h1 className="font-semibold text-3xl mt-10">Quick Actions</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest system activities and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.status === "success"
                      ? "bg-green-500"
                      : activity.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            <AddResidentDialog />
            <AddSecurityDialog />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
