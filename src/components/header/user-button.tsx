"use client";

import { PiUserLight } from "react-icons/pi";
import Button from "../ui/button";
import AuthWrapper, { AuthTabs } from "../auth/auth-wrapper";
import SignInForm from "../forms/signin-form";
import { useState } from "react";
import SignUpForm from "../forms/signup-form";

const UserButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthTabs>("signin");

  const handleChangeTabs = () => {
    setActiveTab(() => (activeTab === "signin" ? "signup" : "signin"));
  };

  return (
    <>
      <Button variant="icon" size="icon" onClick={() => setIsOpen(true)}>
        <PiUserLight />
      </Button>
      {isOpen && (
        <AuthWrapper
          onClose={() => setIsOpen(false)}
          activeTab={activeTab}
          handleChangeTabs={handleChangeTabs}
        >
          {activeTab === "signin" ? <SignInForm /> : <SignUpForm />}
        </AuthWrapper>
      )}
    </>
  );
};

export default UserButton;
