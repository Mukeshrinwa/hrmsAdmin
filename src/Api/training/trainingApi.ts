import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

const useTrainingApi = () => {
  const { get, post, put, deleted } = useApi();

  const fetchTraining = useCallback(async () => {
    try {
      const response = await get(Endpoints.training);
      return response.data.trainings; 
    } catch (error) {
      console.error('Error fetching training:', error);
      return [];
    }
  }, [get]);


  const addTraining = useCallback(
    async (data: any) => {
      try {
        const response = await post(Endpoints.training, data);
        return response.data;
      } catch (error) {
        console.error('Error adding training:', error);
        throw error;
      }
    },
    [post]
  );

  const updateTraining = useCallback(
    async (_id: string, data: any) => {
      try {
        const response = await put(`${Endpoints.training}/${_id}`, data);
        return response.data;
      } catch (error) {
        console.error('Error updating training:', error);
        throw error;
      }
    },
    [put]
  );

  const deleteTraining = useCallback(
    async (id: string) => {
      try {
        await deleted(`${Endpoints.training}/${id}`);
      } catch (error) {
        console.error('Error deleting training:', error);
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
      console.error('Error fetching employees:', error);
      return [];
    }
  }, [get]);

  return {
    fetchTraining,
    addTraining,
    updateTraining,
    deleteTraining,
    fetchAllEmployees,
  };
};

export default useTrainingApi;
