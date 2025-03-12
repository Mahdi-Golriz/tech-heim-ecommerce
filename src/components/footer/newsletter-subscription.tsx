"use client";

import { PiCaretRight, PiUserLight } from "react-icons/pi";
import Button from "../ui/button";
import Input from "../ui/input";
import { useTranslations } from "next-intl";

const NewsletterSubscription = () => {
  const t = useTranslations("footer.emailInput");

  return (
    <>
      <label htmlFor="email">{t("label")}</label>
      <div className="w-full flex rounded-lg border-2 mt-3 px-3">
        <div className="inset-y-0 start-0 flex items-center pointer-events-none">
          <PiUserLight color="white" strokeWidth={10} />
        </div>
        <Input
          id="email"
          placeholder={t("placeholder")}
          type="email"
          className="bg-transparent border-none pl-2 focus-visible:ring-0 focus-visible:ring-offset-0 lg:w-64"
        />
        <Button variant="icon" className="[&_svg]:size-3 px-2">
          <PiCaretRight color="white" strokeWidth={10} />
        </Button>
      </div>
    </>
  );
};
export default NewsletterSubscription;
