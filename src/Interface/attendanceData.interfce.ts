export interface Employee {
    _id: string;
    first_name: string;
    last_name: string;
  }
  
  export interface AttendanceData {
    employeeName: string;
    _id: string;
    employee_id: Employee     
    date: string;            
    check_in_time: string;    
    check_out_time: string;  
    status: string;          
    notes: string;           
    createdAt: string;      
    updatedAt: string;       
    __v: number;            
  }