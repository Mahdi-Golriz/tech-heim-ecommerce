"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

import { Loader2 } from "lucide-react";
import Button from "../ui/button";

function Loader({ text }: { readonly text: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <p>{text}</p>
    </div>
  );
}

interface SubmitButtonProps {
  text: string;
  loadingText: string;
  className?: string;
  loading?: boolean;
}

export function SubmitButton({
  text,
  loadingText,
  loading,
  className,
}: Readonly<SubmitButtonProps>) {
  const { pending } = useFormStatus();
  // Use either the passed loading prop or the form status
  const isLoading = loading || pending;

  return (
    <Button
      type="submit"
      aria-disabled={isLoading}
      disabled={isLoading}
      className={cn(className)}
    >
      {isLoading ? <Loader text={loadingText} /> : text}
    </Button>
  );
}
