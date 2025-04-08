"use client";

import { PiUserLight } from "react-icons/pi";
import Button from "../ui/button";
import AuthWrapper, { AuthTabs } from "../auth/auth-wrapper";
import SignInForm from "../forms/signin-form";
import { useState } from "react";
import SignUpForm from "../forms/signup-form";
import { getStrapiCookie } from "@/utils/cookie";

const UserButton = () => {
  const authToken = getStrapiCookie();
  console.log(authToken);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthTabs>("signin");

  const handleChangeTabs = () => {
    setActiveTab(() => (activeTab === "signin" ? "signup" : "signin"));
  };

  const toggleShowModal = () => {
    setIsOpen((prev) => !prev);
    document.body.classList.toggle("overflow-hidden");
  };

  if (authToken)
    return (
      <>
        <Button variant="icon" size="icon" onClick={toggleShowModal}>
          <PiUserLight />
        </Button>
        {isOpen && (
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
        )}
      </>
    );
};

export default UserButton;
