import { CustomBreadcrumb } from "@/components";
import ContactUs from "@/components/contact-us/contact-us";

const links = [
  { href: "/", title: "Home" },
  {
    href: "",
    title: "Contact us",
  },
];

const ContactPage = () => {
  return (
    <div className="container">
      <CustomBreadcrumb links={links} />
      <ContactUs />
    </div>
  );
};

export default ContactPage;
