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

  //TODO: define functions

  const { fetchData, isLoading } = useFetch({
    autoFetch: false,
    baseUrl: "https://nominatim.openstreetmap.org",
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
          path: `/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        });
      }

      // Case: Address input (string)
      else {
        const query = input.trim();
        if (!query) return;

        await fetchData({
          path: `/search?format=json&q=${encodeURIComponent(query)}`,
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
