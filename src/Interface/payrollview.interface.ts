export interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  minWidth?: number;
}

export interface Employee {
  salary: number;
  _id: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  month?: string;
}

export interface Data {
  _id: string;
  employee_id: {
    _id: string;
    first_name: string;
    last_name: string;
    salary: number;
  };
  month: string;
  bonuses: number;
  net_salary: number;
  basic_salary: number;
  deductions: number;
  hourly_pay: number;
  overtime_pay: number;
  payment_status: string;
  ctcPerYear: number;
}

export interface EditData {
  _id: string;
  employee_id: string;
  month: string;
  bonuses: number;
  net_salary: number;
  basic_salary: number;
  deductions: number;
  hourly_pay: number;
  overtime_pay: number;
  payment_status?: string;
}

export interface AddPayrollData {
  employee_id: string;
  month: string;
  bonuses: number;
  net_salary: number;
  basic_salary: number;
  deductions: number;
  hourly_pay: number;
  overtime_pay: number;
  payment_status: string;
}

export interface GeneratePayrollData {
  employee_id: string[];
  month: string;
  year: string;
}

export interface ExportData {
  month: string;
  year: string;
}