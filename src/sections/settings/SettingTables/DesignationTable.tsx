import type { Column } from '@/src/Interface/designation_table.interface';

import * as React from 'react';

import { styled } from '@mui/material/styles';
import {  Box,  Paper,  Table,  Button,  Dialog,  TableRow,  TableBody,  TableCell,  TableHead,  Typography,
  IconButton,  DialogTitle,  DialogActions,  DialogContent,  TableContainer,  TablePagination,} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import DesignationModal from '../SettingModal/Designation/DesignationModal';

// Rename the local interface to avoid conflict
export interface LocalData {
  id: string;
  name: string;
}

const columns: readonly Column[] = [
  {
    id: 'name',
    label: 'Shift Name',
    minWidth: 170,
    align: 'left',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
    align: 'left',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];

function createData(id: string, name: string): LocalData {
  return { id, name };
}

const rows = [
  createData('1', 'DhaniRam'),

];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DesignationTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [edit, setEdit] = React.useState(false);
  const [trash, setTrash] = React.useState(false);
  const [designation, setDesignation] = React.useState('');

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
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                <TableCell align="left" key={row.name}>
                  {row.name}
                </TableCell>
                <TableCell
                  sx={{ display: 'flex', justifyContent: 'left', gap: '10px' }}
                  key={row.name}
                >
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
      <DesignationModal editmodal={editmodal} open={edit} handleClose={handleCloseEdit} setDesignation={setDesignation} designation={designation} />
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
