"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { useUserStore } from "@/store/user-store";
import ProfileForm from "./profile-form";
import ProfileOrders from "./profile-orders";
import ProfileWishlist from "./profile-wishlist";

import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const Profile = () => {
  const user = useUserStore((state) => state.user);
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("profile.tabs");

  const currentTab = searchParams.get("tab") || "account";

  // Handle tab change
  const handleTabChange = (tabValue: string) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("tab", tabValue);
    router.push(`/profile?${newSearchParams.toString()}`);
  };

  if (!user) return <div>{t("loadingState")}</div>;

  return (
    <>
      <Tabs
        defaultValue="account"
        value={currentTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="my-4">
          <TabsTrigger value="account">{t("personalData")}</TabsTrigger>
          <TabsTrigger value="orders">{t("orders")}</TabsTrigger>
          <TabsTrigger value="wishlist">{t("wishlist")}</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="w-full">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="orders">
          <ProfileOrders />
        </TabsContent>
        <TabsContent value="wishlist">
          <ProfileWishlist />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Profile;
