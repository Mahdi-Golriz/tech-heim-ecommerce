import { CustomBreadcrumb } from "@/components";
import AboutTechHelm from "@/components/about-us/about-us";

const links = [
  { href: "/", title: "Home" },
  {
    href: "",
    title: "About us",
  },
];

const AboutUsPage = () => {
  return (
    <div className="container">
      <CustomBreadcrumb links={links} />
      <AboutTechHelm />
    </div>
  );
};

export default AboutUsPage;
