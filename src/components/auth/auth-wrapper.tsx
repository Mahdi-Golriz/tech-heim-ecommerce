"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PiArrowLeftLight } from "react-icons/pi";
import Button from "../ui/button";
import GoogleProviderButton from "./google-provider-button";
import useAuthModalStore from "@/store/auth-modal-store";
import SignInForm from "../forms/signin-form";
import SignUpForm from "../forms/signup-form";

export type AuthTabs = "signin" | "signup";

const AuthWrapper = () => {
  const [activeTab, setActiveTab] = useState<AuthTabs>("signin");
  const { toggleAuthModal } = useAuthModalStore();
  const isSignup = activeTab === "signup";

  const handleChangeTabs = () => {
    setActiveTab(() => (activeTab === "signin" ? "signup" : "signin"));
  };

  const tabContent = (
    <Tabs value={activeTab} onValueChange={handleChangeTabs} className="w-full">
      <TabsList className="grid w-full grid-cols-2 ">
        <TabsTrigger value="signin">Log in</TabsTrigger>
        <TabsTrigger value="signup">Create account</TabsTrigger>
      </TabsList>
      <h3 className="text-xl font-medium mt-10 mb-6">
        {isSignup ? "Create your account" : "Log in to Tech Heim"}
      </h3>
      <TabsContent value="signin" className="mt-4">
        {!isSignup && <SignInForm />}
      </TabsContent>
      <TabsContent value="signup" className="mt-4">
        {isSignup && <SignUpForm />}
      </TabsContent>
    </Tabs>
  );

  const changeTabButton = (
    <div className="mb-6">
      <span className="text-gray-500">
        {isSignup ? "Already have an account ?" : "Don’t have an account ?"}
      </span>
      <Button variant="link" onClick={handleChangeTabs}>
        {isSignup ? "Sign In" : "Sign Up"}
      </Button>
    </div>
  );

  return (
    <>
      {/* mobile */}
      <div className="fixed inset-0 z-50 bg-white flex flex-col text-center px-6 overflow-y-auto sm:hidden">
        <h2 className="text-2xl font-medium text-primary mt-14 mb-6">
          Tech Heim
        </h2>
        <Button
          onClick={toggleAuthModal}
          variant="icon"
          className="absolute top-4 left-4 p-0 size-fit"
          aria-label="Close"
        >
          <PiArrowLeftLight className="w-6 h-6" />
        </Button>
        <div>{tabContent}</div>
        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="px-4 text-gray-600">Or Log In with</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <GoogleProviderButton />
        <div>{changeTabButton}</div>
      </div>
      {/* desktop */}
      <div className="fixed inset-0 z-50 bg-black/50 sm:flex items-center justify-center text-center hidden">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative min-h-[600px]">
          <div className="p-6">{tabContent}</div>
          <div className="flex items-center px-6">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="px-4 text-gray-600">Or Log In with</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="px-6">
            <GoogleProviderButton />
          </div>
          <div>{changeTabButton}</div>
          <Button
            onClick={toggleAuthModal}
            variant="icon"
            className="absolute top-4 left-4 p-0 size-fit"
            aria-label="Close"
          >
            <PiArrowLeftLight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default AuthWrapper;
