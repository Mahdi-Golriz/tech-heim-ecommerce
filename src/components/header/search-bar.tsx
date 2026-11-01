"use client";

import Form from "next/form";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { PiMagnifyingGlassLight } from "react-icons/pi";
import { Input } from "@/components";
import { cn } from "@/lib/cn";

interface SearchBarProps {
  className?: string;
  onSubmit?: () => void;
}

/**
 * GET form to /products?q=… — next/form prefetches the route and navigates
 * client-side; other filters are intentionally reset by a new search.
 */
const SearchBar = ({ className, onSubmit }: SearchBarProps) => {
  const t = useTranslations("home.header.search");
  const locale = useLocale();
  const query = useSearchParams().get("q") ?? "";

  return (
    <Form
      action={`/${locale}/products`}
      role="search"
      className={cn("relative", className)}
      onSubmit={onSubmit}
    >
      <Input
        // Remount when the URL query changes so the field reflects it
        key={query}
        name="q"
        type="search"
        defaultValue={query}
        maxLength={100}
        aria-label={t("label")}
        className="border-none bg-gray-100 pr-10"
        placeholder={t("placeholder")}
      />
      <button
        type="submit"
        aria-label={t("submit")}
        className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-500 hover:text-primary"
      >
        <PiMagnifyingGlassLight />
      </button>
    </Form>
  );
};

export default SearchBar;
