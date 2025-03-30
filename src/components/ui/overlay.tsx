import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface OverLayProps {
  onClick?: VoidFunction;
  className?: string;
  children?: ReactNode;
}

const Overlay: FC<OverLayProps> = ({ onClick, className, children }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 size-full z-20 bg-black/50 backdrop-blur-sm",
        className
      )}
      aria-hidden="true"
      aria-expanded="true"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Overlay;
