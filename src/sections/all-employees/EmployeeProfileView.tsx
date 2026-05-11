import type { EditData, EmployeeTableData } from 'src/Interface/all_employee.interface';

import { useParams } from 'react-router-dom';
import React, { useEffect, useReducer } from 'react';

import {
  Grid,
  Button,
  MenuItem,
  MenuList,
  Typography,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import usePayrollApi from 'src/Api/all_payroll/usePayrollApi';
import useEmployeeApi from 'src/Api/all_employe/useEmployeeApi';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import Leave from "./Leave";
import LocationView from './Location';
import Attendance from "./Attendance";
import SalarySlip from "./SalarySlip";
import ProfileView from './ProfileView';
import EditEmployeeModal from './EditEmployeeModal';

const items = [
  { key: "sub1", label: "Profile", icon: <Iconify icon="mdi:user" /> },
  { key: "sub2", label: "Attendance", icon: <Iconify icon="hugeicons:task-01" /> },
  { key: "sub3", label: "Salary Slip", icon: <Iconify icon="mingcute:paper-line" /> },
  { key: "sub4", label: "Leave", icon: <Iconify icon="mingcute:task-2-line" /> },
  { key: "sub5", label: "Location", icon: <Iconify icon="ion:location-outline" /> },
];

interface SalaryData {
  basic_salary: number;
  bonuses: number;
  deductions: number;
  net_salary: number;
  ctcPerYear: number;
  payment_status: string;
}

interface EmployeeProfileState {
  employee: EmployeeTableData | null;
  selectedMenu: string;
  modalOpen: boolean;
  selectedEmployee: EditData | null;
  salaryData: SalaryData | null;
}

const initialState: EmployeeProfileState = {
  employee: null,
  selectedMenu: "sub1",
  modalOpen: false,
  selectedEmployee: null,
  salaryData: null,
};

const actionTypes = {
  SET_EMPLOYEE: "SET_EMPLOYEE",
  SET_SELECTED_MENU: "SET_SELECTED_MENU",
  OPEN_MODAL: "OPEN_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL",
  SET_SELECTED_EMPLOYEE: "SET_SELECTED_EMPLOYEE",
  SET_SALARY_DATA: "SET_SALARY_DATA",
};

const reducer = (state: EmployeeProfileState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case actionTypes.SET_EMPLOYEE:
      return { ...state, employee: action.payload };
    case actionTypes.SET_SELECTED_MENU:
      return { ...state, selectedMenu: action.payload };
    case actionTypes.OPEN_MODAL:
      return { ...state, modalOpen: true };
    case actionTypes.CLOSE_MODAL:
      return { ...state, modalOpen: false, selectedEmployee: null };
    case actionTypes.SET_SELECTED_EMPLOYEE:
      return { ...state, selectedEmployee: action.payload, modalOpen: true };
    case actionTypes.SET_SALARY_DATA:
      return { ...state, salaryData: action.payload };
    default:
      return state;
  }
};

const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchEmployeeById, updateEmployee } = useEmployeeApi();
  const { fetchsalaryShlipByid } = usePayrollApi();
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchEmployeeData = async () => {
    if (!id) {
      return;
    }

    try {
      const employeeData = await fetchEmployeeById(id);
      dispatch({ type: actionTypes.SET_EMPLOYEE, payload: employeeData });

      const salaryResponse = await fetchsalaryShlipByid(id);
      if (salaryResponse) {
        dispatch({ type: actionTypes.SET_SALARY_DATA, payload: salaryResponse });
      } else {
        console.log('Salary data not available for this employee');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClick = (key: string) => {
    dispatch({ type: actionTypes.SET_SELECTED_MENU, payload: key });
  };

  const handleEditClick = () => {
    if (state.employee) {
      const editData: EditData = {
        ...state.employee,
        _id: state.employee._id,
        first_name: state.employee.first_name,
        last_name: state.employee.last_name,
        email: state.employee.email,
        phone: state.employee.phone?.toString() || '',
        department_id: state.employee.department_id,
        office_id: state.employee.office_id,
        shift_id: state.employee.shift_id,
        position: state.employee.position?.toString() || '',
        date_of_joining: state.employee.date_of_joining,
        employee_type: state.employee.employee_type,
        date_of_birth: state.employee.date_of_birth,
        gender: state.employee.gender,
        marital_status: state.employee.marital_status,

        emergency_contact: {
          name: state.employee.emergency_contact?.name || '',
          relationship: state.employee.emergency_contact?.relationship || '',
          phone: state.employee.emergency_contact?.phone || ''
        },
        address: {
          street: state.employee.address?.street || '',
          city: state.employee.address?.city || '',
          state: state.employee.address?.state || '',
          country: state.employee.address?.country || '',
          postal_code: state.employee.address?.postal_code || ''
        },
        bank_details: {
          bank_name: state.employee.bank_details?.bank_name || '',
          account_number: state.employee.bank_details?.account_number || '',
          ifsc_code: state.employee.bank_details?.ifsc_code || ''
        },
        reporting_manager_id: state.employee.reporting_manager_id,
      };
      dispatch({ type: actionTypes.SET_SELECTED_EMPLOYEE, payload: editData });
    } else {
      console.log('Employee data not loaded yet');
    }
  };

  const handleSave = async (updatedEmployee: EditData) => {
    if (!state.employee) return;

    try {
      const payload = {
        ...updatedEmployee,
        department_id: typeof updatedEmployee.department_id === 'object'
          ? updatedEmployee.department_id._id
          : updatedEmployee.department_id,
        office_id: typeof updatedEmployee.office_id === 'object'
          ? updatedEmployee.office_id._id
          : updatedEmployee.office_id,
        shift_id: typeof updatedEmployee.shift_id === 'object'
          ? updatedEmployee.shift_id._id
          : updatedEmployee.shift_id,
        reporting_manager_id: updatedEmployee.reporting_manager_id
          ? (typeof updatedEmployee.reporting_manager_id === 'object'
            ? updatedEmployee.reporting_manager_id._id
            : updatedEmployee.reporting_manager_id)
          : state.employee.reporting_manager_id,

        emergency_contact: updatedEmployee.emergency_contact,
        address: updatedEmployee.address,
        bank_details: updatedEmployee.bank_details
      };

      await updateEmployee(state.employee._id, payload);
      fetchEmployeeData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating employee:', error);
    }
    dispatch({ type: actionTypes.CLOSE_MODAL });
  };

  useEffect(() => {
    fetchEmployeeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Employee Profile"
          links={[
            { name: 'All Employee' },
            { name: 'Employee Profile' },
          ]}
        />
        <div
          className="container-fluid"
          style={{
            border: "1px solid #A2A1A833",
            padding: "10px",
            borderRadius: "10px",
            marginTop: '20px',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} style={{ display: "flex", alignItems: "center" }}>
              <img
                src={state.employee?.profile_image || "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"}
                style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
                alt="Employee"
                onError={(e) => {
                  e.currentTarget.src = "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png";
                }}
              />
              <div style={{ marginLeft: "12px" }}>
                <Typography variant="h5">
                  {state.employee ? `${state.employee.first_name} ${state.employee.last_name}` : 'Loading...'}
                </Typography>
                <div style={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
                  <Typography variant="body1">{state.employee?.position || 'Loading...'}</Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
                  <Typography variant="body1">{state.employee?.email || 'Loading...'}</Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditClick}
                disabled={!state.employee}
              >
                Edit Profile
              </Button>
            </Grid>
          </Grid>
          <div className="main_menubar" style={{ display: "flex", marginTop: '25px' }}>
            <div className="menu-profile" style={{ marginRight: "16px" }}>
              <MenuList>
                {items.map((item) => (
                  <MenuItem
                    key={item.key}
                    selected={state.selectedMenu === item.key}
                    onClick={() => handleClick(item.key)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </MenuList>
            </div>
            <div className="right-profile" style={{ flex: 1, marginTop: "-15px" }}>
              {state.selectedMenu === "sub1" && (
                <ProfileView
                  employee={state.employee}
                  salaryData={state.salaryData}
                />
              )}
              {state.selectedMenu === "sub2" && <Attendance />}
              {state.selectedMenu === "sub3" && <SalarySlip />}
              {state.selectedMenu === "sub4" && <Leave />}
              {state.selectedMenu === "sub5" && <LocationView />}
            </div>
          </div>
        </div>
      </DashboardContent>

      <EditEmployeeModal
        open={state.modalOpen}
        onClose={() => dispatch({ type: actionTypes.CLOSE_MODAL })}
        employee={state.selectedEmployee}
        onSave={handleSave}
      />
    </div>
  );
};

export default EmployeeProfile;