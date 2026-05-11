import type { Data, Column } from '@/src/Interface/leave';

import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';
import {
  Box,
  Paper,
  Stack,
  Table,
  Button,
  Switch,
  Dialog,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';

import leavesTypeApi from 'src/Api/leavesType/leavesTypeApi';

import { Iconify } from 'src/components/iconify';

const columns: readonly Column[] = [
  { id: 'name', label: 'Leave Type', minWidth: 150, align: 'center' },
  { id: 'description', label: 'Description', minWidth: 200, align: 'center' },
  {
    id: 'maxDays',
    label: 'Max Days',
    minWidth: 100,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'isPaid',
    label: 'Paid Leave',
    minWidth: 100,
    align: 'center',
    format: (value: boolean) => (value ? 'Yes' : 'No'),
  },
  {
    id: 'isAccrued',
    label: 'Accrued',
    minWidth: 100,
    align: 'center',
    format: (value: boolean) => (value ? 'Yes' : 'No'),
  },
  {
    id: 'isProrated',
    label: 'Prorated',
    minWidth: 100,
    align: 'center',
    format: (value: boolean) => (value ? 'Yes' : 'No'),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    align: 'center',
    format: (value: boolean) => (value ? 'Active' : 'Inactive'),
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 150,
    align: 'center',
  },
];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function LeaveType() {
  const { fetchLeaveType, addLeaveType, updateLeaveType, deleteLeaveType } = leavesTypeApi();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [trash, setTrash] = React.useState(false);
  const [rowData, setRowData] = React.useState<Data[]>([]);
  const [selectedRow, setSelectedRow] = React.useState<Data | null>(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [editData, setEditData] = React.useState<Data | null>(null);

  const [newLeaveType, setNewLeaveType] = React.useState({
    name: '',
    description: '',
    maxDays: 0,
    isPaid: false,
    isAccrued: false,
    isProrated: false,
    status: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLeaveType();
        const formattedData = response.leaveTypes.map((leave: any) => ({
          id: leave._id,
          name: leave.name,
          description: leave.description,
          maxDays: leave.maxDays,
          isPaid: leave.isPaid,
          isAccrued: leave.isAccrued,
          isProrated: leave.isProrated,
          status: leave.status,
          createdAt: leave.createdAt,
          updatedAt: leave.updatedAt,
        }));
        setRowData(formattedData);
      } catch (error) {
        console.error('Error fetching leave types:', error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (id: string) => {
    try {
      const rowToUpdate = rowData.find(row => row.id === id);
      if (!rowToUpdate) return;

      const updatedStatus = !rowToUpdate.status;
      await updateLeaveType(id, { status: updatedStatus });

      setRowData(prevRows =>
        prevRows.map(row => (row.id === id ? { ...row, status: updatedStatus } : row))
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleClickDelete = (row: Data) => {
    setSelectedRow(row);
    setTrash(true);
  };

  const handleCloseDelete = () => {
    setTrash(false);
    setSelectedRow(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow) return;

    try {
      await deleteLeaveType(selectedRow.id);
      setRowData(prevRows => prevRows.filter(row => row.id !== selectedRow.id));
      handleCloseDelete();
    } catch (error) {
      console.error('Error deleting leave type:', error);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewLeaveType({
      name: '',
      description: '',
      maxDays: 0,
      isPaid: false,
      isAccrued: false,
      isProrated: false,
      status: true
    });
  };

  const handleOpenEditDialog = (row: Data) => {
    setEditData(row);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditData(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewLeaveType(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev!,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleAddLeaveType = async () => {
    try {
      await addLeaveType(newLeaveType);
      const response = await fetchLeaveType();
      const formattedData = response.leaveTypes.map((leave: any) => ({
        id: leave._id,
        name: leave.name,
        description: leave.description,
        maxDays: leave.maxDays,
        isPaid: leave.isPaid,
        isAccrued: leave.isAccrued,
        isProrated: leave.isProrated,
        status: leave.status,
        createdAt: leave.createdAt,
        updatedAt: leave.updatedAt,
      }));
      setRowData(formattedData);
      handleCloseAddDialog();
    } catch (error) {
      console.error('Error adding leave type:', error);
    }
  };

  const handleUpdateLeaveType = async () => {
    if (!editData) return;

    try {
      const { id, ...updateData } = editData;
      await updateLeaveType(id, updateData);

      setRowData(prevRows =>
        prevRows.map(row => (row.id === id ? editData : row))
      );
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating leave type:', error);
    }
  };

  

  return (
    <>
      <Box
        sx={{
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="flex-end"
          alignItems="center"
          gap="10px"
        >
          <Button
            variant="contained"
            startIcon={<Iconify icon="gg:add" />}
            color="primary"
            onClick={handleOpenAddDialog}
          >
            Add Leave
          </Button>
        </Stack>

        <Box sx={{ mt: '10px' }}>
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
                  {rowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id} sx={{ height: '70px' }}>
                      {columns.map((column) => {
                        if (column.id === 'action') {
                          return (
                            <TableCell
                              key={column.id}
                              sx={{ display: 'flex', justifyContent: 'center', gap: '10px', height: '71px' }}
                            >
                              <Box
                                onClick={() => handleOpenEditDialog(row)}
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
                                onClick={() => handleClickDelete(row)}
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
                          );
                        } if (column.id === 'status') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Switch
                                checked={row.status}
                                onChange={() => handleStatusChange(row.id)}
                                inputProps={{ 'aria-label': 'controlled' }}
                              />
                            </TableCell>
                          );
                        }
                        const value = row[column.id as keyof typeof row];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && (typeof value === 'number' || typeof value === 'boolean')
                              ? column.format(value as number | boolean)
                              : value}
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
              count={rowData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </Box>

      {/* Add Leave Dialog */}
      <BootstrapDialog
        onClose={handleCloseAddDialog}
        aria-labelledby="add-leave-dialog-title"
        open={openAddDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="add-leave-dialog-title">
          Add New Leave Type
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseAddDialog}
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
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Leave Type Name"
              name="name"
              value={newLeaveType.name}
              onChange={handleInputChange}
              required
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={newLeaveType.description}
              onChange={handleInputChange}
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              label="Max Days"
              name="maxDays"
              type="number"
              value={newLeaveType.maxDays}
              onChange={handleInputChange}
              inputProps={{ min: 0 }}
            />
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'space-between'
            }}>
              <FormControlLabel
                control={
                  <Switch
                    name="isPaid"
                    checked={newLeaveType.isPaid}
                    onChange={handleInputChange}
                  />
                }
                label="Paid Leave"
              />

              <FormControlLabel
                control={
                  <Switch
                    name="isAccrued"
                    checked={newLeaveType.isAccrued}
                    onChange={handleInputChange}
                  />
                }
                label="Accrued Leave"
              />

              <FormControlLabel
                control={
                  <Switch
                    name="isProrated"
                    checked={newLeaveType.isProrated}
                    onChange={handleInputChange}
                  />
                }
                label="Prorated Leave"
              />

              <FormControlLabel
                control={
                  <Switch
                    name="status"
                    checked={newLeaveType.status}
                    onChange={handleInputChange}
                  />
                }
                label="Active"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddLeaveType}
          >
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* Edit Leave Dialog */}
      <BootstrapDialog
        onClose={handleCloseEditDialog}
        aria-labelledby="edit-leave-dialog-title"
        open={openEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="edit-leave-dialog-title">
          Edit Leave Type
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseEditDialog}
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
        <DialogContent dividers>
          {editData && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Leave Type Name"
                name="name"
                value={editData.name}
                onChange={handleEditInputChange}
                required
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={editData.description}
                onChange={handleEditInputChange}
                multiline
                rows={3}
              />

              <TextField
                fullWidth
                label="Max Days"
                name="maxDays"
                type="number"
                value={editData.maxDays}
                onChange={handleEditInputChange}
                inputProps={{ min: 0 }}
              />
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'space-between'
              }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isPaid"
                      checked={editData.isPaid}
                      onChange={handleEditInputChange}
                    />
                  }
                  label="Paid Leave"
                />

                <FormControlLabel
                  control={
                    <Switch
                      name="isAccrued"
                      checked={editData.isAccrued}
                      onChange={handleEditInputChange}
                    />
                  }
                  label="Accrued Leave"
                />

                <FormControlLabel
                  control={
                    <Switch
                      name="isProrated"
                      checked={editData.isProrated}
                      onChange={handleEditInputChange}
                    />
                  }
                  label="Prorated Leave"
                />

                <FormControlLabel
                  control={
                    <Switch
                      name="status"
                      checked={editData.status}
                      onChange={handleEditInputChange}
                    />
                  }
                  label="Active"
                />
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateLeaveType}
          >
            Update
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* Delete Confirmation Dialog */}
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
            onClick={handleConfirmDelete}
          >
            Yes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}