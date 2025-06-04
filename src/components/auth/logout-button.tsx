"use client";

import { LogOut } from "lucide-react";
import Button from "../ui/button";
import { removeCookie } from "@/utils/cookie";
import { useUserStore } from "@/store/user-store";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const LogoutButton = () => {
  const t = useTranslations("home.header.user");
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const clearCart = useCartStore((state) => state.clearCart);
  const handleClick = () => {
    removeCookie({ key: "jwt" });
    setUser(null);
    clearCart();
    router.push("/");
    toast.info(t("logOutToast"));
  };

  return (
    <Button
      onClick={handleClick}
      variant="custom"
      size="custom"
      className="p-0 [&_svg]:size-4 text-black hover:text-primary"
    >
      <div className="p-2">
        <LogOut size={24} />
      </div>
      {t("logOut")}
    </Button>
  );
};

export default LogoutButton;
