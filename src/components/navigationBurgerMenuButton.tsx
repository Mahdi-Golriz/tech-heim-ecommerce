"use client";

import { PiListLight } from "react-icons/pi";
import Button from "./ui/button";
import { useState } from "react";
import SideBarMenu from "./sidebarMenu";

const NavigationBurgerMenuButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        variant="icon"
        className="block sm:hidden"
        onClick={() => setIsOpen(true)}
      >
        <PiListLight />
      </Button>
      <SideBarMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default NavigationBurgerMenuButton;
