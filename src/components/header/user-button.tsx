"use client";

import { PiUserLight } from "react-icons/pi";
import Button from "../ui/button";
import AuthWrapper from "../auth/auth-wrapper";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown";
import { User } from "lucide-react";
import LogoutButton from "../auth/logout-button";
import { useUserStore } from "@/store/user-store";
import useAuthModalStore from "@/store/auth-modal-store";
import { useEffect, useState } from "react";

const UserButton = () => {
  const { isAuthModalOpen, toggleAuthModal } = useAuthModalStore();

  const user = useUserStore((state) => state.user);
  const [sideOffset, setSideOffset] = useState(70);
  useEffect(() => {
    const updateSideOffset = () => {
      if (window.innerWidth > 640) {
        setSideOffset(30);
      } else {
        setSideOffset(10);
      }
    };

    updateSideOffset();
    window.addEventListener("resize", updateSideOffset);

    return () => {
      window.removeEventListener("resize", updateSideOffset);
    };
  });
  // If user is authenticated, show dropdown
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="icon" size="icon">
            <PiUserLight />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="rounded-t-none"
          sideOffset={sideOffset}
          align="end"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User />
              <span>{user.username}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If user is not authenticated, show login button
  return (
    <>
      <Button variant="icon" size="icon" onClick={toggleAuthModal}>
        <PiUserLight />
      </Button>

      {isAuthModalOpen && <AuthWrapper />}
    </>
  );
};

export default UserButton;
