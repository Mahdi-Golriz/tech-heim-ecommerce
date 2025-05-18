"use client";

import { AddressData } from "@/components/map/map-modal";
import useFetch from "./useFetch";
import { useCallback, useState } from "react";

type InputType = [number, number] | string;

interface FetchedAddress {
  display_name: string;
  lat: string;
  lon: string;
}

const useLocationToAddress = () => {
  const [address, setAddress] = useState<AddressData | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);

  const { fetchData, isLoading } = useFetch({
    autoFetch: false,
    strapiReq: false,
    onSuccess: (fetchedAddress: FetchedAddress | FetchedAddress[]) => {
      if (Array.isArray(fetchedAddress)) {
        const firstAddress = fetchedAddress[0];
        setAddress({
          fullAddress: firstAddress.display_name,
          coordinates: [Number(firstAddress.lat), Number(firstAddress.lon)],
        });
        setPosition([Number(firstAddress.lat), Number(firstAddress.lon)]);
      } else {
        setAddress({
          fullAddress: fetchedAddress.display_name,
          coordinates: [Number(fetchedAddress.lat), Number(fetchedAddress.lon)],
        });
        setPosition([Number(fetchedAddress.lat), Number(fetchedAddress.lon)]);
      }
    },
  });

  const getLocationDetails = useCallback(
    async (input: InputType): Promise<void> => {
      if (!input) return;

      // Case: Coordinate input
      if (Array.isArray(input)) {
        const [lat, lon] = input;

        await fetchData({
          path: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        });
      }

      // Case: Address input (string)
      else if (typeof input === "string") {
        const query = input.trim();
        if (!query) return;

        await fetchData({
          path: `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`,
        });
      }
    },
    [fetchData]
  );

  return {
    getLocationDetails,
    position,
    setPosition,
    isLoading,
    address,
  };
};

export default useLocationToAddress;
