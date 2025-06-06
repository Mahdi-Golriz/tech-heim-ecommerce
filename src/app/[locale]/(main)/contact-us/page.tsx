import ContactUs from "@/components/contact-us/contact-us";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Heim | Contact us",
};

const ContactPage = () => {
  return (
    <div className="container">
      <ContactUs />
    </div>
  );
};

export default ContactPage;
