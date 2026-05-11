
import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

const usePoliciesApi = () => {
  const { get, post, put, deleted } = useApi();

  const fetchPolicies = useCallback(async () => {
    try {
      const response = await get(Endpoints.policies);
      return response.data;
    } catch (error) {
      console.error('Error fetching policies:', error);
      return [];
    }
  }, [get]);

  const addPolicies = useCallback(
    async (Data: any) => {
      try {
        const response = await post(Endpoints.policies, Data);
        return response.data;
      } catch (error) {
        console.error('Error adding policies:', error);
        throw error;
      }
    },
    [post]
  );

  const updatePolicies = useCallback(
    async (_id: string, data: any) => {
      try {
        const response = await put(`${Endpoints.policies}/${_id}`, data);
        return response.data;
      } catch (error) {
        console.error('Error updating policies:', error);
        throw error;
      }
    },
    [put]
  );

  const deletePolicies = useCallback(
    async (id: string) => {
      try {
        await deleted(`${Endpoints.policies}/${id}`);
      } catch (error) {
        console.error('Error deleting policies:', error);
        throw error;
      }
    },
    [deleted]
  );

  const fetchAllDepartment = useCallback(async () => {
    try {
      const response = await get(Endpoints.Department);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  }, [get]);

  return {
    fetchPolicies,
    addPolicies,
    updatePolicies,
    deletePolicies,
    fetchAllDepartment,
  };
};

export default usePoliciesApi;
