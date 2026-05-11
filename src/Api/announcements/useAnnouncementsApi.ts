import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

import { toast } from 'src/components/snackbar';

const useAnnouncementsApi = () => {
  const { get, post, put, deleted } = useApi();

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await get(Endpoints.announcements);
      return response;
    } catch (error) {
      toast.error('Error fetching announcements');
      console.error('Error fetching announcements:', error);
      return [];
    }
  }, [get]);

  const addAnnouncement = useCallback(
    async (data: any) => {
      try {
        const response = await post(Endpoints.announcements, data);
        toast.success('Announcement added successfully');
        return response.data;
      } catch (error) {
        toast.error('Error adding announcement');
        console.error('Error adding announcement:', error);
        throw error;
      }
    },
    [post]
  );

  const updateAnnouncement = useCallback(
    async (_id: string, data: any) => {
      try {
        const response = await put(`${Endpoints.announcements}/${_id}`, data);
        toast.success('Announcement updated successfully');
        return response.data;
      } catch (error) {
        toast.error('Error updating announcement');
        console.error('Error updating announcement:', error);
        throw error;
      }
    },
    [put]
  );

  const deleteAnnouncement = useCallback(
    async (id: string) => {
      try {
        await deleted(`${Endpoints.announcements}/${id}`);
        toast.success('Announcement deleted successfully');
      } catch (error) {
        toast.error('Error deleting announcement');
        console.error('Error deleting announcement:', error);
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
    fetchAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    fetchAllEmployees,
  };
};

export default useAnnouncementsApi;
