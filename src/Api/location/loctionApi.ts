import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

const LoctionApi = () => {
  const { get } = useApi();

  const loctionfetch = async (id: string, headers = {}) => {
    try {
      const response = await get(`${Endpoints.loction}/${id}/employee`, {
        headers: {
          ...headers,
        },
      });
      console.log('Location response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  };
  const AllloctionfetchEmployee = async (id: string, headers = {}) => {
    try {
      const response = await get(`${Endpoints.AllEmployeeloctionFatch}/${id}/all`, {
        headers: {
          ...headers,
        },
      });
      console.log('Location response:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  };
  return { loctionfetch,AllloctionfetchEmployee };
};

export default LoctionApi;
