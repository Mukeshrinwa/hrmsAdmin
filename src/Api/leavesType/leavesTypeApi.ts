import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

import { toast } from 'src/components/snackbar';

interface LeaveTypeData {
  name: string;
  description: string;
  maxDays: number;
  isPaid: boolean;
  isAccrued: boolean;
  isProrated: boolean;
  status: boolean;
}

interface UpdateLeaveTypeData {
  status?: boolean;
  name?: string;
  description?: string;
  maxDays?: number;
  isPaid?: boolean;
  isAccrued?: boolean;
  isProrated?: boolean;
}

const useLeavesTypeApi = () => {
  const { get, put, post, deleted } = useApi();

  // Get all leave types
  const fetchLeaveType = useCallback(async () => {
    try {
      const response = await get(Endpoints.leaveType);
      return response;
    } catch (error) {
      console.error('Error fetching leave types:', error);
      throw error;
    }
  }, [get]);

  // Add new leave type
  const addLeaveType = useCallback(
    async (leaveTypeData: LeaveTypeData) => {
      try {
        const response = await post(Endpoints.leaveType, leaveTypeData);
        toast.success('Leave type added successfully');
        return response.data;
      } catch (error) {
        toast.error('Error adding leave type');
        console.error('Error adding leave type:', error);
        throw error;
      }
    },
    [post]
  );

  // Update leave type
  const updateLeaveType = useCallback(
    async (id: string, updatedData: UpdateLeaveTypeData) => {
      try {
        const response = await put(`${Endpoints.leaveType}/${id}`, updatedData);
        toast.success('Leave type updated successfully');
        return response.data;
      } catch (error) {
        toast.error('Error updating leave type');
        console.error('Error updating leave type:', error);
        throw error;
      }
    },
    [put]
  );

  // Delete leave type
  const deleteLeaveType = useCallback(
    async (id: string) => {
      try {
        await deleted(`${Endpoints.leaveType}/${id}`);
        toast.success('Leave type deleted successfully');
      } catch (error) {
        toast.error('Error deleting leave type');
        console.error('Error deleting leave type:', error);
        throw error;
      }
    },
    [deleted]
  );

  return {
    fetchLeaveType,
    addLeaveType,
    updateLeaveType,
    deleteLeaveType,
  };
};

export default useLeavesTypeApi;
