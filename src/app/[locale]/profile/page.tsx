import Profile from "@/components/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Heim | Profile",
};

const ProfilePage = () => {
  return (
    <div className="container">
      <Profile />
    </div>
  );
};

export default ProfilePage;
