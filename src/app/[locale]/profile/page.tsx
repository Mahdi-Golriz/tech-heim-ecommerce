import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Profile from "@/components/profile";
import { redirect } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/data/session";
import { listOrders } from "@/services/orders.service";
import { getWishlistProducts } from "@/services/wishlist.service";
import { getProfile } from "@/services/profile.service";

export const metadata: Metadata = {
  title: "Tech Heim | Profile",
};

const ProfilePage = async ({ params }: PageProps<"/[locale]/profile">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSessionUser();
  if (!user) return redirect({ href: "/", locale });

  const supabase = await createClient();
  const [profile, orders, wishlist] = await Promise.all([
    getProfile(supabase, user.id),
    listOrders(supabase),
    getWishlistProducts(supabase),
  ]);

  return (
    <div className="container">
      <Profile
        email={user.email}
        profile={profile}
        orders={orders}
        wishlist={wishlist}
      />
    </div>
  );
};

export default ProfilePage;
