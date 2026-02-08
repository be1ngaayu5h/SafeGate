import { Key } from "lucide-react";
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-1 font-mono w-fit font-semibold text-black dark:text-yellow-300">
      <span className="text-lg">SecuraCore</span>
      <Key className="mb-1" size={20} />
    </div>
  );
};

export default Logo;
