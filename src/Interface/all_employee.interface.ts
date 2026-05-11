export interface Document {
  document_type: string;
  document_url: string;
  file?: File;
  preview?: string;

}

export interface EmployeeTableData {
  [x: string]: any;
  employee_id: any;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode:string
  };
  position: string;
  date_of_joining: string;
  status: string;
  // salary: string;
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents: ({
    document_type: string;
    document_url: string;
  } | null)[];
  bank_details: {
    bank_name: string;
    account_number: string;
    ifsc_code: string;
  };

  totalCasualLeave: number,
  totalEarnedLeave: number,
  totalSickLeave: number,

  company_email: string;
  shift_id: any;
  office_id: string;

  profile_image: string;
  work_experience: {
    skills_in: string[];
    total_exp: number;
  };
  reporting_manager_id: any;
  marital_status: string;
  employee_type: string;

}
export interface userId {
  username: string;
  mobile: string;
  password: string;
  roles: string[];
}
export interface AssetIdentifier {
  assetType: string;
  description: string;
  assetIdentifier: string;
  serialNumber: string;
}



export interface AttendanceData {
  _id: string;
  date: string;
  check_in_time: string;
  check_out_time: string;
  working_hours: string;
  status: string;
}




export interface DeleteEmployeeProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}




export interface EemployeeTableColumn {
  id: 'employeeName' | 'employeeID' | 'department' | 'designation' | 'status' | 'action';
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: number) => string;
}

export interface EemployeeTableData {
  employeeName: string;
  avatarUrl: string;
  employeeID: number;
  department: number;
  designation: number;
  status: string;
}

export interface LeaveData {
  key: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
}

export interface SalarySlipData {
  key: string;
  col1: string;
  col3: string;
  col4: string;
  col5: string;
}


export interface Column {
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: string | number) => string;
}

export interface Data {
  employeeName: string;
  avatarUrl: string;
  department: string;
  applyingDate: string;
  duration: string;
  days: number;
  status: string;
}

export interface EditData {

  employee_type: string;
  _id: string;
  first_name: string;
  last_name: string;
  department_id: Department;
  office_id?: {
    _id: string;
    name: string;
  } | string;
  position: string;
  phone: string;
  date_of_joining: string;
  // salary: string;
  email: string;
  reporting_manager_id?: {
    _id: string;
  } | string;
  shift_id?: {
    _id: string;
    name: string;
  } | string;

  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  address?: {
    street?: string;
    city: string;
    state: string;
    country: string;
    postal_code?: string;
  };
  employee_id?: string;
  company_email?: string;
  bank_details?: {
    bank_name: string;
    account_number: string;
    ifsc_code: string;
  };

}
export interface Department {
  id: any;
  _id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  department_id?: string;
  manager_id?: string;
}

