import type { EditData, ExportData, AddPayrollData, GeneratePayrollData } from 'src/Interface/payrollview.interface';

import { useCallback } from 'react';

import useApi from 'src/server/axios/index';
import { Endpoints } from 'src/server/endpoints_configuration/Endpoints';

import { toast } from 'src/components/snackbar';

const usePayrollApi = () => {
  const { get, put, post, deleted } = useApi();

  // Get Api for employeeData

  const fetchAllEmployees = useCallback(async () => {
    try {
      const response = await get(Endpoints.Allemployee);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Error fetching employees');

      return [];
    }
  }, [get]);

  const getCompanyId = () => sessionStorage.getItem("COMPANY_ID") || localStorage.getItem("COMPANY_ID");

  const fetchAllPayroll = useCallback(async () => {
    try {
      const companyId = getCompanyId();

      if (!companyId) {
        console.error("Company ID not found in storage");
        return [];
      }

      const response = await get(`${Endpoints.payroll}/${companyId}`);
      return response?.data?.company?.locations || [];
    } catch (error) {
      console.error('Error fetching:', error);
      return [];
    }
  }, [get]);



  // Add new Employee Api

  const addPayroll = async (data: AddPayrollData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...payrollData } = data;
      const response = await post(Endpoints.payroll, payrollData);
      return response.data;
    } catch (error) {
      toast.error('Error adding payroll');

      console.error('Error adding payroll:', error);
      throw error;
    }
  };

  // Update Api
  const updatePayroll = async (_id: string, data: EditData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id: idToUpdate, ...payrollData } = data;
      const response = await put(`${Endpoints.payroll}/${_id}`, payrollData);
      return response.data;
      toast.success('Payroll updated successfully');
    } catch (error) {
      toast.error('Error updating payroll');
      console.error('Error updating payroll:', error);
      throw error;
    }
  };

  const deletePayroll = useCallback(async (id: string) => {
    try {
      await deleted(`${Endpoints.payroll}/${id}`);
      toast.success('Payroll deleted successfully');

    } catch (error) {
      toast.error('Error deleting payroll');
      console.error('Error deleting employee:', error);
      throw error;
    }
  }, [deleted]);


  const fetchsalaryShlipByid = useCallback(async (id: string,) => {
    try {
      const response = await get(`${Endpoints.payroll}/employee/${id}`);
      return response.data

    } catch (error) {
      console.error('Error fetching payroll:', error);
      toast.error('Error deleting payroll');
      return null;
    }
  }, [get]);
  const fetchPdfShlipByid = useCallback(async (id: string,) => {
    try {
      const response = await get(`${Endpoints.payroll}/${id}/payslip`);
      return response
    } catch (error) {
      console.error('Error fetching payroll:', error);
      return null;
    }
  }, [get]);

  const generatepayslip = async (data: GeneratePayrollData) => {
    try {
      const response = await post(`${Endpoints.payroll}/payslip/generate`, {
        employee_id: data.employee_id,
        month: data.month,
        year: data.year
      });
      return response.data;
    } catch (error) {
      console.error('Error generating payslip:', error);
      throw error;
    }
  };
  const exportpayslipExport = async (data: ExportData) => {
    try {
      const response = await post(`${Endpoints.payroll}/payslip/export`, {
        month: data.month,
        year: data.year
      });
      return response.data;
    } catch (error) {
      console.error('Error generating payslip:', error);
      throw error;
    }
  };





  return {
    fetchAllPayroll, updatePayroll,
    addPayroll, generatepayslip, exportpayslipExport,
    fetchAllEmployees, deletePayroll,
    fetchsalaryShlipByid, fetchPdfShlipByid
  };
};

export default usePayrollApi;
