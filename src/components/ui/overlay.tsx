import { cn } from "@/lib/utils";
import { FC } from "react";

interface Props {
  onClick: VoidFunction;
  className?: string;
}

const Overlay: FC<Props> = ({ onClick, className }) => {
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
