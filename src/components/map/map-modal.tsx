"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { Button } from "@/components";

// Define types for the address data
export interface AddressData {
  fullAddress: string;
  coordinates: [number, number];
  addressComponents: {
    road?: string;
    house_number?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    [key: string]: string | undefined;
  };
}

interface AddressMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelected: (addressData: AddressData) => void;
}

// Dynamically import the AddressMap component with no SSR
// This is crucial as Leaflet requires the window object
const AddressMap = dynamic(() => import("./address-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-gray-100">
      Loading map...
    </div>
  ),
});

const AddressMapModal = ({
  isOpen,
  onClose,
  onAddressSelected,
}: AddressMapModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(
    null
  );

  const handleConfirm = () => {
    if (selectedAddress) {
      onAddressSelected(selectedAddress);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Your Delivery Address</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <AddressMap onAddressSelected={setSelectedAddress} />

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedAddress}>
              Confirm Address
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressMapModal;
