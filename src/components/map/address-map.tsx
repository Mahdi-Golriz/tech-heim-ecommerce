import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Map as LeafletMap } from "leaflet";
import { JSX, useEffect, useState } from "react";
import Button from "../ui/button";
import { AddressData } from "./map-modal";
import useLocationToAddress from "../../hooks/useLocationToAddress";

interface AddressMapProps {
  onAddressSelected: (addressData: AddressData) => void;
}

interface MapMarkerProps {
  position: [number, number] | null;
  setPosition: (position: [number, number]) => void;
}

// Define marker icon outside of component (prevents recreation on renders)
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// MapMarker component to handle marker position changes
function MapMarker({
  position,
  setPosition,
}: MapMarkerProps): JSX.Element | null {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} icon={defaultIcon} /> : null;
}

const AddressMap = ({ onAddressSelected }: AddressMapProps): JSX.Element => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [searchAddress, setSearchAddress] = useState<string>("");

  const { getLocationDetails, position, isLoading, address } =
    useLocationToAddress();

  useEffect(() => {
    if (address && position) {
      onAddressSelected(address);
      map?.flyTo(position, 15);
    }
  }, [address, position, onAddressSelected, map]);

  // Default center position
  const defaultCenter: [number, number] = [53.5488, 9.9872];

  // Handle address search
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!searchAddress.trim() || !map) return;

    await getLocationDetails(searchAddress);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Search for an address"
            className="flex-1 p-2 border rounded-l"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-l-none w-24 h-[42px]"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>

      <div className="h-[300px] sm:h-[400px] md:h-[500px] w-full rounded overflow-hidden">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          ref={setMap}
          className="size-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapMarker position={position} setPosition={getLocationDetails} />
        </MapContainer>
      </div>

      {isLoading && (
        <div className="mt-2 p-2 text-sm text-blue-600">Loading address...</div>
      )}

      {/* Display the address in the UI */}
      <div className="mt-2 p-2 border rounded-md bg-gray-50">
        {address && !isLoading && (
          <>
            <p className="font-medium">Selected Address:</p>
            <p className="text-sm">{address.fullAddress}</p>
          </>
        )}
      </div>
      <p className="text-sm mt-2">Click on the map to select your address</p>
    </div>
  );
};

export default AddressMap;
