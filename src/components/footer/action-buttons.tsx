"use client";

import { PiCaretUp, PiChats } from "react-icons/pi";
import Button from "../ui/button";

const ActionButtons = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex justify-between lg:order-1 lg:flex-col lg:justify-between">
      <Button
        variant="icon"
        className="border rounded-full p-2 bg-primary-50 size-10"
      >
        <PiChats />
      </Button>
      <Button
        variant="icon"
        className="border rounded-full p-2 bg-primary-50 [&_svg]:size-4 size-10"
        onClick={handleScrollToTop}
      >
        <PiCaretUp strokeWidth={10} />
      </Button>
    </div>
  );
};

export default ActionButtons;
