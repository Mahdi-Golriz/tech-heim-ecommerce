import { setRequestLocale } from "next-intl/server";
import ContactUs from "@/components/contact-us/contact-us";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Heim | Contact us",
};

const ContactPage = async ({ params }: PageProps<"/[locale]/contact-us">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container">
      <ContactUs />
    </div>
  );
};

export default ContactPage;
