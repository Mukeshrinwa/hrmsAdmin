import type { Dayjs } from 'dayjs';

export interface Data {
    name: string;
    start: string;
    end: string;
    autopunchout: string;
  }
 export interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (value: number) => string;
  }
  export interface DesignationModalProps {
    editmodal:boolean;
    open: boolean;
    handleClose: () => void;
    shift: string;
    start: Dayjs | null;
    end: Dayjs | null;
    fullTime: Dayjs | null;
    halfTime: Dayjs | null;
    punch: Dayjs | null;
    graceTime: Dayjs | null;
    setStart: (value: Dayjs | null) => void;
    setEnd: (value: Dayjs | null) => void;
    setShift: (value: string) => void;
    setPunch: (value: Dayjs | null) => void;
    setFullTime: (value: Dayjs | null) => void;
    setHalfTime: (value: Dayjs | null) => void;
    setGraceTime: (value: Dayjs | null) => void;
  }