import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

const useUpdatePasswordApi = () => {
    const { post, get } = useApi();

    const meApi = useCallback(async () => {
        try {
            const response = await get(Endpoints.me);
            return response;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }, [get]);

    const updatepassword = useCallback(
        async (data: { oldPassword: string; newPassword: string }, userId: string) => {
            try {
                const response = await post(
                    `${Endpoints.password}/${userId}/updatepassword`,
                    data
                );
                return response.data;
            } catch (error) {
                console.error('Error updating password:', error);
                throw error;
            }
        },
        [post]
    );
    return {
        updatepassword,
        meApi
    };
};

export default useUpdatePasswordApi;