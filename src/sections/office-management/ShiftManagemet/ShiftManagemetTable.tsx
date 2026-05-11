import React, { useState, useEffect } from 'react';

import {
    Grid,
    Paper,
    Table,
    Button,
    Tooltip,
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

import shiftmanagenmetApi from 'src/Api/shift_management/shiftmanagenmetApi';

import { Iconify } from 'src/components/iconify';

import AddShiftModal from './AddShiftModal';
import EditShiftModal from './EditShiftModal';
import DeleteShiftModal from './DeleteShiftModal';

interface ShiftData {
    _id: string;
    name: string;
    start_time: string;
    end_time: string;
    breakDuration: number;
    workingDays: string[];
    lateThreshold: number;
    earlyCheckInAllowed: number;
    description: string;
    status: boolean;
}


const ShiftManagemetTable: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [shiftData, setShiftData] = useState<ShiftData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [shiftToEdit, setShiftToEdit] = useState<ShiftData | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [shiftToDelete, setShiftToDelete] = useState<string | null>(null);

    const { fetchofficeShift, addShift, updateofficeShift, deleteofficeShift } = shiftmanagenmetApi();

    useEffect(() => {
        const fetchShiftData = async () => {
            try {
                const res = await fetchofficeShift();

                const formattedData = res.map((shift: any) => ({
                    _id: shift.id,
                    name: shift.name,
                    start_time: shift.startTime,
                    end_time: shift.endTime,
                    breakDuration: shift.breakDuration || 0,
                    workingDays: shift.workingDays || [],
                    lateThreshold: shift.lateThreshold || 0,
                    earlyCheckInAllowed: shift.earlyCheckInAllowed || 0,
                    description: shift.description,
                    status: shift.isActive,
                }));

                setShiftData(formattedData);

            } catch (error) {
                console.error('Error fetching office Shift:', error);
            }
        };

        fetchShiftData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

const handleAddShift = async (newShiftData: any) => {
    const addedShift = await addShift(newShiftData);

    const formattedShift: ShiftData = {
        _id: addedShift.id,
        name: addedShift.name,
        start_time: addedShift.startTime,
        end_time: addedShift.endTime,
        breakDuration: addedShift.breakDuration || 0,
        workingDays: addedShift.workingDays || [],
        lateThreshold: addedShift.lateThreshold || 0,
        earlyCheckInAllowed: addedShift.earlyCheckInAllowed || 0,
        description: addedShift.description,
        status: addedShift.isActive,
    };

    setShiftData(prev => [...prev, formattedShift]);
};




    const handleUpdateShift = async (id: string, updatedData: any) => {
        const updatedShift = await updateofficeShift(id, updatedData);
        setShiftData(prev =>
            prev.map(shift => (shift._id === id ? { ...shift, ...updatedShift } : shift))
        );
    };


    const handleEditClick = (shift: ShiftData) => {
        setShiftToEdit(shift);
        setIsEditModalOpen(true);
    };



    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const filteredShiftData = shiftData.filter((shift) =>
        shift.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (id: string) => {
        setShiftToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!shiftToDelete) return;

        try {
            await deleteofficeShift(shiftToDelete);
            setShiftData(prev => prev.filter(shift => shift._id !== shiftToDelete));
            setDeleteModalOpen(false);
            setShiftToDelete(null);
        } catch (error) {
            console.error('Error deleting shift:', error);
        }
    };
    const formatTime = (timeString?: string) => {
        if (!timeString) return "-";

        if (!timeString.includes(":")) return timeString;

        const [hours, minutes] = timeString.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    return (
        <>
            <Paper component="div" sx={{ width: '100%', p: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Grid container spacing={2} alignItems="center" mb={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <TextField
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                    <Grid item xs={12} sm={6} md={8} container justifyContent="flex-end" gap={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Iconify icon="gridicons:add-outline" />}
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Add New Shift
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
                    <Table stickyHeader aria-label="shift management table" sx={{ minWidth: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ minWidth: '200px' }}>Shift Name</TableCell>
                                <TableCell align="center" sx={{ minWidth: '150px' }}>Start Time</TableCell>
                                <TableCell align="center" sx={{ minWidth: '150px' }}>End Time</TableCell>
                                <TableCell align="center" sx={{ minWidth: '200px' }}>Description</TableCell>
                                <TableCell align="center" sx={{ minWidth: '150px' }}>Status</TableCell>
                                <TableCell align="center" sx={{ minWidth: '120px' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredShiftData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((shift) => (
                                    <TableRow hover key={shift._id}>
                                        <TableCell align="center">{shift.name}</TableCell>
                                        <TableCell align="center">{formatTime(shift.start_time)}</TableCell>
                                        <TableCell align="center">{formatTime(shift.end_time)}</TableCell>
                                        <TableCell align="center">{shift.description}</TableCell>
                                        <TableCell align="center">
                                            {shift.status ? (
                                                <Button variant="contained" color="success" size="small">
                                                    Active
                                                </Button>
                                            ) : (
                                                <Button variant="contained" color="error" size="small">
                                                    Inactive
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEditClick(shift)}
                                                >
                                                    <Iconify icon="eva:edit-outline" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteClick(shift._id)}
                                                >
                                                    <Iconify icon="eva:trash-2-outline" />
                                                </IconButton>

                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={filteredShiftData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Add Shift Modal */}
            <AddShiftModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddShift={handleAddShift}
            />

            {/* Edit Shift Modal */}
            <EditShiftModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdateShift={handleUpdateShift}
                shiftToEdit={shiftToEdit}
            />
            <DeleteShiftModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />

        </>
    );
};

export default ShiftManagemetTable;