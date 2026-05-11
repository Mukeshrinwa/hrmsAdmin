import type { Dayjs } from 'dayjs';
import type { MouseEvent, ChangeEvent } from 'react';
import type { Data, Column, EditData, Employee } from 'src/Interface/payrollview.interface';

import dayjs from 'dayjs';
import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import usePayrollApi from 'src/Api/all_payroll/usePayrollApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import DeletePayroll from './DeletePayroll';

const columns: Column[] = [
  { id: 'employee_name', label: 'Employee Name', align: 'center' },
  { id: 'ctc', label: 'CTC', align: 'center' },
  { id: 'bonuses', label: 'Bonuses', align: 'center' },
  { id: 'net_salary', label: 'Net Salary', align: 'center' },
  { id: 'basic_salary', label: 'Basic Salary', align: 'center' },
  { id: 'hourly_pay', label: 'Hourly Pay', align: 'center' },
  { id: 'overtime_pay', label: 'Overtime Pay', align: 'center' },
  { id: 'deductions', label: 'Deductions', align: 'center' },
  { id: 'action', label: 'Action', align: 'center' },
];

const initialState = {
  rows: [] as Data[],
  page: 0,
  rowsPerPage: 10,
  open: false,
  addOpen: false,
  generateOpen: false,
  searchValue: '',
  editData: null as EditData | null,
  newPayrollData: {
    _id: '',
    employee_id: '',
    month: '',
    bonuses: 0,
    net_salary: 0,
    basic_salary: 0,
    deductions: 0,
    hourly_pay: 0,
    overtime_pay: 0,
  } as EditData,
  generateData: {
    employee_id: [] as string[],
    month: '',
    year: ''
  },
  confirmDeleteOpen: false,
  deleteEmployeeId: null as string | null,
  employees: [] as Employee[],
  selectedEmployee: null,
};

type Action =
  | { type: 'SET_ROWS'; payload: Data[] }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_ROWS_PER_PAGE'; payload: number }
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_EMPLOYEES'; payload: Employee[] }
  | { type: 'SET_ADD_OPEN'; payload: boolean }
  | { type: 'SET_GENERATE_OPEN'; payload: boolean }
  | { type: 'SET_SEARCH_VALUE'; payload: string }
  | { type: 'SET_EDIT_DATA'; payload: EditData | null }
  | { type: 'SET_FORM_DATA'; payload: Partial<EditData> }
  | { type: 'SET_GENERATE_FORM_DATA'; payload: Partial<typeof initialState.generateData> }
  | { type: 'SET_CONFIRM_DELETE_OPEN'; payload: boolean }
  | { type: 'SET_DELETE_EMPLOYEE_ID'; payload: string | null };

const reducer = (state: typeof initialState, action: Action): typeof initialState => {
  switch (action.type) {
    case 'SET_ROWS':
      return { ...state, rows: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_ROWS_PER_PAGE':
      return { ...state, rowsPerPage: action.payload, page: 0 };
    case 'SET_OPEN':
      return { ...state, open: action.payload };
    case 'SET_ADD_OPEN':
      return { ...state, addOpen: action.payload };
    case 'SET_GENERATE_OPEN':
      return { ...state, generateOpen: action.payload };
    case 'SET_SEARCH_VALUE':
      return { ...state, searchValue: action.payload };
    case 'SET_EDIT_DATA':
      return { ...state, editData: action.payload };
    case 'SET_FORM_DATA':
      return { ...state, newPayrollData: { ...state.newPayrollData, ...action.payload } };
    case 'SET_GENERATE_FORM_DATA':
      return { ...state, generateData: { ...state.generateData, ...action.payload } };
    case 'SET_CONFIRM_DELETE_OPEN':
      return { ...state, confirmDeleteOpen: action.payload };
    case 'SET_DELETE_EMPLOYEE_ID':
      return { ...state, deleteEmployeeId: action.payload };
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload };
    default:
      return state;
  }
};

const PayrollviewTable = () => {
  const { fetchAllPayroll, updatePayroll, addPayroll, deletePayroll, fetchAllEmployees, generatepayslip, exportpayslipExport } = usePayrollApi();
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleOpen = (rowData: Data) => {
    const editData: EditData = {
      _id: rowData._id,
      employee_id: rowData.employee_id._id,
      month: rowData.month,
      bonuses: rowData.bonuses,
      net_salary: rowData.net_salary,
      basic_salary: rowData.basic_salary,
      deductions: rowData.deductions,
      hourly_pay: rowData.hourly_pay,
      overtime_pay: rowData.overtime_pay,
      payment_status: rowData.payment_status,
    };
    dispatch({ type: 'SET_EDIT_DATA', payload: editData });
    dispatch({ type: 'SET_OPEN', payload: true });
  };

  const handleAddOpen = () => {
    dispatch({ type: 'SET_OPEN', payload: false });
    dispatch({ type: 'SET_EDIT_DATA', payload: null });
    dispatch({ type: 'SET_FORM_DATA', payload: initialState.newPayrollData });
    dispatch({ type: 'SET_ADD_OPEN', payload: true });
  };

  const handleGenerateOpen = () => {
    dispatch({ type: 'SET_GENERATE_OPEN', payload: true });
  };

  const handleClose = () => {
    dispatch({ type: 'SET_OPEN', payload: false });
  };

  const handleCloseAdd = () => {
    dispatch({ type: 'SET_ADD_OPEN', payload: false });
  };

  const handleCloseGenerate = () => {
    dispatch({ type: 'SET_GENERATE_OPEN', payload: false });
  };

  const handleChangePage = (_event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_ROWS_PER_PAGE', payload: +event.target.value });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const updatedValue = ['bonuses', 'net_salary', 'basic_salary', 'deductions', 'hourly_pay', 'overtime_pay'].includes(id)
      ? Number(value)
      : value;

    if (state.editData) {
      dispatch({ type: 'SET_EDIT_DATA', payload: { ...state.editData, [id]: updatedValue } });
    } else {
      dispatch({ type: 'SET_FORM_DATA', payload: { ...state.newPayrollData, [id]: updatedValue } });
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { employee_id, month, bonuses, net_salary, basic_salary, deductions, hourly_pay, overtime_pay } = state.newPayrollData;

    const newPayrollData = {
      employee_id,
      month,
      bonuses,
      net_salary,
      basic_salary,
      deductions,
      hourly_pay,
      overtime_pay,
      payment_status: 'Pending',
    };

    try {
      await addPayroll(newPayrollData);
      loadPayrollData();
      toast.success('Payroll added successfully!');
    } catch (error) {
      toast.error('Failed to add payroll!');
      console.error("Error adding payroll:", error);
    } finally {
      handleCloseAdd();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!state.editData) return;

    try {
      await updatePayroll(state.editData._id, state.editData);
      loadPayrollData();
      toast.success('Payroll updated successfully!');
    } catch (error) {
      console.error("Error updating payroll:", error);
      toast.error('Failed to update payroll!');
    } finally {
      handleClose();
    }
  };

  const handleGenerateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await generatepayslip({
        employee_id: state.generateData.employee_id,
        month: state.generateData.month,
        year: state.generateData.year
      });
      handleCloseGenerate();
      toast.success('Payroll slip generated successfully!');
    } catch (error) {
      console.error('Error generating payslip:', error);
      toast.error('Failed to generate payroll slip!');
    }
  };

  const handleExportAll = async () => {
    try {
      if (!state.generateData.month || !state.generateData.year) {
        alert('Please select a month and year first');
        return;
      }

      await exportpayslipExport({
        month: state.generateData.month,
        year: state.generateData.year
      });
      toast.success('Export completed successfully!');
    } catch (error) {
      toast.error('Error exporting payroll');
    }
  };

  const handleMonthChange = (newValue: Dayjs | null) => {
    const month = newValue ? newValue.format('YYYY-MM') : '';
    if (state.editData) {
      dispatch({ type: 'SET_EDIT_DATA', payload: { ...state.editData, month } });
    } else {
      dispatch({ type: 'SET_FORM_DATA', payload: { ...state.newPayrollData, month } });
    }
  };

  const handleConfirmDelete = (id: string) => {
    dispatch({ type: 'SET_DELETE_EMPLOYEE_ID', payload: id });
    dispatch({ type: 'SET_CONFIRM_DELETE_OPEN', payload: true });
  };

  const handleDeletePayroll = async () => {
    if (state.deleteEmployeeId) {
      try {
        await deletePayroll(state.deleteEmployeeId);
        loadPayrollData();
      } catch (error) {
        toast.error('Failed to delete payroll!');
      } finally {
        dispatch({ type: 'SET_CONFIRM_DELETE_OPEN', payload: false });
        dispatch({ type: 'SET_DELETE_EMPLOYEE_ID', payload: null });
      }
    }
  };

  const loadPayrollData = async () => {
    try {
      const allPayroll = await fetchAllPayroll();
      dispatch({ type: 'SET_ROWS', payload: allPayroll });
    } catch (error) {
      console.error("Error loading payroll data:", error);
    }
  };

  const handleEmployeeSelect = (_event: any, newValue: Employee | null) => {
    if (newValue) {
      dispatch({
        type: 'SET_FORM_DATA',
        payload: {
          ...state.newPayrollData,
          employee_id: newValue._id,
          net_salary: newValue.salary,
          basic_salary: Math.round(newValue.salary * 0.4), // Typically basic is 40% of salary
          hourly_pay: Math.round((newValue.salary / 30) / 8), // Assuming 8 hours/day and 30 days/month
          overtime_pay: Math.round(((newValue.salary / 30) / 8) * 1.5) // Typically 1.5x hourly pay
        }
      });
    }
  };

  const handleGenerateEmployeeSelect = (_event: any, newValue: Employee[] | null) => {
    if (newValue) {
      dispatch({
        type: 'SET_GENERATE_FORM_DATA',
        payload: {
          employee_id: newValue.map(emp => emp._id)
        }
      });
    }
  };

  React.useEffect(() => {
    loadPayrollData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const getEmployees = async () => {
      try {
        const data = await fetchAllEmployees();
        dispatch({ type: 'SET_EMPLOYEES', payload: data });
        dispatch({
          type: 'SET_GENERATE_FORM_DATA',
          payload: {
            employee_id: data.map((emp: { _id: any; }) => emp._id)
          }
        });
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    getEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper component="div" sx={{ p: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <FormControl fullWidth>
            <TextField
              placeholder="Search..."
              value={state.searchValue}
              onChange={(e) => dispatch({ type: 'SET_SEARCH_VALUE', payload: e.target.value })}
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
        <Grid item xs={8} container justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="primary" onClick={handleAddOpen} startIcon={<Iconify icon="gridicons:add-outline" />}>
            Add Payroll
          </Button>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={['month', 'year']}
              label="Month and Year"
              value={state.generateData.month && state.generateData.year
                ? dayjs(`${state.generateData.month}-${state.generateData.year}`, 'MM-YYYY')
                : null}
              onChange={(newValue) => {
                if (newValue) {
                  dispatch({
                    type: 'SET_GENERATE_FORM_DATA',
                    payload: {
                      month: newValue.format('MM'),
                      year: newValue.format('YYYY')
                    }
                  });
                }
              }}
              format="MM/YYYY"
            />
          </LocalizationProvider>

          <Button variant="contained" color="primary" startIcon={<Iconify icon="raphael:export" />} onClick={handleExportAll}>
            Export All
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="material-symbols:note-stack-add-outline-sharp" />}
            onClick={handleGenerateOpen}
          >
            Generate
          </Button>
        </Grid>
      </Grid>

      <TableContainer sx={{ marginTop: '16px' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {state.rows
              .filter((row) =>
                `${row.employee_id.first_name} ${row.employee_id.last_name}`
                  .toLowerCase()
                  .includes(state.searchValue.toLowerCase())
              )
              .slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage)
              .map((row) => (
                <TableRow key={row._id}>
                  <TableCell align="center">
                    {row.employee_id.first_name} {row.employee_id.last_name}
                  </TableCell>
                  <TableCell align="center">{row.ctcPerYear}</TableCell>
                  <TableCell align="center">{row.bonuses}</TableCell>
                  <TableCell align="center">{row.net_salary}</TableCell>
                  <TableCell align="center">{row.basic_salary}</TableCell>
                  <TableCell align="center">{row.hourly_pay}</TableCell>
                  <TableCell align="center">{row.overtime_pay}</TableCell>
                  <TableCell align="center">{row.deductions}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpen(row)}>
                      <Iconify icon="eva:edit-2-outline" />
                    </IconButton>
                    <IconButton onClick={() => handleConfirmDelete(row._id)}>
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={state.rows.length}
        rowsPerPage={state.rowsPerPage}
        page={state.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit modal */}
      <Modal open={state.open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <Paper sx={{
            p: 4,
            width: 400,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24
          }}>
            <Stack spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Month"
                  value={state.editData?.month ? dayjs(state.editData.month) : null}
                  onChange={handleMonthChange}
                />
              </LocalizationProvider>
              <TextField
                id="bonuses"
                label="Bonuses"
                type="number"
                value={state.editData?.bonuses || ''}
                onChange={handleInputChange}
              />
              <TextField
                id="net_salary"
                label="Net Salary"
                type="number"
                value={state.editData?.net_salary || ''}
                onChange={handleInputChange}
              />
              <TextField
                id="basic_salary"
                label="Basic Salary"
                type="number"
                value={state.editData?.basic_salary || ''}
                onChange={handleInputChange}
              />
              <TextField
                id="hourly_pay"
                label="Hourly Pay"
                type="number"
                value={state.editData?.hourly_pay || ''}
                onChange={handleInputChange}
              />
              <TextField
                id="overtime_pay"
                label="Overtime Pay"
                type="number"
                value={state.editData?.overtime_pay || ''}
                onChange={handleInputChange}
              />
              <TextField
                id="deductions"
                label="Deductions"
                type="number"
                value={state.editData?.deductions || ''}
                onChange={handleInputChange}
              />
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
            </Stack>
          </Paper>
        </form>
      </Modal>

      {/* Add modal */}
      <Modal open={state.addOpen} onClose={handleCloseAdd}>
        <form onSubmit={handleAddSubmit}>
          <Paper sx={{
            p: 4,
            width: 400,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24
          }}>
            <Stack spacing={2}>
              <Autocomplete
                options={state.employees}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                onChange={handleEmployeeSelect}
                renderInput={(params) => (
                  <TextField {...params} label="Select Employee" variant="outlined" required />
                )}
              />
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Month"
                  value={state.newPayrollData.month ? dayjs(state.newPayrollData.month) : null}
                  onChange={handleMonthChange}
                />
              </LocalizationProvider> */}
              <TextField
                id="hourly_pay"
                label="Hourly Pay"
                type="number"
                value={state.newPayrollData.hourly_pay || ''}
                onChange={handleInputChange}
                required
              />
              <TextField
                id="overtime_pay"
                label="Overtime Pay"
                type="number"
                value={state.newPayrollData.overtime_pay || ''}
                onChange={handleInputChange}
                required
              />
              <TextField
                id="bonuses"
                label="Bonuses"
                type="number"
                value={state.newPayrollData.bonuses || ''}
                onChange={handleInputChange}
              />
              <TextField
                id="net_salary"
                label="Net Salary"
                type="number"
                value={state.newPayrollData.net_salary || ''}
                onChange={handleInputChange}
                required
              />
              <TextField
                id="basic_salary"
                label="Basic Salary"
                type="number"
                value={state.newPayrollData.basic_salary || ''}
                onChange={handleInputChange}
                required
              />
              <TextField
                id="deductions"
                label="Deductions"
                type="number"
                value={state.newPayrollData.deductions || ''}
                onChange={handleInputChange}
              />
              <Button type="submit" variant="contained" color="primary">
                Add Payroll
              </Button>
            </Stack>
          </Paper>
        </form>
      </Modal>

      {/* Generate modal */}
      <Modal open={state.generateOpen} onClose={handleCloseGenerate}>
        <form onSubmit={handleGenerateSubmit}>
          <Paper sx={{
            p: 4,
            width: 400,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24
          }}>
            <Stack spacing={2}>
              <Autocomplete
                multiple
                options={state.employees}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                onChange={handleGenerateEmployeeSelect}
                renderInput={(params) => (
                  <TextField {...params} label="All Employees" variant="outlined" />
                )}
                disabled
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['month', 'year']}
                  label="Month and Year"
                  value={state.generateData.month && state.generateData.year
                    ? dayjs(`${state.generateData.month}-${state.generateData.year}`, 'MM-YYYY')
                    : null}
                  onChange={(newValue) => {
                    if (newValue) {
                      dispatch({
                        type: 'SET_GENERATE_FORM_DATA',
                        payload: {
                          month: newValue.format('MM'),
                          year: newValue.format('YYYY')
                        }
                      });
                    }
                  }}
                  format="MM/YYYY"
                />
              </LocalizationProvider>
              <Button type="submit" variant="contained" color="primary">
                Generate Payroll
              </Button>
            </Stack>
          </Paper>
        </form>
      </Modal>

      <DeletePayroll
        open={state.confirmDeleteOpen}
        onClose={() => dispatch({ type: 'SET_CONFIRM_DELETE_OPEN', payload: false })}
        onConfirm={handleDeletePayroll}
        title="Confirm Deletion"
        message="Are you sure you want to delete this payroll entry?"
      />
    </Paper>
  );
};

export default PayrollviewTable;