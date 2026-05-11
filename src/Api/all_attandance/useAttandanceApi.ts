import type { AttendanceData } from '@/src/Interface/attendanceData.interfce';

import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

const cleanAttendanceData = (data: AttendanceData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, createdAt, updatedAt, __v, ...cleanedData } = data; 
  return cleanedData; 
};

const useAttandanceApi = () => {
  const { get, put, post,deleted } = useApi();

  // Get All Attendance Data


  const fetchattendanceByid = useCallback(async (id: string,) => {
    try {
      const response = await get(`${Endpoints.attendance}/employee/${id}`); 
      return response
    } catch (error) {
      console.error('Error fetching employee:', error);
      return null; 
    }
  }, [get]);

  
  const fetchAllattendance = async () => {
    try {
      const response = await get(Endpoints.attendance);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  };

  // Add New Attendance
  const addAttendance = async (data: AttendanceData) => {
    const cleanedData = cleanAttendanceData(data); 
    try {
      const response = await post(Endpoints.attendance, cleanedData);
      return response.data;
    } catch (error) {
      console.error('Error adding attendance:', error);
      throw error;
    }
  };

  // Update Attendance
  const updateAttendance = async (_id: string, data: AttendanceData) => {
    const cleanedData = cleanAttendanceData(data); 
    try {
      const response = await put(`${Endpoints.attendance}/${_id}`, cleanedData);
      console.log(response, "response from update");
      return response.data; 
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  };
  const deleteAttendance = async (_id: string) => {
    try {
      await deleted(`${Endpoints.attendance}/${_id}`); // Call the delete method
      console.log(`Attendance with ID ${_id} has been deleted.`);
    } catch (error) {
      console.error('Error deleting attendance:', error);
      throw error;
    }
  };

  return { fetchAllattendance, updateAttendance, addAttendance,deleteAttendance,fetchattendanceByid };
};

export default useAttandanceApi;
