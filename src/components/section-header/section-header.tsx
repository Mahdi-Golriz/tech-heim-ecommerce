import { FC } from "react";
import Button from "../ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { PiCaretRight } from "react-icons/pi";

interface SectionHeaderProps {
  title: string;
  className?: string;
  cta?: {
    text: string;
    url: string;
  };
}

const SectionHeader: FC<SectionHeaderProps> = ({ title, cta, className }) => {
  return (
    <header className="container">
      <div
        className={cn(
          "flex items-center justify-between pb-2 mb-4 lg:pb-4 lg:mb-8 border-b-2 border-gray-300 h-fit",
          className
        )}
      >
        <h2 className="text-base font-medium lg:text-3xl">{title}</h2>
        {cta ? (
          <Button
            variant="link"
            className="p-0 h-fit [&_svg]:size-3 text-sm lg:text-base"
          >
            <Link href={cta.url}>{cta.text}</Link>
            <PiCaretRight strokeWidth={10} />
          </Button>
        ) : null}
      </div>
    </header>
  );
};

export default SectionHeader;
