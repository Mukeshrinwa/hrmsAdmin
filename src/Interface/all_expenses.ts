export interface ExpenseData {
  _id: string;
  employeeId: string;
  
  // Added fields (because your code is using them)
  employeeName?: string;
  department?: string;
  branch?: string;
  reimbursed?: boolean;

  expenseType: string;
  category: string;
  amount: number;
  currency: string;
  status: string;
  expenseDate: string;
  expenseId: string;
}

export interface CategorySummary {
  name: string;
  value: number;
}

export interface MonthlyExpense {
  month: string;
  expense: number;
}

export interface EmployeeClaim {
  name: string;
  dept: string;
  branch: string;
  total: number;
  formattedTotal: string;
}
