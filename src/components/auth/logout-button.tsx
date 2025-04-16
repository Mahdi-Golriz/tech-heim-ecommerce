"use client";

import { LogOut } from "lucide-react";
import Button from "../ui/button";
import { removeCookie } from "@/utils/cookie";
import { useUserStore } from "@/store/user-store";

const LogoutButton = () => {
  const setUser = useUserStore((state) => state.setUser);

  const handleClick = () => {
    removeCookie({ key: "jwt" });
    setUser(null);
  };

  return (
    <Button
      onClick={handleClick}
      variant="custom"
      size="custom"
      className="p-0 [&_svg]:size-4 text-black"
    >
      <LogOut size={24} />
      Log out
    </Button>
  );
};

export default LogoutButton;
