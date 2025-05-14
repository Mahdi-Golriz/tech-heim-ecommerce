"use client";

import { LogOut } from "lucide-react";
import Button from "../ui/button";
import { removeCookie } from "@/utils/cookie";
import { useUserStore } from "@/store/user-store";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

const LogoutButton = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const clearCart = useCartStore((state) => state.clearCart);
  const handleClick = () => {
    removeCookie({ key: "jwt" });
    setUser(null);
    clearCart();
    router.push("/");
    toast.info("You've been successfully signed out");
  };

  return (
    <Button
      onClick={handleClick}
      variant="custom"
      size="custom"
      className="p-0 [&_svg]:size-4 text-black"
    >
      <LogOut size={24} />
      Log out
    </Button>
  );
};

export default LogoutButton;
