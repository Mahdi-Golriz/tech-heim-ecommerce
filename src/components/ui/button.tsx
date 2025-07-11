import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-white text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary-600 disabled:bg-primary-50",
        destructive: "bg-error",
        outline:
          "border-2 border-primary text-primary bg-white hover:text-primary-600 hover:border-primary-600 disabled:text-primary-50 disabled:border-primary-50",
        secondary:
          "bg-secondary hover:bg-secondary-500 disabled:bg-secondary-100",
        ghost: "hover:bg-primary-100 hover:text-primary-800",
        link: "text-black text-lg underline-offset-4 hover:text-primary hover:underline",
        icon: "text-black",
        custom: "",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-[10px]",
        lg: "h-11 rounded-md px-8",
        icon: "p-2",
        custom: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
