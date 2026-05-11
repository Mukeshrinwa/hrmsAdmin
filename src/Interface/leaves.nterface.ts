import type { Key } from "react-hook-form/dist/types/path/common";

export interface Data {
    totalDays: any;
    appliedAt: string;
    days: any;
    _id: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    approver_id?: string;
    applyingDate?: Date | string;
    review: string;
    employee_id: string | { 
        _id: string; 
        user_id: string; 
        employee_id: string; 
        first_name: string; 
        last_name: string;
        email: string;
    };
    employeeName?: string;
}

export interface Column {
    employee_id?: Key | null | undefined;
    id: string;
    label: string;
    minWidth?: number;
    align?: 'left' | 'right' | 'center';
    format?: (value: any) => string;
}
