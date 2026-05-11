export interface Column {
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: string | number) => string;
  
}

export interface Data {
  _id: string;
  title: string;
  content: string;
  author:string
  author_id: {
      _id: string;
      employee_id: string;
      first_name: string;
      last_name: string;
  };
  audience: Array<{
      _id: string;
      department_id: string;
      name: string;
  }>;
  createdAt: string;
  updatedAt: string;
  actions?: string;
  
}

