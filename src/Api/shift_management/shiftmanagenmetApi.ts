import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

const useShiftManagementApi = () => {
  const { get, post, put, deleted } = useApi();

  const fetchofficeShift = useCallback(async () => {
    try {
      const response = await get(Endpoints.officeShift);
      return response?.data || []; 
    } catch (error) {
      console.error('Error fetching shift:', error);
      return [];
    }
  }, [get]);

  const addShift = useCallback(async (data: any) => {
    try {
      const response = await post(Endpoints.officeShift, data);
      return response.data;
    } catch (error) {
      console.error('Error adding shift:', error);
      throw error;
    }
  }, [post]);

  const updateofficeShift = useCallback(async (_id: string, data: any) => {
    try {
      const response = await put(`${Endpoints.officeShift}/${_id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating shift:', error);
      throw error;
    }
  }, [put]);

  const deleteofficeShift = useCallback(async (id: string) => {
    try {
      await deleted(`${Endpoints.officeShift}/${id}`);
    } catch (error) {
      console.error('Error deleting shift:', error);
      throw error;
    }
  }, [deleted]);

  return {
    fetchofficeShift,
    addShift,
    updateofficeShift,
    deleteofficeShift,
  };
};

export default useShiftManagementApi;
