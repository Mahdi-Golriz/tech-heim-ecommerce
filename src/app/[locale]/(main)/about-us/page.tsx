import AboutTechHelm from "@/components/about-us/about-us";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Heim | About us",
};

const AboutUsPage = () => {
  return (
    <div className="container">
      <AboutTechHelm />
    </div>
  );
};

export default AboutUsPage;
