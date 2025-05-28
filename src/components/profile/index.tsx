"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { useUserStore } from "@/store/user-store";
import ProfileForm from "./profile-form";
import ProfileOrders from "./profile-orders";

const Profile = () => {
  const user = useUserStore((state) => state.user);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Tabs>
        <TabsList className="my-4">
          <TabsTrigger value="personal">Personal Data</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wish list</TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="w-full">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="orders">
          <ProfileOrders />
        </TabsContent>
        <TabsContent value="wishlist">Wish list</TabsContent>
      </Tabs>
    </>
  );
};

export default Profile;
