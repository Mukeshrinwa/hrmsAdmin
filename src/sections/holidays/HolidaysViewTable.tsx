import type { MouseEvent, ChangeEvent } from 'react';
import type { Data, Column } from '@/src/Interface/holidays.interface';

import React, { useEffect, useReducer, } from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { Stack, IconButton } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';

import holidaysApi from 'src/Api/holidays/holidaysApi';

import { Iconify } from 'src/components/iconify';
import { formatDate } from 'src/components/formatDate/formatDate';

import AddHolidayModal from './AddHolidayModal';
import EditHolidayModal from './EditHolidayModal';
import DeleteHolidayModal from './DeleteHolidayModal';

const columns: Column[] = [
    { id: 'employee_id', label: 'Employee Name' },
    { id: 'benefit_type', label: 'Benefit Type' },
    { id: 'provider', label: 'Provider' },
    { id: 'policy_number', label: 'Policy Number' },
    { id: 'coverage_amount', label: 'Coverage Amount' },
    { id: 'start_date', label: 'Start Date' },
    { id: 'end_date', label: 'End Date' },
];

const initialState = {
    page: 0,
    rowsPerPage: 10,
    searchValue: '',
    rows: [] as Data[],
    editModalOpen: false,
    deleteModalOpen: false,
    addModalOpen: false,
    selectedHoliday: null as Data | null,
    holidayIdToDelete: null as string | null,
};

type Action =
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_ROWS_PER_PAGE'; payload: number }
    | { type: 'SET_SEARCH_VALUE'; payload: string }
    | { type: 'SET_ROWS'; payload: Data[] }
    | { type: 'OPEN_EDIT_MODAL'; payload: Data }
    | { type: 'CLOSE_EDIT_MODAL' }
    | { type: 'OPEN_DELETE_MODAL'; payload: string }
    | { type: 'CLOSE_DELETE_MODAL' }
    | { type: 'OPEN_ADD_MODAL' }
    | { type: 'CLOSE_ADD_MODAL' };

const reducer = (state: typeof initialState, action: Action) => {
    switch (action.type) {
        case 'SET_PAGE':
            return { ...state, page: action.payload };
        case 'SET_ROWS_PER_PAGE':
            return { ...state, rowsPerPage: action.payload, page: 0 };
        case 'SET_SEARCH_VALUE':
            return { ...state, searchValue: action.payload };
        case 'SET_ROWS':
            return { ...state, rows: action.payload };
        case 'OPEN_EDIT_MODAL':
            return { ...state, selectedHoliday: action.payload, editModalOpen: true };
        case 'CLOSE_EDIT_MODAL':
            return { ...state, editModalOpen: false, selectedHoliday: null };
        case 'OPEN_DELETE_MODAL':
            return { ...state, holidayIdToDelete: action.payload, deleteModalOpen: true };
        case 'CLOSE_DELETE_MODAL':
            return { ...state, deleteModalOpen: false, holidayIdToDelete: null };
        case 'OPEN_ADD_MODAL':
            return { ...state, addModalOpen: true };
        case 'CLOSE_ADD_MODAL':
            return { ...state, addModalOpen: false };
        default:
            return state;
    }
};

const HolidaysViewTable: React.FC = () => {
    const { fetchHolidays } = holidaysApi();
    const [state, dispatch] = useReducer(reducer, initialState);

    const loadHolidays = async () => {
        const holidayData = await fetchHolidays();
        dispatch({ type: 'SET_ROWS', payload: holidayData });
    };

    useEffect(() => {
        loadHolidays();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        dispatch({ type: 'SET_PAGE', payload: newPage });
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_ROWS_PER_PAGE', payload: +event.target.value });
    };

    const handleEditClick = (holiday: Data) => {
        dispatch({ type: 'OPEN_EDIT_MODAL', payload: holiday });
    };

    const handleDeleteClick = (holidayId: string) => {
        dispatch({ type: 'OPEN_DELETE_MODAL', payload: holidayId });
    };

    const handleAddClick = () => {
        dispatch({ type: 'OPEN_ADD_MODAL' });
    };

    return (
        <Paper sx={{ p: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
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
                <Grid item xs={8} container justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Iconify icon="fluent-mdl2:circle-addition" />}
                        onClick={handleAddClick}
                    >
                        Add New Holiday
                    </Button>
                </Grid>
            </Grid>

            <TableContainer sx={{ marginTop: '16px' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell align="center">Actions</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.rows
                            .filter((row) => row.benefit_type.toLowerCase().includes(state.searchValue.toLowerCase()))
                            .slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage)
                            .map((row) => (
                                <TableRow key={row._id} hover>
                                    {columns.map((column) => (
                                        <TableCell key={column.id}>
                                            {column.id === 'start_date' || column.id === 'end_date'
                                                ? formatDate(row[column.id])
                                                : column.id === 'employee_id'
                                                    ? (typeof row.employee_id === 'object' && row.employee_id !== null
                                                        ? `${row.employee_id.first_name} ${row.employee_id.last_name}`
                                                        : row.employee_id || 'N/A')
                                                    : row[column.id]}
                                        </TableCell>
                                    ))}

                                    <TableCell>
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <IconButton onClick={() => handleEditClick(row)}>
                                                <Iconify icon="eva:edit-2-outline" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(row._id)}>
                                                <Iconify icon="weui:delete-outlined" />
                                            </IconButton>
                                        </Stack>
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
                style={{ marginTop: '16px' }}
            />

            <EditHolidayModal
                open={state.editModalOpen}
                onClose={() => dispatch({ type: 'CLOSE_EDIT_MODAL' })}
                holiday={state.selectedHoliday}
                onUpdate={loadHolidays}
            />
            <DeleteHolidayModal
                open={state.deleteModalOpen}
                onClose={() => dispatch({ type: 'CLOSE_DELETE_MODAL' })}
                holidayId={state.holidayIdToDelete}
                onUpdate={loadHolidays}
            />
            <AddHolidayModal
                open={state.addModalOpen}
                onClose={() => dispatch({ type: 'CLOSE_ADD_MODAL' })}
                onAdd={loadHolidays}
            />
        </Paper>
    );
};

export default HolidaysViewTable;
