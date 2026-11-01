"use client";

import { useSyncExternalStore } from "react";

interface PersistApi {
  // Undefined on the server: persist() skips its API when storage is unavailable
  persist?: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
  };
}

const noopSubscribe = () => () => {};

/** True once a zustand `persist` store has loaded from storage (false on the server). */
const useStoreHydrated = (store: PersistApi) =>
  useSyncExternalStore(
    store.persist?.onFinishHydration ?? noopSubscribe,
    () => store.persist?.hasHydrated() ?? false,
    () => false
  );

export default useStoreHydrated;
