import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

const useSettingsApi = () => {
  const { get, put } = useApi();

  const fetchSetting = useCallback(async () => {
    try {
      const response = await get(Endpoints.setting);
      return response;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }, [get]);

  const updateSetting = useCallback(
    async (data: any) => { 
      try {
        const response = await put(Endpoints.setting, data); 
        return response.data;
      } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
      }
    },
    [put]
  );

  return {
    fetchSetting,
    updateSetting,
  };
};

export default useSettingsApi;