"use client";

import { ReactNode, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PiArrowLeftLight } from "react-icons/pi";
import Button from "../ui/button";
import GoogleProviderButton from "./google-provider-button";

export type AuthTabs = "signin" | "signup";

interface AuthWrapperProps {
  children: ReactNode;
  onClose: VoidFunction;
  activeTab: AuthTabs;
  handleChangeTabs: VoidFunction;
}

const AuthWrapper = ({
  children,
  onClose,
  activeTab,
  handleChangeTabs,
}: AuthWrapperProps) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const isSignup = activeTab === "signup";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);

      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

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
        {!isSignup && children}
      </TabsContent>
      <TabsContent value="signup" className="mt-4">
        {isSignup && children}
      </TabsContent>
    </Tabs>
  );

  const changeTabButton = (
    <div className="mb-6">
      <span className="text-gray-500">
        {isSignup ? "Already have an account ?" : "Don’t have an account ?"}
      </span>
      <Button variant="link" onClick={handleChangeTabs}>
        {isSignup ? "Sign Up" : "Sign In"}
      </Button>
    </div>
  );

  // Prevent rendering until `isMobile` is determined
  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col text-center px-6 overflow-y-auto">
        <h2 className="text-2xl font-medium text-primary mt-14 mb-6">
          Tech Heim
        </h2>
        <Button
          onClick={onClose}
          variant="icon"
          className="absolute top-4 left-4 p-0 size-fit"
          aria-label="Close"
        >
          <PiArrowLeftLight className="w-6 h-6" />
        </Button>

        <div className="flex-1">{tabContent}</div>
        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="px-4 text-gray-600">Or Log In with</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <GoogleProviderButton />
        <div>{changeTabButton}</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center text-center">
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
          onClick={onClose}
          variant="icon"
          className="absolute top-4 left-4 p-0 size-fit"
          aria-label="Close"
        >
          <PiArrowLeftLight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default AuthWrapper;
