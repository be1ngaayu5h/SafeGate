"use client";
import LayoutWrapper from "@/app/layout-wrapper";
import { useAuthStore } from "@/store/auth-store";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userType } = useAuthStore();
  const router = useRouter();
  const path = usePathname();

useEffect(() => {
  if (userType === null) {
    if (path !== "/login") router.push("/login");
  } else if (userType === "admin" && !path.startsWith("/admin")) {
    router.push("/admin");
  } else if (userType === "resident" && !path.startsWith("/resident")) {
    router.push("/resident");
  } else if (userType === "security" && !path.startsWith("/security")) {
    router.push("/security");
  }
}, [userType, path, router]);


  return <LayoutWrapper>{children}</LayoutWrapper>;
}
