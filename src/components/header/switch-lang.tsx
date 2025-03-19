"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import React from "react";

const SwitchLang = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div>
      <select
        className="border py-1 px-2 rounded-lg cursor-pointer"
        onChange={(e) => handleLanguageChange(e)}
      >
        <option value="en">En</option>
        <hr />
        <option value="de">De</option>
      </select>
    </div>
  );
};

export default SwitchLang;
