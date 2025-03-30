import { ComponentProps } from "react";
import Input from "../ui/input";

interface InputIconProps extends ComponentProps<typeof Input> {
  startIcon?: React.ComponentType<{ color: string }>;
  endIcon?: React.ComponentType<{ color: string }>;
  placeholder?: string;
  type?: string;
}

const InputIcon = ({
  startIcon: StartIcon,
  endIcon: EndIcon,
  placeholder,
  ...props
}: InputIconProps) => {
  return (
    <div className="relative align-bottom">
      {StartIcon && (
        <div className="absolute inset-y-0 start-0 flex items-center px-3">
          <StartIcon color="grey" />
        </div>
      )}
      <Input
        className="border-2 border-gray-400 pl-9 text-gray-500"
        placeholder={placeholder}
        {...props}
      />
      {EndIcon && (
        <div className="absolute inset-y-0 end-0 flex items-center px-3">
          <EndIcon color="grey" />
        </div>
      )}
    </div>
  );
};

export default InputIcon;
