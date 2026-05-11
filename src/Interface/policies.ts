export interface Column {
    id: keyof Data;
    label: string;
    minWidth?: number;
    align?: 'left' | 'right' | 'center';
    format?: (value: string | number) => string;
}

export interface Data {
    _id: string;
    policy_id: string;
    title: string;
    description: string;
    effective_date: string;
    createdAt: string;
    updatedAt: string;
    
}

