export interface AddressFormData {
  id?: string | number;
  venueType: string;
  fullAddress: string;
  addressLabel: string;
  streetName?: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
  isDefault: boolean;
}

export interface StatusMessage {
  text: string;
  type: "info" | "error" | "success" | "";
}

export interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (savedAddress?: any) => void;
  initialData?: any | null;
}
