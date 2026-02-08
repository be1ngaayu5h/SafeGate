"use client";
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
  return (
    <div className="px-3 sm:px-7 py-2 flex justify-between items-center">
      <SidebarTrigger />
    </div>
  );
};

export default Header;
