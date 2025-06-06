import { Button } from "@/components";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { IconType } from "react-icons";

interface CustomLinkProps {
  Icon?: IconType;
  title: string;
  href: string;
  onClick?: VoidFunction;
  className?: string;
}

const CustomLink = ({
  Icon,
  title,
  href,
  onClick,
  className,
}: CustomLinkProps) => {
  const isDisabled = !href || href === "#" || href === "";
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
        {!isDisabled ? (
          <Link href={href}>
            {Icon && <Icon />}
            {title}
          </Link>
        ) : (
          <span className="cursor-pointer">
            {Icon && <Icon />}
            {title}
          </span>
        )}
      </Button>
    </li>
  );
};

export default CustomLink;
