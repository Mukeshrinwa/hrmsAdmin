import type { MouseEvent, ChangeEvent } from 'react';
import type { Data, Column } from '@/src/Interface/training.interface';

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
import { Stack, Avatar, IconButton, AvatarGroup } from '@mui/material';

import trainingApi from 'src/Api/training/trainingApi';

import { Iconify } from 'src/components/iconify';
import { formatDate } from 'src/components/formatDate/formatDate';

import AddTrainingModal from './AddtrainingModal';
import EditTrainingModal from './EditTrainingModal';
import AssignTrainingModal from './AssignTrainingModal';
import DeleteTrainingModal from './DeletetrainingModal';

/* ---------------------------------- Columns --------------------------------- */

const columns: Column[] = [
    { id: 'trainer_id', label: 'Trainer Name' },
    { id: 'program_id', label: 'Program ID' },
    { id: 'name', label: 'Program Name' },
    { id: 'participants', label: 'Participants' },
    { id: 'description', label: 'Description' },
    { id: 'start_date', label: 'Start Date' },
    { id: 'end_date', label: 'End Date' },
];

/* ----------------------------------- State ---------------------------------- */

interface State {
    page: number;
    rowsPerPage: number;
    searchValue: string;
    rows: Data[];
    selectedTraining: Data | null;

    editModalOpen: boolean;
    assignModalOpen: boolean;   // ✅ renamed
    deleteModalOpen: boolean;

    trainingToDelete: string | null;
}

/* ---------------------------------- Actions --------------------------------- */

type Action =
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_ROWS_PER_PAGE'; payload: number }
    | { type: 'SET_SEARCH_VALUE'; payload: string }
    | { type: 'SET_ROWS'; payload: Data[] }
    | { type: 'SET_SELECTED_TRAINING'; payload: Data | null }
    | { type: 'SET_EDIT_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_ASSIGN_MODAL_OPEN'; payload: boolean } // ✅ renamed
    | { type: 'SET_DELETE_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_TRAINING_TO_DELETE'; payload: string | null };

/* -------------------------------- InitialState ------------------------------ */

const initialState: State = {
    page: 0,
    rowsPerPage: 10,
    searchValue: '',
    rows: [],
    selectedTraining: null,

    editModalOpen: false,
    assignModalOpen: false, // ✅ renamed
    deleteModalOpen: false,

    trainingToDelete: null,
};

/* ---------------------------------- Reducer --------------------------------- */

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

        case 'SET_SELECTED_TRAINING':
            return { ...state, selectedTraining: action.payload };

        case 'SET_EDIT_MODAL_OPEN':
            return { ...state, editModalOpen: action.payload };

        case 'SET_ASSIGN_MODAL_OPEN': // ✅ renamed
            return { ...state, assignModalOpen: action.payload };

        case 'SET_DELETE_MODAL_OPEN':
            return { ...state, deleteModalOpen: action.payload };

        case 'SET_TRAINING_TO_DELETE':
            return { ...state, trainingToDelete: action.payload };

        default:
            return state;
    }
};

/* -------------------------------- Component --------------------------------- */

const TrainingViewTable: React.FC = () => {
    const { fetchTraining } = trainingApi();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [addOpen, setAddOpen] = React.useState(false);

    /* ------------------------------ API Load ---------------------------------- */

    const loadTraining = async () => {
        const trainingData = await fetchTraining();

        const mappedData = trainingData.map((item: any) => ({
            _id: item._id,
            program_id: item.trainingId,
            name: item.title,
            description: item.description,
            start_date: item.startDate,
            end_date: item.endDate,
            trainer_id: null,
            participants: [],
        }));

        dispatch({ type: 'SET_ROWS', payload: mappedData });
    };

    useEffect(() => {
        loadTraining();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ------------------------------ Handlers ---------------------------------- */

    const handleChangePage = (
        event: MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        dispatch({ type: 'SET_PAGE', payload: newPage });
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'SET_ROWS_PER_PAGE',
            payload: +event.target.value,
        });
    };

    const handleEditClick = (training: Data) => {
        dispatch({ type: 'SET_SELECTED_TRAINING', payload: training });
        dispatch({ type: 'SET_EDIT_MODAL_OPEN', payload: true });
    };

    const handleDeleteClick = (trainingId: string) => {
        dispatch({ type: 'SET_TRAINING_TO_DELETE', payload: trainingId });
        dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: true });
    };

    const handleAssignClick = () => {
        dispatch({ type: 'SET_ASSIGN_MODAL_OPEN', payload: true });
    };

    const handleUpdate = () => {
        loadTraining();
    };

    const handleAssign = () => {
        loadTraining();
        dispatch({ type: 'SET_ASSIGN_MODAL_OPEN', payload: false });
    };

    /* --------------------------------- Render -------------------------------- */

    return (
        <Paper sx={{ p: 2, boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' }}>
            {/* ---------------------------- Header ---------------------------- */}
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <TextField
                            placeholder="Search..."
                            value={state.searchValue}
                            onChange={(e) =>
                                dispatch({
                                    type: 'SET_SEARCH_VALUE',
                                    payload: e.target.value,
                                })
                            }
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setAddOpen(true)}

                        startIcon={<Iconify icon="fluent-mdl2:circle-addition" />}
                    >
                        Add Training
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="fluent-mdl2:circle-addition" />}
                        onClick={handleAssignClick}
                        color="primary"

                    >
                        Assign Training
                    </Button>
                </Grid>
            </Grid>

            {/* ---------------------------- Table ----------------------------- */}
            <TableContainer sx={{ mt: 2 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id}>{column.label}</TableCell>
                            ))}
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {state.rows
                            .filter((row) =>
                                row.name.toLowerCase().includes(state.searchValue.toLowerCase())
                            )
                            .slice(
                                state.page * state.rowsPerPage,
                                state.page * state.rowsPerPage + state.rowsPerPage
                            )
                            .map((row) => (
                                <TableRow key={row._id} hover>
                                    {columns.map((column) => (
                                        <TableCell key={column.id}>
                                            {(() => {
                                                switch (column.id) {
                                                    case 'trainer_id':
                                                        return row.trainer_id
                                                            ? `${row.trainer_id.first_name} ${row.trainer_id.last_name}`
                                                            : 'N/A';

                                                    case 'participants':
                                                        return (
                                                            <AvatarGroup max={3}>
                                                                {row.participants.map((p, i) => (
                                                                    <Avatar key={i} />
                                                                ))}
                                                            </AvatarGroup>
                                                        );

                                                    case 'start_date':
                                                    case 'end_date':
                                                        return formatDate(row[column.id]);

                                                    default:
                                                        return row[column.id] || 'N/A';
                                                }
                                            })()}

                                        </TableCell>
                                    ))}

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

            {/* ------------------------- Pagination -------------------------- */}
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={state.rows.length}
                rowsPerPage={state.rowsPerPage}
                page={state.page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* ---------------------------- Modals ---------------------------- */}
            {state.selectedTraining && (
                <EditTrainingModal
                    open={state.editModalOpen}
                    onClose={() =>
                        dispatch({ type: 'SET_EDIT_MODAL_OPEN', payload: false })
                    }
                    training={state.selectedTraining}
                    onUpdate={handleUpdate}
                />
            )}

            <AssignTrainingModal
                open={state.assignModalOpen}
                onClose={() =>
                    dispatch({ type: 'SET_ASSIGN_MODAL_OPEN', payload: false })
                }
                onAdd={handleAssign}
            />

            <DeleteTrainingModal
                open={state.deleteModalOpen}
                onClose={() =>
                    dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: false })
                }
                trainingId={state.trainingToDelete}
                onUpdate={handleUpdate}
            />
            <AddTrainingModal
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onAdd={handleUpdate}
            />

        </Paper>
    );
};

export default TrainingViewTable;
