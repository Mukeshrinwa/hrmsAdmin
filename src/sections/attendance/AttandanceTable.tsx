import type { AttendanceData } from 'src/Interface/attendanceData.interfce';

import dayjs from 'dayjs';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker, LocalizationProvider, } from '@mui/x-date-pickers';
import {
  Box,
  Grid,
  Modal,
  Paper,
  Table,
  Button,
  Dialog,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  TableContainer,
  InputAdornment,
  TablePagination,
} from '@mui/material';

import useAttandanceApi from 'src/Api/all_attandance/useAttandanceApi';

import { Iconify } from 'src/components/iconify';

// Define the Column type
interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'center';
}

// Define the columns
const columns: readonly Column[] = [
  { id: 'employee_id', label: 'Employee Name', minWidth: 170 },
  { id: 'date', label: 'Date', minWidth: 150, align: 'center' },
  { id: 'check_in_time', label: 'Check-In Time', minWidth: 150, align: 'center' },
  { id: 'check_out_time', label: 'Check-Out Time', minWidth: 150, align: 'center' },
  { id: 'status', label: 'Status', minWidth: 150, align: 'center' },
  { id: 'notes', label: 'Notes', minWidth: 150, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 170, align: 'center' },
];

// Define the initial state
const initialState = {
  page: 0,
  rowsPerPage: 10,
  edit: false,
  trash: false,
  attendanceData: [] as AttendanceData[],
  editAttendance: null as AttendanceData | null,
  attendanceIdToDelete: null as string | null,
};

// Define the reducer function
function reducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_ROWS_PER_PAGE':
      return { ...state, rowsPerPage: action.payload, page: 0 };
    case 'OPEN_EDIT':
      return { ...state, edit: true, editAttendance: action.payload };
    case 'CLOSE_EDIT':
      return { ...state, edit: false, editAttendance: null };
    case 'OPEN_DELETE':
      return { ...state, trash: true, attendanceIdToDelete: action.payload };
    case 'CLOSE_DELETE':
      return { ...state, trash: false, attendanceIdToDelete: null };
    case 'SET_ATTENDANCE_DATA':
      return { ...state, attendanceData: action.payload };
    case 'UPDATE_ATTENDANCE':
      return {
        ...state,
        attendanceData: state.attendanceData.map((attendance) =>
          attendance._id === action.payload._id ? action.payload : attendance
        ),
      };
    case 'DELETE_ATTENDANCE':
      return {
        ...state,
        attendanceData: state.attendanceData.filter(
          (attendance) => attendance._id !== action.payload
        ),
      };
    default:
      return state;
  }
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '500px',
  bgcolor: 'background.paper',
  border: '1px solid whitesmoke',
  borderRadius: '20px',
  boxShadow: 24,
  p: 2,
};

// Main component
export default function AttendanceTable() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { fetchAllattendance, updateAttendance, deleteAttendance, } = useAttandanceApi();

  React.useEffect(() => {
    const getAttendanceData = async () => {
      const data = await fetchAllattendance();
      dispatch({ type: 'SET_ATTENDANCE_DATA', payload: data });
    };

    getAttendanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React.useEffect(() => {
  //   const getAttendanceData = async () => {
  //     try {
  //       const attendanceData = await fetchAllattendance();

  //       if (attendanceData && Array.isArray(attendanceData)) {
  //         const updatedAttendanceData = await Promise.all(attendanceData.map(async (attendance) => {
  //           try {
  //             const employeeData = await fetchEmployeesByid(attendance.employee_id);
  //             return {
  //               ...attendance,
  //               employeeName: employeeData
  //                 ? `${employeeData.first_name} ${employeeData.last_name}`
  //                 : attendance.employee_id,
  //             };
  //           } catch (error) {
  //             console.error(`Error fetching employee for id: ${attendance.employee_id}`, error);
  //             return {
  //               ...attendance,
  //               employeeName: attendance.employee_id,
  //             };
  //           }
  //         }));

  //         dispatch({ type: 'SET_ATTENDANCE_DATA', payload: updatedAttendanceData });
  //       } else {
  //         console.error('Invalid attendance data format', attendanceData);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch attendance data', error);
  //     }
  //   };

  //   getAttendanceData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_ROWS_PER_PAGE', payload: +event.target.value });
  };

  const handleSaveChanges = async () => {
    if (state.editAttendance) {
      await updateAttendance(state.editAttendance._id, state.editAttendance); // Pass _id separately
      dispatch({ type: 'UPDATE_ATTENDANCE', payload: state.editAttendance });
      dispatch({ type: 'CLOSE_EDIT' });
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>

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

      </Grid>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {state.attendanceData
              .slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage)
              .map((row: AttendanceData) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                  <TableCell align="center">
                    {row.employee_id
                      ? `${row.employee_id.first_name} ${row.employee_id.last_name}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    {dayjs(row.date).format('DD-MM-YYYY')}
                  </TableCell>
                  <TableCell align="center">{row.check_in_time || 'N/A'}</TableCell>
                  <TableCell align="center">{row.check_out_time || 'N/A'}</TableCell>
                  <TableCell align="center">{row.status || 'N/A'}</TableCell>
                  <TableCell align="center">{row.notes || 'N/A'}</TableCell>
                  <TableCell sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {row.employee_id && (
                      <Link to={`/employee-profile/${row.employee_id._id}`}>
                        <IconButton>
                          <Iconify icon="raphael:view" />
                        </IconButton>
                      </Link>
                    )}
                    <IconButton onClick={() => dispatch({ type: 'OPEN_EDIT', payload: row })}>
                      <Iconify icon="eva:edit-2-outline" />
                    </IconButton>
                    <IconButton onClick={() => dispatch({ type: 'OPEN_DELETE', payload: row._id })}>
                      <Iconify icon="weui:delete-outlined" />
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
        count={state.attendanceData.length}
        rowsPerPage={state.rowsPerPage}
        page={state.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Attendance Modal */}
      <Modal onClose={() => dispatch({ type: 'CLOSE_EDIT' })} open={state.edit}>
        <Box sx={style}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '30px', marginBottom: '20px' }}>
            <h2>Edit Attendance</h2>
            <IconButton aria-label="close" onClick={() => dispatch({ type: 'CLOSE_EDIT' })} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
              <Iconify icon="clarity:close-line" />
            </IconButton>
          </Box>
          <Box sx={{ mt: '10px', mb: '10px', pb: '10px', pt: '10px', display: 'flex', flexDirection: 'column', gap: '20px', borderBottom: '1px solid whitesmoke', borderTop: '1px solid whitesmoke' }}>
            <TextField
              sx={{ width: '100%' }}
              placeholder="Date"
              type="date"
              value={dayjs(state.editAttendance?.date).format('YYYY-MM-DD') || ''}
              onChange={(e) => dispatch({ type: 'OPEN_EDIT', payload: { ...state.editAttendance, date: e.target.value } })}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Check-In Time"
                value={dayjs(state.editAttendance?.check_in_time) || null}
                onChange={(newValue) => {
                  dispatch({
                    type: 'OPEN_EDIT',
                    payload: { ...state.editAttendance, check_in_time: newValue?.format('HH:mm:ss') || '' },
                  });
                }}
              // renderInput={(params) => <TextField {...params} />} 
              />
              <TimePicker
                label="Check-Out Time"
                value={dayjs(state.editAttendance?.check_out_time) || null}
                onChange={(newValue) => {
                  dispatch({
                    type: 'OPEN_EDIT',
                    payload: { ...state.editAttendance, check_out_time: newValue?.format('HH:mm:ss') || '' },
                  });
                }}
              // renderInput={(params) => <TextField {...params} />} 
              />
            </LocalizationProvider>
            <TextField
              sx={{ width: '100%' }}
              placeholder="Status"
              value={state.editAttendance?.status || ''}
              onChange={(e) => dispatch({ type: 'OPEN_EDIT', payload: { ...state.editAttendance, status: e.target.value } })}
            />
            <TextField
              sx={{ width: '100%' }}
              placeholder="Notes"
              value={state.editAttendance?.notes || ''}
              onChange={(e) => dispatch({ type: 'OPEN_EDIT', payload: { ...state.editAttendance, notes: e.target.value } })}
            />
          </Box>
          <Button variant="contained" onClick={handleSaveChanges}>Save</Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <BootstrapDialog onClose={() => dispatch({ type: 'CLOSE_DELETE' })} open={state.trash}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this attendance record?</DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: 'CLOSE_DELETE' })} color="primary">Cancel</Button>
          <Button
            onClick={() => {
              deleteAttendance(state.attendanceIdToDelete!);
              dispatch({ type: 'DELETE_ATTENDANCE', payload: state.attendanceIdToDelete });
              dispatch({ type: 'CLOSE_DELETE' });
            }}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Paper>
  );
}
