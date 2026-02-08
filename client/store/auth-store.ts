import { create } from "zustand";

interface AuthStore {
  userType: null | "admin" | "resident" | "security";
  login: (email: string) => void;
  logout: () => void;
}

const getInitialUserType = (): AuthStore["userType"] => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("userType");
  return stored as AuthStore["userType"] | null;
};

export const useAuthStore = create<AuthStore>((set) => ({
  userType: getInitialUserType(),
  login: (email: string) => {
    let userType: AuthStore["userType"] = null;

    if (email.includes("admin")) userType = "admin";
    else if (email.includes("resident")) userType = "resident";
    else if (email.includes("security")) userType = "security";

    localStorage.setItem("userType", userType || "");
    set(() => ({ userType }));
  },
  logout: () => {
    localStorage.removeItem("userType");
    set(() => ({ userType: null }));
  },
}));
