  export interface OfficeData {
    createdAt: any;
    default_shift: string;
    available_shifts: never[];
    code: string;
    _id: string;
    name: string;
    location: {
        latitude: number;
        longitude: number;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postal_code?: string;
    };
    radius: number;
    status: boolean;
}

export interface FormData {
    name: string;
    code: string;
    latitude: string;
    longitude: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    radius: number;
    status: boolean;
    default_shift: string;
    available_shifts: string[];
}
export interface AddLocationModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}