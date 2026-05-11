interface Trainer {
  _id: string;
  first_name: string;
  last_name: string;
}

interface Participant {
  user_id: string;
  first_name: string;
  last_name: string;
}

export interface Data {
  _id: string;
  program_id: string;
  name: string;
  description: string;
  trainer_id: Trainer | null;
  start_date: string;
  end_date: string;
  participants: Participant[];
  [key: string]: any;
}

export interface Column {
  id: keyof Data ;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: string | number) => string;
}
