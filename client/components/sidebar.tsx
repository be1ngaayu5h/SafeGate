"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Package,
  Calendar,
  Home,
  MessageSquare,
  FileText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Resident Dashboard", href: "/", icon: Home },
  { name: "Package Tracking", href: "/packages", icon: Package },
  { name: "Schedule Visit", href: "/visits", icon: Calendar },
  { name: "Complaints", href: "/complaints", icon: MessageSquare },
  { name: "Suggestions", href: "/suggestions", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="font-semibold text-gray-900">Securacore</h1>
            <p className="text-sm text-gray-500">Enterprise</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Projects
          </h2>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">User</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
