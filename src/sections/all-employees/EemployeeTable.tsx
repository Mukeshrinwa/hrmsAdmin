import type { EditData, EmployeeTableData } from 'src/Interface/all_employee.interface';

import { Link } from 'react-router-dom';
import React, { useEffect, useReducer, useCallback } from 'react';

import {
  Grid,
  Stack,
  Table,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  FormControl,
  TableContainer,
  InputAdornment,
  TablePagination,
} from '@mui/material';

import useEmployeeApi from 'src/Api/all_employe/useEmployeeApi';

import { Iconify } from 'src/components/iconify';

import AddNewEmployee from './AddNewEmployee';
import EditEmployeeModal from './EditEmployeeModal';
import DeleteEmployeeModal from './DeleteEmployeeModal';

const columns = [
  { id: 'first_name', label: 'First Name', minWidth: 120 },
  { id: 'last_name', label: 'Last Name', minWidth: 120 },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'department_name', label: 'Department' },
  { id: 'position', label: 'Position' },
  { id: 'date_of_joining', label: 'Date of Joining', minWidth: 150 },
  { id: 'shift_name', label: 'Shift' },
  { id: 'employee_type', label: 'Status' },
  { id: 'action', label: 'Action' },
];

interface State {
  page: number;
  rowsPerPage: number;
  searchValue: string;
  employees: EmployeeTableData[];
  selectedEmployee: EditData | null;
  modalOpen: boolean;
  deleteModalOpen: boolean;
  employeeToDelete: string | null;
  openAddModal: boolean;
}

interface Action {
  type: string;
  payload?: any;
}

const actionTypes = {
  SET_EMPLOYEES: 'SET_EMPLOYEES',
  SET_PAGE: 'SET_PAGE',
  SET_ROWS_PER_PAGE: 'SET_ROWS_PER_PAGE',
  SET_SEARCH_VALUE: 'SET_SEARCH_VALUE',
  SET_SELECTED_EMPLOYEE: 'SET_SELECTED_EMPLOYEE',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  OPEN_DELETE_MODAL: 'OPEN_DELETE_MODAL',
  CLOSE_DELETE_MODAL: 'CLOSE_DELETE_MODAL',
  SET_EMPLOYEE_TO_DELETE: 'SET_EMPLOYEE_TO_DELETE',
  OPEN_ADD_MODAL: 'OPEN_ADD_MODAL',
  CLOSE_ADD_MODAL: 'CLOSE_ADD_MODAL',
};

const initialState: State = {
  page: 0,
  rowsPerPage: 10,
  searchValue: '',
  employees: [],
  selectedEmployee: null,
  modalOpen: false,
  deleteModalOpen: false,
  employeeToDelete: null,
  openAddModal: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.SET_EMPLOYEES:
      return { ...state, employees: action.payload };
    case actionTypes.SET_PAGE:
      return { ...state, page: action.payload };
    case actionTypes.SET_ROWS_PER_PAGE:
      return { ...state, rowsPerPage: action.payload };
    case actionTypes.SET_SEARCH_VALUE:
      return { ...state, searchValue: action.payload };
    case actionTypes.SET_SELECTED_EMPLOYEE:
      return { ...state, selectedEmployee: action.payload, modalOpen: true };
    case actionTypes.OPEN_MODAL:
      return { ...state, modalOpen: true };
    case actionTypes.CLOSE_MODAL:
      return { ...state, modalOpen: false, selectedEmployee: null };
    case actionTypes.OPEN_DELETE_MODAL:
      return { ...state, deleteModalOpen: true, employeeToDelete: action.payload };
    case actionTypes.CLOSE_DELETE_MODAL:
      return { ...state, deleteModalOpen: false, employeeToDelete: null };
    case actionTypes.OPEN_ADD_MODAL:
      return { ...state, openAddModal: true };
    case actionTypes.CLOSE_ADD_MODAL:
      return { ...state, openAddModal: false };
    default:
      return state;
  }
};

const EmployeeTable: React.FC = () => {
  const { fetchAllEmployees, updateEmployee, deleteEmployee } = useEmployeeApi();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    page,
    rowsPerPage,
    searchValue,
    employees,
    selectedEmployee,
    modalOpen,
    deleteModalOpen,
    employeeToDelete,
    openAddModal,
  } = state;

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    dispatch({ type: actionTypes.SET_PAGE, payload: newPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: actionTypes.SET_ROWS_PER_PAGE, payload: +event.target.value });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: actionTypes.SET_SEARCH_VALUE, payload: event.target.value });
  };

  const handleOpenAddModal = () => dispatch({ type: actionTypes.OPEN_ADD_MODAL });
  const handleCloseAddModal = () => dispatch({ type: actionTypes.CLOSE_ADD_MODAL });

  const handleEditClick = (employee: EmployeeTableData) => {
    const editData: EditData = {
      ...employee,
      _id: employee._id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone?.toString() || '',
      department_id: employee.department_id,
      office_id: employee.office_id,
      shift_id: employee.shift_id,
      position: employee.position?.toString() || '',
      date_of_joining: employee.date_of_joining,
      employee_type: employee.employee_type,
    };
    dispatch({ type: actionTypes.SET_SELECTED_EMPLOYEE, payload: editData });
  };

  const handleDeleteClick = (id: string) => {
    dispatch({ type: actionTypes.OPEN_DELETE_MODAL, payload: id });
  };

  const handleSave = async (updatedEmployee: EditData) => {
    try {
      if (selectedEmployee) {
        const payload = {
          ...updatedEmployee,
          department_id: typeof updatedEmployee.department_id === 'object'
            ? updatedEmployee.department_id._id
            : updatedEmployee.department_id,
          office_id: typeof updatedEmployee.office_id === 'object'
            ? updatedEmployee.office_id._id
            : updatedEmployee.office_id || '',
          reporting_manager_id: updatedEmployee.reporting_manager_id
            ? (typeof updatedEmployee.reporting_manager_id === 'object'
              ? updatedEmployee.reporting_manager_id._id
              : updatedEmployee.reporting_manager_id)
            : selectedEmployee.reporting_manager_id,
        };
        await updateEmployee(selectedEmployee._id, payload);
        loadEmployees();
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
    dispatch({ type: actionTypes.CLOSE_MODAL });
  };

  const handleDelete = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployee(employeeToDelete);
        loadEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
      dispatch({ type: actionTypes.CLOSE_DELETE_MODAL });
    }
  };

  const loadEmployees = useCallback(async () => {
    try {
      const response = await fetchAllEmployees();

      console.log("API RESPONSE ", response);

      // Check exact structure
      if (response && Array.isArray(response.data)) {

        const mapped = response.data.map((emp: any) => ({
          _id: emp.id,
          first_name: emp.firstName,
          last_name: emp.lastName,
          email: emp.email,
          phone: emp.phone,
          date_of_joining: emp.joinDate,
          employee_type: emp.employeeType,
          department_id: { name: emp.departmentId },
          shift_id: { name: emp.shiftId || "-" },
          position: emp.position || "-",
        }));

        dispatch({ type: actionTypes.SET_EMPLOYEES, payload: mapped });

      } else {
        console.error(" response.data is not an array");
      }
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  }, [fetchAllEmployees]);


  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper sx={{ p: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <FormControl fullWidth>
            <TextField
              placeholder="Search..."
              value={searchValue}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={8} container justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: 20 }}
            startIcon={<Iconify icon="gridicons:add-outline" />}
            onClick={handleOpenAddModal}
          >
            Add New Employee
          </Button>
        </Grid>
      </Grid>

      <TableContainer sx={{ marginTop: '16px' }}>
        <Table stickyHeader aria-label="employee table">
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.id} style={{ minWidth: col.minWidth }}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees
              .filter((emp) =>
                emp.first_name.toLowerCase().includes(searchValue.toLowerCase())
              )
              .sort((a, b) => {
                const aDate = a.date_of_joining ? new Date(a.date_of_joining).getTime() : 0;
                const bDate = b.date_of_joining ? new Date(b.date_of_joining).getTime() : 0;
                return bDate - aDate; // ↓ Most recent first
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row._id} hover>
                  {columns.map((col) => {
                    const value = row[col.id as keyof EmployeeTableData];
                    return (
                      <TableCell key={col.id}>
                        {col.id === 'action' ? (
                          <Stack direction="row" spacing={1}>
                            <Link to={`/employee-profile/${row._id}`}>
                              <IconButton><Iconify icon="raphael:view" /></IconButton>
                            </Link>
                            <IconButton onClick={() => handleEditClick(row)}>
                              <Iconify icon="eva:edit-2-outline" />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteClick(row._id)}>
                              <Iconify icon="weui:delete-outlined" />
                            </IconButton>
                          </Stack>
                        ) : col.id === 'department_name' ? (
                          row.department_id?.name || '-'
                        ) : col.id === 'shift_name' ? (
                          row.shift_id?.name || '-'
                        ) : (
                          typeof value === 'object' ? JSON.stringify(value) : value || '-'
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={employees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ marginTop: 2 }}
      />

      <AddNewEmployee open={openAddModal} onClose={handleCloseAddModal} onAdd={loadEmployees} />
      <EditEmployeeModal
        open={modalOpen}
        onClose={() => dispatch({ type: actionTypes.CLOSE_MODAL })}
        employee={selectedEmployee}
        onSave={handleSave}
      />
      <DeleteEmployeeModal
        open={deleteModalOpen}
        onClose={() => dispatch({ type: actionTypes.CLOSE_DELETE_MODAL })}
        onDelete={handleDelete}
      />
    </Paper>
  );
};

export default EmployeeTable;
