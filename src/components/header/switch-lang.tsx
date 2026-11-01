"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SwitchLang = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    // Read at click time instead of useSearchParams, which would opt the
    // header out of static rendering
    const href = `${pathname}${window.location.search}`;
    router.replace(href, { locale: newLocale });
  };

  return (
    <Select onValueChange={handleLanguageChange} defaultValue={currentLocale}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white min-w-fit" align="end">
        <SelectGroup>
          <SelectItem value="en">En</SelectItem>
          <SelectItem value="de">De</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SwitchLang;
