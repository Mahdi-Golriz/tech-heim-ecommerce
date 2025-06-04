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
import { useSearchParams } from "next/navigation";

const SwitchLang = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const searchParams = useSearchParams();

  const handleLanguageChange = (newLocale: string) => {
    const queryString = searchParams.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;
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
