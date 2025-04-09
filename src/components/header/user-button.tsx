"use client";

import { PiUserLight } from "react-icons/pi";
import Button from "../ui/button";
import AuthWrapper, { AuthTabs } from "../auth/auth-wrapper";
import SignInForm from "../forms/signin-form";
import { useEffect, useState } from "react";
import SignUpForm from "../forms/signup-form";
import { getStrapiCookie } from "@/utils/cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown";
import { User } from "lucide-react";
import LogoutButton from "../auth/logout-button";

const UserButton = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthTabs>("signin");

  const token = getStrapiCookie();
  useEffect(() => {
    setAuthToken(typeof token === "string" ? token : null);
  }, [authToken, token]);

  const handleChangeTabs = () => {
    setActiveTab(() => (activeTab === "signin" ? "signup" : "signin"));
  };

  const toggleShowModal = () => {
    setIsOpen((prev) => !prev);
    document.body.classList.toggle("overflow-hidden");
  };

  const Content = () =>
    authToken ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="h-full flex items-center">
            <Button variant="icon" size="icon">
              <PiUserLight />
            </Button>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="absolute -right-8 top-0">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User />
              <span>Jimmy Smith</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogoutButton handleAuthTokenState={() => setAuthToken(null)} />
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

  return authToken ? (
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
