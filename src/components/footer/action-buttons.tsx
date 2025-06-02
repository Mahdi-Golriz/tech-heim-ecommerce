"use client";

import { PiCaretUp, PiChats } from "react-icons/pi";
import Button from "../ui/button";

const ActionButtons = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWhatsAppClick = () => {
    // Get phone number from environment variable
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const message =
      "Hello! I'd like to get in touch. Please feel free to ask any questions or share your thoughts.";

    if (!phoneNumber) {
      console.error("WhatsApp number not found in environment variables");
      return;
    }

    // WhatsApp Web URL format
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex justify-between lg:order-1 lg:flex-col lg:justify-between">
      <Button
        variant="icon"
        className="border rounded-full p-2 bg-primary-50 size-10"
        onClick={handleWhatsAppClick}
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
