"use client";

import { AddressData } from "@/components/map/map-modal";
import { useCallback, useState } from "react";

type InputType = [number, number] | string;

interface FetchedAddress {
  display_name: string;
  lat: string;
  lon: string;
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

const useLocationToAddress = () => {
  const [address, setAddress] = useState<AddressData | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocationDetails = useCallback(async (input: InputType) => {
    if (!input) return;

    // Coordinates → reverse geocoding; text → search
    const url = Array.isArray(input)
      ? `${NOMINATIM_URL}/reverse?format=json&lat=${input[0]}&lon=${input[1]}&zoom=18&addressdetails=1`
      : `${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(input.trim())}`;

    if (!Array.isArray(input) && !input.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(res.statusText);
      const json: FetchedAddress | FetchedAddress[] = await res.json();
      const result = Array.isArray(json) ? json[0] : json;
      if (!result) return;

      const coordinates: [number, number] = [Number(result.lat), Number(result.lon)];
      setAddress({ fullAddress: result.display_name, coordinates });
      setPosition(coordinates);
    } catch (error) {
      console.error("Geocoding failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getLocationDetails, position, setPosition, isLoading, address };
};

export default useLocationToAddress;
