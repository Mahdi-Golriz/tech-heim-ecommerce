import { Button } from "@/components";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { IconType } from "react-icons";

interface CustomLinkProps {
  Icon?: IconType;
  title: string;
  href: string;
  onClick?: VoidFunction;
  key: string;
  className?: string;
}

const CustomLink: FC<CustomLinkProps> = ({
  Icon,
  title,
  href,
  onClick,
  className,
}) => {
  return (
    <li>
      <Button
        variant="link"
        className={cn(
          "text-gray-600",
          !!Icon ? "[&_svg]:size-4 gap-1 h-fit text-sm" : "px-0  text-base",
          className
        )}
        asChild
        onClick={onClick}
      >
        <Link href={href}>
          {Icon && <Icon />}
          {title}
        </Link>
      </Button>
    </li>
  );
};

export default CustomLink;
