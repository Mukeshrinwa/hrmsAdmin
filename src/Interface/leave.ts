export interface Column {
  id: string;
  label: string;
  minWidth: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string | React.ReactNode;
}

export interface Data {
  id: string;
  name: string;
  description: string;
  maxDays: number;
  isPaid: boolean;
  isAccrued: boolean;
  isProrated: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormData {
  type: string;
  days: string;
  effective: {
    all: boolean;
    intern: boolean;
    provision: boolean;
    fulltime: boolean;
  };
}