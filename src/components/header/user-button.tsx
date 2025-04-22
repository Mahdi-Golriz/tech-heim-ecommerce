"use client";

import { PiUserLight } from "react-icons/pi";
import Button from "../ui/button";
import AuthWrapper, { AuthTabs } from "../auth/auth-wrapper";
import SignInForm from "../forms/signin-form";
import { useState } from "react";
import SignUpForm from "../forms/signup-form";
// import { useShallow } from "zustand/react/shallow";
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
// import useFetch from "@/hooks/useFetch";
// import { User as IUser } from "@/models/user-model";

const UserButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthTabs>("signin");

  const user = useUserStore((state) => state.user);

  const handleChangeTabs = () => {
    setActiveTab(() => (activeTab === "signin" ? "signup" : "signin"));
  };

  const toggleShowModal = () => {
    setIsOpen((prev) => !prev);
    document.body.classList.toggle("overflow-hidden");
  };

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
      <AuthWrapper
        onClose={toggleShowModal}
        activeTab={activeTab}
        handleChangeTabs={handleChangeTabs}
      >
        {activeTab === "signin" ? (
          <SignInForm onClose={toggleShowModal} />
        ) : (
          <SignUpForm onClose={toggleShowModal} />
        )}
      </AuthWrapper>
    );

  return user ? (
    <Content />
  ) : (
    <>
      <Button variant="icon" size="icon" onClick={toggleShowModal}>
        <PiUserLight />
      </Button>
      {isOpen && <Content />}
    </>
  );
};

export default UserButton;
