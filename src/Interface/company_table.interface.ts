// src/Interface/Office_table.interface.ts

export interface OfficeData {
    status: any;
    _id: string;
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    };
    coordinates: {
        latitude: number;
        longitude: number;
    };
    geofence: {
        radius: number;
        enabled: boolean;
    };
    timezone: string;
    isHeadOffice: boolean;
    workingHours: {
        startTime: string;
        endTime: string;
        workingDays: string[];
    };
    isActive: boolean;
    breakTimes: any[];
    createdAt?: string;
    updatedAt?: string;
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