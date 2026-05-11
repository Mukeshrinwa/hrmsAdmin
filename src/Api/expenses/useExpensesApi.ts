import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

import { toast } from 'src/components/snackbar';

const useExpensesApi = () => {
  const { get, post, put, deleted } = useApi();

  const fetchAllExpenses = async () => {
    try {
      const response = await get(`${Endpoints.ExpensesFatch}/all`);
      return response; // This should return the full API response
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Error fetching expenses');
      throw error;
    }
  };

  const addExpenses = async (data: any) => {
    try {
      const response = await post(Endpoints.ExpensesFatch, data);
      toast.success('Expense added successfully');
      return response.data;
    } catch (error) {
      toast.error('Error adding expense');
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  const updateExpenses = async (_id: string, data: any) => {
    try {
      const response = await put(`${Endpoints.ExpensesFatch}/${_id}`, data);
      toast.success('Expense updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Error updating expense');
      console.error('Error updating expense:', error);
      throw error;
    }
  };

  const deleteExpenses = async (id: string) => {
    try {
      await deleted(`${Endpoints.ExpensesFatch}/${id}`);
      toast.success('Expense deleted successfully');
    } catch (error) {
      toast.error('Error deleting expense');
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  return {
    fetchAllExpenses,
    addExpenses,
    updateExpenses,
    deleteExpenses,
  };
};

export default useExpensesApi;