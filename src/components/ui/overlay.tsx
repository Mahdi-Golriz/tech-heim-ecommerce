import { cn } from "@/lib/utils";
import { FC } from "react";

interface OverLayProps {
  onClick: VoidFunction;
  className?: string;
}

const Overlay: FC<OverLayProps> = ({ onClick, className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 size-full z-10 bg-black/50 sm:hidden backdrop-blur-sm",
        className
      )}
      aria-hidden="true"
      onClick={onClick}
    />
  );
};

export default Overlay;
