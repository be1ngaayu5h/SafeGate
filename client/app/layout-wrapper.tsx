"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const path = usePathname();
  const isLoginPage = path === "/login";

  return (
    <SidebarProvider>
      {!isLoginPage && <AppSidebar />}
      <div className="flex flex-col w-full">
        {!isLoginPage && <Header />}
        {children}
      </div>
    </SidebarProvider>
  );
};

export default LayoutWrapper;
