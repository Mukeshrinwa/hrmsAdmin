import type { EditData, Department } from 'src/Interface/all_department.interface';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

import { toast } from 'src/components/snackbar';

const useDepartmentsApi = () => {
  const { get, post, put, deleted } = useApi();

  const fetchEmployeeById = async (id: string) => {
    try {
      const response = await get(`${Endpoints.Allemployee}/department/${id}`);
      return response;
    } catch (error) {
      toast.error('Error fetching employee by department ID');
      console.error('Error fetching employee by ID:', error);
      throw error;
    }
  };

  const fetchAllDepartments = async (): Promise<{ data: Department[] }> => {
    try {
      const response = await get(Endpoints.Department);
      return response;
    } catch (error) {
      console.error('Error fetching departments:', error);
      return { data: [] };
    }
  };

  const addDepartments = async (data: Department) => {
    try {
      const response = await post(Endpoints.Department, data);
      toast.success('Department added successfully');
      return response.data;
    } catch (error) {
      toast.error('Error adding department');
      console.error('Error adding department:', error);
      throw error;
    }
  };

  const updateDepartments = async (_id: string, data: EditData) => {
    try {
      const response = await put(`${Endpoints.Department}/${_id}`, data);
      toast.success('Department updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Error updating department');
      console.error('Error updating department:', error);
      throw error;
    }
  };

  const deleteDepartments = async (id: string) => {
    try {
      await deleted(`${Endpoints.Department}/${id}`);
      toast.success('Department deleted successfully');
    } catch (error) {
      toast.error('Error deleting department');
      console.error('Error deleting department:', error);
      throw error;
    }
  };

  return {
    fetchAllDepartments,
    addDepartments,
    updateDepartments,
    deleteDepartments,
    fetchEmployeeById,
  };
};

export default useDepartmentsApi;
