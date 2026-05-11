import type { ReturnAssetData } from 'src/Interface/asset-managementinterfaces';

import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

const AssetsApi = () => {
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



  const GetAssetByID = useCallback(async (assetId: string) => {
    try {
      const response = await get(`${Endpoints.assets}/${assetId}`);
      return response;
    } catch (error) {
      console.error('Error fetching GetAssetByID:', error);
      return [];
    }
  }, [get]);


  const fetchAssetsDataAssigned = async () => {
    try {
      const response = await get(`${Endpoints.assets}?status=ASSIGNED`);

      // API → response.data.data.assets
      return response.data.assets;
    } catch (error) {
      console.error("Error fetching assets:", error);
      return [];
    }
  };

  const fetchAssetsData = async () => {
    try {
      const response = await get(`${Endpoints.assets}`);

      // return only assets array
      return response.data.assets;
    } catch (error) {
      console.error("Error fetching assets:", error);
      return [];
    }
  };


  const addassingAssets = useCallback(
    async (data: any) => {
      try {
        const response = await post(Endpoints.assets, data);
        return response.data;
      } catch (error) {
        console.error('Error adding Assets:', error);
        throw error;
      }
    },
    [post]
  );
  const assingAssets = useCallback(
    async (data: any, _id: string) => {
      try {
        const response = await post(`${Endpoints.assets}/${_id}/assign`, data);
        return response.data;
      } catch (error) {
        console.error('Error adding Assets:', error);
        throw error;
      }
    },
    [post]
  );
  const collectAsset = useCallback(
    async (data: ReturnAssetData, assetId: string) => {
      try {
        const response = await post(`${Endpoints.assets}/${assetId}/return`, data);
        return response;
      } catch (error) {
        console.error('Error adding Assets:', error);
        throw error;
      }
    },
    [post]
  );
  const updateAssets = useCallback(
    async (_id: string, data: any) => {
      try {
        const response = await put(`${Endpoints.assets}/${_id}`, data);
        return response.data;
      } catch (error) {
        console.error('Error updating Assets:', error);
        throw error;
      }
    },
    [put]
  );

  const deleteAssets = useCallback(
    async (assetId: string) => {
      try {
        await deleted(`${Endpoints.assets}/${assetId}`);
      } catch (error) {
        console.error('Error deleting Assets:', error);
        throw error;
      }
    },
    [deleted]
  );

  const fetchMaintenanceData = useCallback(async () => {
    try {
      const response = await get(`${Endpoints.assets}?status=UNDER_REPAIR`);
      // Return the assets array directly
      return response.data.assets || [];
    } catch (error) {
      console.error('Error fetching assets:', error);
      return [];
    }
  }, [get]);

  const fetchMaintenancebystatus = useCallback(async () => {
    try {
      const response = await get(`${Endpoints.assets}?status=AVAILABLE`);
      // Full response return kar raha hun
      return response.data.assets || [];
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  }, [get]);

  const UpdateMaintenance = useCallback(
    async (data: any, _id: string) => {
      try {
        const response = await post(`${Endpoints.assets}/${_id}/assign`, data);
        return response.data;
      } catch (error) {
        console.error('Error adding Assets:', error);
        throw error;
      }
    },
    [post]
  );

  const AddMaintenance = useCallback(
    async (maintenanceData: {
      date: string;
      description: string;
      cost: number;
      performedBy: string;
      nextMaintenanceDate?: string;
    }, assetId: string) => {
      try {
        const response = await post(`${Endpoints.assets}/${assetId}`, maintenanceData);
        return response.data;
      } catch (error) {
        console.error('Error adding maintenance:', error);
        throw error;
      }
    },
    [post]
  );


  return {
    fetchAllEmployees,
    fetchAssetsData,
    addassingAssets,
    updateAssets,
    deleteAssets,
    assingAssets,
    collectAsset,
    fetchMaintenanceData,
    UpdateMaintenance,
    AddMaintenance,
    fetchMaintenancebystatus,
    GetAssetByID,
    fetchAssetsDataAssigned
  };
};

export default AssetsApi;
// eslint-disable-next-line react-hooks/exhaustive-deps  
