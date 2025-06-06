import { ComponentProps } from "react";
import Input from "../ui/input";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const iconInputVariants = cva("", {
  variants: {
    variant: {
      authentication: "border-2 border-gray-400 pl-9 text-gray-500",
      checkout: "border-none bg-gray-50 text-gray-700",
    },
  },
  defaultVariants: {
    variant: "authentication",
  },
});

interface InputIconProps
  extends ComponentProps<typeof Input>,
    VariantProps<typeof iconInputVariants> {
  startIcon?: React.ComponentType<{ color?: string }>;
  endIcon?: React.ComponentType<{ color?: string }>;
  placeholder?: string;
  type?: string;
  color?: string;
  parentClassName?: string;
}

const InputIcon = ({
  startIcon: StartIcon,
  endIcon: EndIcon,
  placeholder,
  color = "gray",
  className,
  variant,
  parentClassName,
  ...props
}: InputIconProps) => {
  return (
    <div className={cn("relative align-bottom", parentClassName)}>
      {StartIcon && (
        <div className="absolute inset-y-0 start-0 flex items-center px-3">
          <StartIcon color={color} />
        </div>
      )}
      <Input
        className={iconInputVariants({ variant, className })}
        placeholder={placeholder}
        {...props}
      />
      {EndIcon && (
        <div className="absolute inset-y-0 end-0 flex items-center px-3">
          <EndIcon color={color} />
        </div>
      )}
    </div>
  );
};

export default InputIcon;
