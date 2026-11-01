"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { ActionError } from "@/models/action-result";

/** Translates an ActionError code into a user-facing message. */
const useActionError = () => {
  const t = useTranslations("errors");
  return useCallback((error: Pick<ActionError, "code">) => t(error.code), [t]);
};

export default useActionError;
