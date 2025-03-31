import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/routing";
import { FC, Fragment } from "react";

interface BreadcrumbLink {
  href: string;
  title: string;
}

interface CustomBreadcrumbProps {
  links: BreadcrumbLink[];
}

const CustomBreadcrumb: FC<CustomBreadcrumbProps> = ({ links }) => {
  return (
    <Breadcrumb className="my-5 text-gray-600 py-3">
      <BreadcrumbList>
        {links.map((link, i) =>
          i < links.length - 1 ? (
            <Fragment key={link.href}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={link.href}>{link.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          ) : (
            <BreadcrumbItem key={link.href}>
              <p className="text-primary underline underline-offset-4">
                {link.title}
              </p>
            </BreadcrumbItem>
          )
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
