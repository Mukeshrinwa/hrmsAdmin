import type { MouseEvent, ChangeEvent } from 'react';
import type { Data, Column } from 'src/Interface/notification.interface';

import React, { useEffect, useReducer } from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';
import { Stack, Avatar, Tooltip, IconButton, Typography, AvatarGroup } from '@mui/material';

import announcementsApi from 'src/Api/announcements/useAnnouncementsApi';

import { Iconify } from 'src/components/iconify';

import AddNotificationModal from './AddNotificationModal';
import EditNotificationModal from './EditNotificationModal';
import DeleteNotificationModal from './DeleteNotificationModal';

const columns: Column[] = [
    { id: 'author', label: 'Author', minWidth: 150 },
    { id: 'title', label: 'Title', minWidth: 150 },
    { id: 'content', label: 'Content', minWidth: 200 },
    { id: 'audience', label: 'Departments', minWidth: 200 },
    {  id: 'actions', label: 'Actions', align: 'center', minWidth: 100}
];



interface State {
    page: number;
    rowsPerPage: number;
    searchValue: string;
    rows: Data[];
    selectedAnnouncement: Data | null;
    editModalOpen: boolean;
    addModalOpen: boolean;
    deleteModalOpen: boolean;
    announcementToDelete: string | null;
}

type Action =
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_ROWS_PER_PAGE'; payload: number }
    | { type: 'SET_SEARCH_VALUE'; payload: string }
    | { type: 'SET_ROWS'; payload: Data[] }
    | { type: 'SET_SELECTED_ANNOUNCEMENT'; payload: Data | null }
    | { type: 'SET_EDIT_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_ADD_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_DELETE_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_ANNOUNCEMENT_TO_DELETE'; payload: string | null };

const initialState: State = {
    page: 0,
    rowsPerPage: 10,
    searchValue: '',
    rows: [],
    selectedAnnouncement: null,
    editModalOpen: false,
    addModalOpen: false,
    deleteModalOpen: false,
    announcementToDelete: null,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_PAGE':
            return { ...state, page: action.payload };
        case 'SET_ROWS_PER_PAGE':
            return { ...state, rowsPerPage: action.payload, page: 0 };
        case 'SET_SEARCH_VALUE':
            return { ...state, searchValue: action.payload };
        case 'SET_ROWS':
            return { ...state, rows: action.payload };
        case 'SET_SELECTED_ANNOUNCEMENT':
            return { ...state, selectedAnnouncement: action.payload };
        case 'SET_EDIT_MODAL_OPEN':
            return { ...state, editModalOpen: action.payload };
        case 'SET_ADD_MODAL_OPEN':
            return { ...state, addModalOpen: action.payload };
        case 'SET_DELETE_MODAL_OPEN':
            return { ...state, deleteModalOpen: action.payload };
        case 'SET_ANNOUNCEMENT_TO_DELETE':
            return { ...state, announcementToDelete: action.payload };
        default:
            return state;
    }
};

const NotificationTable: React.FC = () => {
    const { fetchAnnouncements } = announcementsApi();
    const [state, dispatch] = useReducer(reducer, initialState);

    const loadAnnouncements = async () => {
        const announcementData = await fetchAnnouncements();
        dispatch({ type: 'SET_ROWS', payload: announcementData.data }); // Assuming data is in the 'data' property
    };

    useEffect(() => {
        loadAnnouncements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        dispatch({ type: 'SET_PAGE', payload: newPage });
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_ROWS_PER_PAGE', payload: +event.target.value });
    };

    const handleEditClick = (announcement: Data) => {
        dispatch({ type: 'SET_SELECTED_ANNOUNCEMENT', payload: announcement });
        dispatch({ type: 'SET_EDIT_MODAL_OPEN', payload: true });
    };

    const handleDeleteClick = (announcementId: string) => {
        dispatch({ type: 'SET_ANNOUNCEMENT_TO_DELETE', payload: announcementId });
        dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: true });
    };

    const handleAddClick = () => {
        dispatch({ type: 'SET_ADD_MODAL_OPEN', payload: true });
    };

    const handleUpdate = () => {
        loadAnnouncements();
    };

    const handleAdd = () => {
        loadAnnouncements();
        dispatch({ type: 'SET_ADD_MODAL_OPEN', payload: false });
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
                        Add New Announcement
                    </Button>
                </Grid>
            </Grid>

            <TableContainer sx={{ marginTop: '16px', maxHeight: 'calc(100vh - 200px)' }}>
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
                        {state.rows
                            .filter((row) =>
                                row.title.toLowerCase().includes(state.searchValue.toLowerCase()) ||
                                (row.author_id && 
                                    `${row.author_id.first_name} ${row.author_id.last_name}`
                                        .toLowerCase()
                                        .includes(state.searchValue.toLowerCase()))
                            )
                            .slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage)
                            .map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                    <TableCell>
                                        {row.author_id ? `${row.author_id.first_name} ${row.author_id.last_name}` : 'N/A'}
                                    </TableCell>
                                    <TableCell>{row.title}</TableCell>
                                    <TableCell>
                                        <Typography noWrap sx={{ maxWidth: '300px' }}>
                                            {row.content}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <AvatarGroup max={3}>
                                            {row.audience.map((dept, index) => (
                                                <Tooltip key={index} title={dept.name}>
                                                    <Avatar sx={{ width: 32, height: 32 }}>
                                                        {dept.name.charAt(0)}
                                                    </Avatar>
                                                </Tooltip>
                                            ))}
                                        </AvatarGroup>
                                    </TableCell>
                                    <TableCell align="center">
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
            />

            {state.selectedAnnouncement && (
                <EditNotificationModal
                    open={state.editModalOpen}
                    onClose={() => dispatch({ type: 'SET_EDIT_MODAL_OPEN', payload: false })}
                    announcement={state.selectedAnnouncement}
                    onUpdate={handleUpdate}
                />
            )}

            <AddNotificationModal
                open={state.addModalOpen}
                onClose={() => dispatch({ type: 'SET_ADD_MODAL_OPEN', payload: false })}
                onAdd={handleAdd}
            />

            <DeleteNotificationModal
                open={state.deleteModalOpen}
                onClose={() => dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: false })}
                announcementId={state.announcementToDelete}
                onUpdate={handleUpdate}
            />
        </Paper>
    );
};



export default NotificationTable;