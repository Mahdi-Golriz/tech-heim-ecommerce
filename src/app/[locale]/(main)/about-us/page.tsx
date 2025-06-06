import AboutUs from "@/components/about-us/about-us";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Heim | About us",
};

const AboutUsPage = () => {
  return (
    <div className="container">
      <AboutUs />
    </div>
  );
};

export default AboutUsPage;
