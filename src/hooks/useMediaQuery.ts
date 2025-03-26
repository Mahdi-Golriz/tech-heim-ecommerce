"use client";

import { useState, useEffect } from "react";

/**
 * Hook that returns true if the current viewport matches the provided media query
 *
 * @param query The media query to check against (e.g., "(max-width: 640px)")
 * @returns Boolean indicating if the viewport matches the query
 */
export function useMediaQuery(query: string): boolean {
  // Default to false for SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return;

    // Create a media query list
    const mediaQuery = window.matchMedia(query);

    // Set the initial value
    setMatches(mediaQuery.matches);

    // Create an event listener function to update the state
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the event listener
    mediaQuery.addEventListener("change", handler);

    // Clean up by removing the event listener
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]); // Re-run if the query changes

  return matches;
}

export default useMediaQuery;
