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
import { useAuthModalStore } from "@/store/auth-modal-store";

const UserButton = () => {
  const { isAuthModalOpen, toggleAuthModal } = useAuthModalStore();

  const user = useUserStore((state) => state.user);

  const Content = () =>
    user ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="h-full flex items-center">
            <Button variant="icon" size="icon">
              <PiUserLight />
            </Button>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="absolute -right-8 top-0 rounded-b-lg"
          sideOffset={0}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User />
              <span>{user?.username}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <AuthWrapper />
    );

  return user ? (
    <Content />
  ) : (
    <>
      <Button variant="icon" size="icon" onClick={toggleAuthModal}>
        <PiUserLight />
      </Button>
      {isAuthModalOpen && <Content />}
    </>
  );
};

export default UserButton;
