"use client";

import { LogOut } from "lucide-react";
import Button from "../ui/button";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/services/auth.service";

const LogoutButton = () => {
  const t = useTranslations("home.header.user");
  const router = useRouter();

  const handleClick = async () => {
    try {
      // SessionInitializer resets the user and cart stores on SIGNED_OUT
      await signOut(createClient());
      router.push("/");
      router.refresh();
      toast.info(t("logOutToast"));
    } catch (error) {
      console.error("Sign out failed:", error);
    }
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
