import type { Dayjs } from 'dayjs';
import type { Data, Column } from '@/src/Interface/shift_table.interface';

import dayjs from 'dayjs';
import * as React from 'react';

import { styled } from '@mui/material/styles';
import {
  Box,
  Paper,
  Table,
  Button,
  // Switch,
  Dialog,
  // Select,
  // MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  // TextField,
  // InputLabel,
  Typography,
  IconButton,
  // FormControl,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
  TablePagination,
  // Stack,
  // InputAdornment,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import ShiftModal from '../SettingModal/Shift/ShiftModal';

const today = dayjs();
// const yesterday = dayjs().subtract(1, 'day');
// const todayStartOfTheDay = today.startOf('day');


const columns: readonly Column[] = [

  { id: 'name', label: 'Shift Name', minWidth: 170, align: 'center' },
  {
    id: 'shiftstart',
    label: 'Shift Start',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'shiftend',
    label: 'Shift End',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  { id: 'autopunchout', label: 'Auto Punch Out', minWidth: 170 },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toFixed(2),
  },
];



function createData(name: string, start: string, end: string, autopunchout: string): Data {
  return { name, start, end, autopunchout };
}

const rows = [
  createData('first', '9:30 AM', '6:30 PM', '6:40 PM'),
  createData('second', '9:30 AM', '6:30 PM', '6:40 PM'),
  createData('three', '9:30 AM', '6:30 PM', '6:40 PM'),
  createData('four', '9:30 AM', '6:30 PM', '6:40 PM'),
];
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
export default function ShiftTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [edit, setEdit] = React.useState(false);
  const [trash, setTrash] = React.useState(false);
  const [shift, setShift] = React.useState('')
  const [start, setStart] = React.useState<Dayjs | null>(dayjs(today));
  const [end, setEnd] = React.useState<Dayjs | null>(dayjs(today));
  const [punch, setPunch] = React.useState<Dayjs | null>(dayjs(today));
  const [fullTime, setFullTime] = React.useState<Dayjs | null>(dayjs(today));
  const [halfTime, setHalfTime] = React.useState<Dayjs | null>(dayjs(today));
  const [graceTime, setGraceTime] = React.useState<Dayjs | null>(dayjs(today));


  const handleClickEdit = () => {
    setEdit(true);
  };
  const handleCloseEdit = () => {
    setEdit(false);
  };
  const handleClickDelete = () => {
    setTrash(true);
  };
  const handleCloseDelete = () => {
    setTrash(false);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const editmodal: boolean = true;
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) =>
              <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                <TableCell align="center" key={row.name}>
                  {row.name}
                </TableCell>
                <TableCell align="center" key={row.name}>
                  {row.start}
                </TableCell>
                <TableCell align="center" key={row.name}>
                  {row.end}
                </TableCell>
                <TableCell align="center" key={row.name}>
                  {row.autopunchout}
                </TableCell>
                {/* <TableCell align="center" key={row.name}>
                    <Switch
                      checked={row.status}
                      onChange={handleStatusChange}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </TableCell> */}
                <TableCell
                  sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
                  key={row.name}
                >
                  {/* <Box sx={{'&:hover':{backgroundColor:'dodgerblue',"& .viewIcon": {color: "white"}},width:'30px',height:'30px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',border: (theme) => `solid 1px ${theme.vars.palette.divider}`,}}>
                      <Iconify color='primary' className='viewIcon' sx={{cursor:'pointer'}} icon="solar:eye-linear" />
                      </Box> */}
                  <Box
                    onClick={handleClickEdit}
                    sx={{
                      '&:hover': { backgroundColor: 'green', '& .editIcon': { color: 'white' } },
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                    }}
                  >
                    <Iconify
                      className="editIcon"
                      sx={{ cursor: 'pointer' }}
                      icon="mage:edit-pen"
                    />
                  </Box>
                  <Box
                    onClick={handleClickDelete}
                    sx={{
                      '&:hover': { backgroundColor: 'red', '& .trashIcon': { color: 'white' } },
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                    }}
                  >
                    <Iconify
                      className="trashIcon"
                      sx={{ cursor: 'pointer' }}
                      icon="mynaui:trash"
                    />
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ShiftModal
        editmodal={editmodal}
        open={edit}
        handleClose={handleCloseEdit}
        shift={shift}
        start={start}
        end={end}
        punch={punch}
        fullTime={fullTime}
        halfTime={halfTime}
        graceTime={graceTime}
        setShift={setShift}
        setStart={setStart}
        setEnd={setEnd}
        setPunch={setPunch}
        setFullTime={setFullTime}
        setHalfTime={setHalfTime}
        setGraceTime={setGraceTime}
      />
      <BootstrapDialog
        onClose={handleCloseDelete}
        aria-labelledby="customized-dialog-title"
        open={trash}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Delete
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDelete}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          }}
        >
          <Iconify icon="clarity:close-line" />
        </IconButton>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }} dividers>
          <Typography>Are You Sure You Want To Delete This</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ background: '#007C7C' }}
            autoFocus
            onClick={handleCloseDelete}
          >
            No
          </Button>
          <Button
            variant="contained"
            sx={{ background: 'red' }}
            autoFocus
            onClick={handleCloseDelete}
          >
            Yes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Paper>
  );
}
