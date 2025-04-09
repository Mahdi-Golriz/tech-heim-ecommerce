"use client";

import { LogOut } from "lucide-react";
import Button from "../ui/button";
import { deleteStrapiCookie } from "@/utils/cookie";

interface LogoutButtonProps {
  handleAuthTokenState: VoidFunction;
}

const LogoutButton = ({ handleAuthTokenState }: LogoutButtonProps) => {
  const handleClick = () => {
    deleteStrapiCookie();
    handleAuthTokenState();
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
