export interface Column {
    id: keyof Data;
    label: string;
    minWidth?: number;
    align?: 'left' | 'right' | 'center';
    format?: (value: string | number) => string;
}
export interface Employee {
    _id: string;
    employee_id: string;
    first_name: string;
    last_name: string;
  }
export interface Data {
    _id: string;
    employee_id: string | Employee | null;
    benefit_type: string;
    provider: string;
    policy_number: string;
    coverage_amount: number;
    start_date: string;
    end_date: string;
    createdAt: string;
    updatedAt: string;
}

