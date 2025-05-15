import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Map as LeafletMap } from "leaflet";
import { JSX, useEffect, useState } from "react";
import Button from "../ui/button";
import { AddressData } from "./map-modal";

interface AddressMapProps {
  onAddressSelected?: (addressData: AddressData) => void;
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
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Default center position
  const defaultCenter: [number, number] = [53.5488, 9.9872];

  // Convert coordinates to address (reverse geocoding)
  useEffect(() => {
    const getAddressFromCoordinates = async (): Promise<void> => {
      if (!position) return;

      setIsLoading(true);
      try {
        const [lat, lng] = position;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();

        if (data && data.display_name) {
          setAddress(data.display_name);
          if (onAddressSelected) {
            onAddressSelected({
              fullAddress: data.display_name,
              coordinates: position,
              addressComponents: data.address,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getAddressFromCoordinates();
  }, [position, onAddressSelected]);

  // Handle address search
  const searchAddress = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!searchQuery.trim() || !map) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition: [number, number] = [
          parseFloat(lat),
          parseFloat(lon),
        ];
        setPosition(newPosition);
        // Center map to the found location
        map.flyTo(newPosition, 15);
      }
    } catch (error) {
      console.error("Error searching address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="address-map-container">
      <form onSubmit={searchAddress} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      <div style={{ height: "400px", width: "100%" }}>
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapMarker position={position} setPosition={setPosition} />
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
            <p className="text-sm">{address}</p>
          </>
        )}
      </div>
      <p className="text-sm mt-2">Click on the map to select your address</p>
    </div>
  );
};

export default AddressMap;
