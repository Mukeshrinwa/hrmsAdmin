
export interface Asset {
  modelNumber: string;
  assetName: string;
  assetType: string;
  assetCode: string;
  maintenanceHistory: any;
  assignmentDate: string;
  _id: string;
  name: string;
  serialNumber: string;
  category: string;
  status:'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'RETIRED';
  condition: string;
  assignedTo: {
    first_name: string;
    last_name: string;
    employee_id: string;
    _id: string;
  } | null;
  notes: string;
  purchaseDate: string;
  warrantyExpiry: string;
}

export interface Employee {
  id: string;
  _id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  email?: string;
  department?: string;
}

export interface AssignmentForm {
  assignedTo: string;
  assignmentDate: string;
  expectedReturnDate: string;
  notes: string;
}

export interface AddForm {
  name: string;
  category: string;
  assetType: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  status: string;
  purchasePrice: number;
  currentValue: number;
  condition: string;
  location: string;
  notes: string;
  branchId: string;
  departmentId: string;
}

export interface ReturnAssetData {
  actualReturnDate: string;
  returnCondition: string;
  notes: string;

}
export interface MaintenanceHistory{
    description: string;
    date:any
    cost:string;
    nextMaintenanceDate:any
    performedBy: string;

}

