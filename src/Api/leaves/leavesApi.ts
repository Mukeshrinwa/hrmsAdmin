
import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

import { toast } from 'src/components/snackbar';

const useLeavesApi = () => {
  const { get, put } = useApi();

  const fetchEmployeesByid = useCallback(async (employee_id: string) => {
    try {
      const response = await get(`${Endpoints.Allemployee}/${employee_id}`);
      return response.data;
    } catch (error) {
      toast.error('Error fetching employee');
      console.error('Error fetching employee:', error);
      return null;
    }
  }, [get]);

  const fetchLeave = async (status?: string): Promise<any> => {
    try {
      let url = `${Endpoints.leaves}`;
      if (status) {
        url += `?status=${status}`;
      }

      const response = await get(url);
      return response;
    } catch (error) {
      toast.error('Error fetching leave data');
      console.error('Error fetching leaves:', error);
      throw error;
    }
  };

  const rejectLeave = async (id: string, data: any) => {
    try {
      const response = await put(`${Endpoints.leaves}/${id}/reject`, data);
      toast.success('Leave updated successfully');
      return response;
    } catch (error) {
      toast.error('Error updating leave');
      console.error('Error updating leave:', error);
      throw error;
    }
  };
  const approveLeave = async (id: string, data: any) => {
    try {
      const response = await put(`${Endpoints.leaves}/${id}/approve`, data);
      toast.success('Leave updated successfully');
      return response;
    } catch (error) {
      toast.error('Error updating leave');
      console.error('Error updating leave:', error);
      throw error;
    }
  };
  const updateLeave = async (_id: string, updatedData: { status: string; review: string }) => {
    try {
      const response = await put(`${Endpoints.leaves}/${_id}`, updatedData);
      toast.success('Leave status updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Error updating leave');
      console.error('Error updating:', error);
      throw error;
    }
  };

  const fetchLeaveByid = useCallback(async (id: string) => {
    try {
      const response = await get(`${Endpoints.leaves}/employee/${id}`);
      return response;
    } catch (error) {
      toast.error('Error fetching leave by employee ID');
      console.error('Error fetching leaves:', error);
      return null;
    }
  }, [get]);

  return {
    fetchLeave,
    rejectLeave,
    approveLeave,
    fetchEmployeesByid,
    fetchLeaveByid,
    updateLeave
  };
};

export default useLeavesApi;
