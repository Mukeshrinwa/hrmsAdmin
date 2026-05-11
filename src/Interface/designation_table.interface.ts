export interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'left';
    format?: (value: number) => string;
  }
export interface Data {
    id: string;
    name: string;
    designation: string;
  }

  export interface DesignationModalProps {
    editmodal:boolean;
    open: boolean;
    handleClose: () => void;
    setDesignation: (designation: string) => void;
    designation: string;
  }