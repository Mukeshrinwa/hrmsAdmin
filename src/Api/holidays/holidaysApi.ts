import type { Data } from '@/src/Interface/holidays.interface';

import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

import { toast } from 'src/components/snackbar';

const useHolidaysApi = () => {
  const { get, post, put, deleted } = useApi();

  const fetchHolidays = useCallback(async () => {
    try {
      const response = await get(Endpoints.benefits);
      return response.data;
    } catch (error) {
      toast.error('Error fetching holidays');
      console.error('Error fetching holidays:', error);
      return [];
    }
  }, [get]);

  const addHolidays = useCallback(
    async (data: Omit<Data, '_id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const response = await post(Endpoints.benefits, data);
        toast.success('Holiday added successfully');
        return response.data;
      } catch (error) {
        toast.error('Error adding holiday');
        console.error('Error adding holidays:', error);
        throw error;
      }
    },
    [post]
  );

  const updateHolidays = useCallback(
    async (_id: string, data: any) => {
      try {
        const response = await put(`${Endpoints.benefits}/${_id}`, data);
        toast.success('Holiday updated successfully');
        return response.data;
      } catch (error) {
        toast.error('Error updating holiday');
        console.error('Error updating holidays:', error);
        throw error;
      }
    },
    [put]
  );

  const deleteHolidays = useCallback(
    async (id: string) => {
      try {
        await deleted(`${Endpoints.benefits}/${id}`);
        toast.success('Holiday deleted successfully');
      } catch (error) {
        toast.error('Error deleting holiday');
        console.error('Error deleting holidays:', error);
        throw error;
      }
    },
    [deleted]
  );

  const fetchAllEmployees = useCallback(async () => {
    try {
      const response = await get(Endpoints.Allemployee);
      return response.data;
    } catch (error) {
      toast.error('Error fetching employees');
      console.error('Error fetching employees:', error);
      return [];
    }
  }, [get]);

  return {
    fetchHolidays,
    addHolidays,
    updateHolidays,
    deleteHolidays,
    fetchAllEmployees,
  };
};

export default useHolidaysApi;
