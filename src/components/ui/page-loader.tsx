"use client";

import { cn } from "@/lib/utils";
import { PuffLoader } from "react-spinners";

interface LoadingWrapperProps {
  fullPage?: boolean;
}

const PageLoader = ({ fullPage }: LoadingWrapperProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center size-full flex-1",
        fullPage ? "min-h-screen" : "py-4"
      )}
    >
      <PuffLoader color="#0C68F4" />
    </div>
  );
};

export default PageLoader;
