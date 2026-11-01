"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ProfileForm from "./profile-form";
import ProfileOrders from "./profile-orders";
import ProfileWishlist from "./profile-wishlist";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Order } from "@/models/order-model";
import { ProductSummary } from "@/models/product-model";
import { Profile as ProfileModel } from "@/models/user-model";

interface ProfileProps {
  email: string;
  profile: ProfileModel | null;
  orders: Order[];
  wishlist: ProductSummary[];
}

const Profile = ({ email, profile, orders, wishlist }: ProfileProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("profile.tabs");

  const currentTab = searchParams.get("tab") || "account";

  const handleTabChange = (tabValue: string) => {
    router.replace(`${pathname}?tab=${tabValue}`, { scroll: false });
  };

  return (
    <Tabs defaultValue="account" value={currentTab} onValueChange={handleTabChange}>
      <TabsList className="my-4">
        <TabsTrigger value="account">{t("personalData")}</TabsTrigger>
        <TabsTrigger value="orders">{t("orders")}</TabsTrigger>
        <TabsTrigger value="wishlist">{t("wishlist")}</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="w-full">
        <ProfileForm email={email} profile={profile} />
      </TabsContent>
      <TabsContent value="orders">
        <ProfileOrders orders={orders} />
      </TabsContent>
      <TabsContent value="wishlist">
        <ProfileWishlist products={wishlist} />
      </TabsContent>
    </Tabs>
  );
};

export default Profile;
