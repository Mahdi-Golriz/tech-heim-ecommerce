import PaymentMethods from "./payment-methods";
import SocialMediaIcons from "./social-media-icons";
import ActionButtons from "./action-buttons";
import NewsletterSubscription from "./newsletter-subscription";
import DesktopFooterLinks from "./desktop-footer-links";
import MobileFooterAccordion from "./mobile-footer-accordion";
import FooterBottom from "./footer-bottom";

const Footer = () => {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="bg-radial-blue">
        <div className="container flex flex-col gap-4 py-4 lg:flex-row lg:justify-between">
          <DesktopFooterLinks />
          <ActionButtons />
          <div className="p-2">
            <NewsletterSubscription />
            <SocialMediaIcons className="gap-4 py-4 hidden lg:flex" />
          </div>
          <MobileFooterAccordion />
        </div>
        <PaymentMethods className="container lg:flex gap-1 hidden mt-8" />
      </div>
      <div className="container flex justify-between py-2 lg:hidden">
        <PaymentMethods className="flex gap-1" />
        <SocialMediaIcons className="flex gap-2" />
      </div>
      <div className="container lg:flex justify-between items-center py-3 hidden">
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
