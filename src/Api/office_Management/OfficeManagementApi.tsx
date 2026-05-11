import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

import { toast } from 'src/components/snackbar';

const OfficeManagementApi = () => {
  const { get, post, put, deleted } = useApi();

  // Helper function to get company ID
  const getCompanyId = () => sessionStorage.getItem("COMPANY_ID") || localStorage.getItem("COMPANY_ID");

  const fetchofficeManagement = useCallback(async () => {
    try {
      const companyId = getCompanyId();
      if (!companyId) {
        console.error("Company ID not found in storage");
        return [];
      }

      const response = await get(`${Endpoints.officeManagement}/${companyId}`);
      return response?.data?.company?.locations || [];
    } catch (error) {
      console.error('Error fetching:', error);
      return [];
    }
  }, [get]);
  const fetchBranchManagement = useCallback(async () => {
    try {
      const companyId = getCompanyId();
      if (!companyId) {
        console.error("Company ID not found in storage");
        return [];
      }

      const response = await get(`${Endpoints.officeManagement}/${companyId}`);
      return response?.data|| [];
    } catch (error) {
      console.error('Error fetching:', error);
      return [];
    }
  }, [get]);
  const addCompanyLoction = useCallback(
    async (data: any) => {
      try {
        const companyId = getCompanyId();
        if (!companyId) {
          toast.error('Company ID not found');
          throw new Error('Company ID not found');
        }

        const response = await post(`${Endpoints.officeManagement}/${companyId}/locations`, data);
        toast.success('Office data added successfully');
        return response.data;
      } catch (error) {
        toast.error('Error adding office data');
        console.error('Error adding:', error);
        throw error;
      }
    },
    [post]
  );

  const addofficeManagement = useCallback(
    async (data: any) => {
      try {
        const response = await post(Endpoints.officeManagement, data);
        toast.success('Office data added successfully');
        return response.data;
      } catch (error) {
        toast.error('Error adding office data');
        console.error('Error adding:', error);
        throw error;
      }
    },
    [post]
  );

  const updateCompanyManagement = useCallback(
    async (locationId: string, data: any) => {
      try {
        const companyId = getCompanyId();
        if (!companyId) {
          toast.error("Company ID not found");
          throw new Error("Company ID not found");
        }

        const response = await put(
          `${Endpoints.officeManagement}/${companyId}/locations/${locationId}`,
          data
        );

        toast.success("Office data updated successfully");
        return response.data;
      } catch (error) {
        toast.error("Error updating office data");
        console.error("Error updating:", error);
        throw error;
      }
    },
    [put]
  );


  const updateofficeManagement = useCallback(
    async (_id: string, data: any) => {
      try {
        const response = await put(`${Endpoints.officeManagement}/${_id}`, data);
        toast.success('Office data updated successfully');
        return response.data;
      } catch (error) {
        toast.error('Error updating office data');
        console.error('Error updating:', error);
        throw error;
      }
    },
    [put]
  );

  const deleteofficeManagement = useCallback(
    async (id: string) => {
      try {
        await deleted(`${Endpoints.officeManagement}/${id}`);
        toast.success('Office data deleted successfully');
      } catch (error) {
        toast.error('Error deleting office data');
        console.error('Error deleting:', error);
        throw error;
      }
    },
    [deleted]
  );

  return {
    fetchofficeManagement,
    addofficeManagement,
    updateofficeManagement,
    deleteofficeManagement,
    addCompanyLoction,
    updateCompanyManagement,
    fetchBranchManagement
  };
};

export default OfficeManagementApi;