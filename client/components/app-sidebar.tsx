"use client";

import * as React from "react";
import {
  Key,
  House,
  UserPlus,
  UserLock,
  LogOut,
  PackageSearch,
  CalendarCheck2,
  HousePlus,
  Home,
  Package,
  Calendar,
  MessageSquare,
  FileText,
  QrCode,
  Scan,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout, userType } = useAuthStore();

  const data = {
    user: {
      name: "User",
      email: "user@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    team: {
      name: "SafeGate",
      logo: Key,
      plan: "Enterprise",
    },
    projects:
      userType === "admin"
        ? [
            {
              name: "Resident Management",
              url: "/admin/resident-management",
              icon: HousePlus,
            },
            {
              name: "Visitor Management",
              url: "/admin/visitor-management",
              icon: UserPlus,
            },
            {
              name: "Security Management",
              url: "/admin/security-management",
              icon: UserLock,
            },
            {
              name: "Admin Dashboard",
              url: "/admin",
              icon: House,
            },
            {
              name: "Complaints",
              url: "/admin/complaints",
              icon: MessageSquare,
            },
            {
              name: "QR Visitor History",
              url: "/admin/qr-visitor-history",
              icon: FileText,
            },
          ]
        : userType === "resident"
          ? [
              { name: "Resident Dashboard", url: "/", icon: Home },
              {
                name: "Package Tracking",
                url: "/resident/packages",
                icon: Package,
              },
              {
                name: "Schedule Visit",
                url: "/resident/visits",
                icon: Calendar,
              },
                          {
              name: "QR Visitor Request",
              url: "/resident/qr-visitor-request",
              icon: QrCode,
            },
            {
              name: "QR Visitor History",
              url: "/resident/qr-visitor-history",
              icon: FileText,
            },
            {
              name: "Complaints",
              url: "/resident/complaints",
              icon: MessageSquare,
            },
            ]
          : [
              {
                name: "Security Dashboard",
                url: "/",
                icon: House,
              },
              {
                name: "Package Management",
                url: "/security/packages",
                icon: Package,
              },
              {
                name: "QR Scanner",
                url: "/security/qr-scanner",
                icon: Scan,
              },
            ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <data.team.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{data.team.name}</span>
            <span className="truncate text-xs">{data.team.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {data.projects.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton onClick={() => logout()} className="cursor-pointer">
          <LogOut size={20} />
        </SidebarMenuButton>

        <div className="flex items-center gap-2  py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={data.user.avatar} alt={data.user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{data.user.name}</span>
            <span className="truncate text-xs">{data.user.email}</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
