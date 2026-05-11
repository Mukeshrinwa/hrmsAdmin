// types/employee.ts
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface Office {
  _id: string;
  name: string;
  code: string;
  location: Location;
  status: boolean;
  radius: number;
  availabe_shifts: string[];
  default_shift: string;
  settings: {
    working_days: any[];
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Shift {
  _id: string;
  name: string;
  start_time: string;
  end_time: string;
  is_night_shift: boolean;
  description: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Department {
  _id: string;
  department_id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface BankDetails {
  bank_name: string;
  account_number: string;
  ifsc_code: string;
}

export interface WorkExperience {
  skills_in: any[]; // Define proper type if possible
  total_exp: number;
}

export interface Document {
  document_type: string;
  document_url: string;
  _id: string;
}

export interface EmployeeTableData {
  _id: string;
  user_id: string;
  office_id: Office;
  department_id: Department;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  totalLeave: number;
  address: Address;
  position: string;
  role: string;
  is_manager: boolean;
  date_of_joining: string;
  status: string;
  salary: number | null;
  emergency_contact: EmergencyContact;
  documents: Document[];
  bank_details: BankDetails;
  company_email: string;
  shift_id: Shift;
  profile_image: string;
  work_experience: WorkExperience;
  marital_status: string;
  employee_type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}