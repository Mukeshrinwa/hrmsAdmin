// useEmployeeApi.ts
import type { userId, EmployeeTableData, } from '@/src/Interface/all_employee.interface';

import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

import { toast } from 'src/components/snackbar';

const useEmployeeApi = () => {
  const { get, post, put, deleted } = useApi();

  const fetchAllEmployees = useCallback(async () => {
    try {
      const response = await get(Endpoints.Allemployee);
      return response;
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  }, [get]);

  const adduserId = useCallback(
    async (data: userId) => {
      try {
        const response = await post(Endpoints.userId, data);
        toast.success('User ID added successfully');
        return response.data;
      } catch (error) {
        toast.error('Error adding user ID');
        console.error('Error adding user ID:', error);
        throw error;
      }
    },
    [post]
  );

  const addEmployee = useCallback(
    async (data: EmployeeTableData) => {
      try {
        const response = await post(Endpoints.Allemployee, data);
        toast.success('Employee added successfully');
        return response.data;
      } catch (error) {
        toast.error('Error adding employee');
        console.error('Error adding employee:', error);
        throw error;
      }
    },
    [post]
  );

  const updateEmployee = useCallback(
    async (_id: string, data: any) => {
      try {
        const response = await put(`${Endpoints.Allemployee}/${_id}`, data);
        toast.success('Employee updated successfully');
        return response;
      } catch (error) {
        toast.error('Error updating employee');
        console.error('Error updating employee:', error);
        throw error;
      }
    },
    [put]
  );

  const deleteEmployee = useCallback(
    async (id: string) => {
      try {
        await deleted(`${Endpoints.Allemployee}/${id}`);
        toast.success('Employee deleted successfully');
      } catch (error) {
        toast.error('Error deleting employee');
        console.error('Error deleting employee:', error);
        throw error;
      }
    },
    [deleted]
  );

  const fetchEmployeeById = async (id: string) => {
    try {
      const response = await get(`${Endpoints.Allemployee}/${id}/employee`);
      return response.data;
    } catch (error) {
      toast.error('Error fetching employee by ID');
      console.error('Error fetching employee by ID:', error);
      throw error;
    }
  };

  return {
    fetchAllEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    fetchEmployeeById,
    adduserId,
  };
};


export default useEmployeeApi;
