import * as React from 'react';
import { Link } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Grid, Stack, TextField, IconButton, FormControl, InputAdornment } from '@mui/material';

import useDepartmentsApi from 'src/Api/all_departments/useDepartmentsApi';

import { Iconify } from 'src/components/iconify';

interface Column {
  id: 'employee_id' | 'name' | 'department' | 'status' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

interface EmployeeData {
  employee_id: string;
  name: string;
  department: string;
  status: string;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Employee Name', minWidth: 100 },
  { id: 'department', label: 'Department', minWidth: 170 },
  { id: 'status', label: 'Status', minWidth: 170 },
  { id: 'actions', label: 'Actions', minWidth: 100 },
];

export default function SingleDepartmentTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [fetchedEmployeeData, setFetchedEmployeeData] = React.useState<EmployeeData[]>([]);

  const { fetchEmployeeById } = useDepartmentsApi();

  const urlParams = new URLSearchParams(window.location.search);
  const departmentId = urlParams.get('id');

  const handleFetchEmployeeData = async (id: string) => {
    try {
      const response = await fetchEmployeeById(id);
      // Check if response has the correct structure based on your API response
      if (response && response.data && Array.isArray(response.data.employees)) {
        const employeesData = response.data.employees.map((employee: any) => ({
          employee_id: employee.id || employee._id,
          name: `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'N/A',
          department: 'Current Department', // You might want to get this from department data
          status: employee.status || 'N/A'
        }));
        setFetchedEmployeeData(employeesData);
      } else {
        // Fallback if structure is different
        console.warn('Unexpected API response structure:', response);
        setFetchedEmployeeData([]);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setFetchedEmployeeData([]);
    }
  };

  React.useEffect(() => {
    if (departmentId) {
      handleFetchEmployeeData(departmentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ p: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item xs={4}>
          <FormControl fullWidth>
            <TextField
              placeholder="Search..."
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
        <Grid item xs={8} container justifyContent="flex-end" />
      </Grid>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchedEmployeeData.length > 0 ? (
              fetchedEmployeeData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.employee_id}>
                    {columns.map((column) => {
                      if (column.id === 'actions') {
                        return (
                          <TableCell key={column.id}>
                            <Stack direction="row" spacing={1}>
                              <Link to={`/employee-profile/${row.employee_id}`}>
                                <IconButton>
                                  <Iconify icon="raphael:view" />
                                </IconButton>
                              </Link>
                            </Stack>
                          </TableCell>
                        );
                      }
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No employee data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={fetchedEmployeeData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}