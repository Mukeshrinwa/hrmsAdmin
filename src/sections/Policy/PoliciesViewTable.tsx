import type { MouseEvent, ChangeEvent } from 'react';
import type { Data, Column } from '@/src/Interface/policies';

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

import policiesApi from 'src/Api/policies/policiesApi';

import { Iconify } from 'src/components/iconify';
import { formatDate } from 'src/components/formatDate/formatDate';

import AddPolicyModal from './AddPolicyModal';
import EditPolicyModal from './EditPolicyModal';
import DeletePolicyModal from './DeletePolicyModal';

const columns: Column[] = [
    { id: 'policy_id', label: 'Policy ID' },
    { id: 'title', label: 'Title' },
    { id: 'description', label: 'Description' },
    { id: 'effective_date', label: 'Effective Date' },
    // { id: 'createdAt', label: 'Created At' },
    // { id: 'updatedAt', label: 'Updated At' },
];

interface State {
    page: number;
    rowsPerPage: number;
    searchValue: string;
    rows: Data[];
    editModalOpen: boolean;
    deleteModalOpen: boolean;
    addModalOpen: boolean;
    selectedPolicy: Data | null;
    policyIdToDelete: string | null;
}

type Action =
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_ROWS_PER_PAGE'; payload: number }
    | { type: 'SET_SEARCH_VALUE'; payload: string }
    | { type: 'SET_ROWS'; payload: Data[] }
    | { type: 'SET_EDIT_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_DELETE_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_ADD_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_SELECTED_POLICY'; payload: Data | null }
    | { type: 'SET_POLICY_ID_TO_DELETE'; payload: string | null };

const initialState: State = {
    page: 0,
    rowsPerPage: 10,
    searchValue: '',
    rows: [],
    editModalOpen: false,
    deleteModalOpen: false,
    addModalOpen: false,
    selectedPolicy: null,
    policyIdToDelete: null,
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
        case 'SET_EDIT_MODAL_OPEN':
            return { ...state, editModalOpen: action.payload };
        case 'SET_DELETE_MODAL_OPEN':
            return { ...state, deleteModalOpen: action.payload };
        case 'SET_ADD_MODAL_OPEN':
            return { ...state, addModalOpen: action.payload };
        case 'SET_SELECTED_POLICY':
            return { ...state, selectedPolicy: action.payload };
        case 'SET_POLICY_ID_TO_DELETE':
            return { ...state, policyIdToDelete: action.payload };
        default:
            return state;
    }
};

const PoliciesViewTable: React.FC = () => {
    const { fetchPolicies } = policiesApi();
    const [state, dispatch] = useReducer(reducer, initialState);

    const loadPolicies = async () => {
        const policyData = await fetchPolicies();
        dispatch({ type: 'SET_ROWS', payload: policyData });
    };

    useEffect(() => {
        loadPolicies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        dispatch({ type: 'SET_PAGE', payload: newPage });
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_ROWS_PER_PAGE', payload: +event.target.value });
    };

    const handleEditClick = (policy: Data) => {
        dispatch({ type: 'SET_SELECTED_POLICY', payload: policy });
        dispatch({ type: 'SET_EDIT_MODAL_OPEN', payload: true });
    };

    const handleDeleteClick = (policyId: string) => {
        dispatch({ type: 'SET_POLICY_ID_TO_DELETE', payload: policyId });
        dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: true });
    };

    const handleAddClick = () => {
        dispatch({ type: 'SET_ADD_MODAL_OPEN', payload: true });
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
                        Add New Policy
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
                            .filter((row) =>
                                Object.values(row).some((value) =>
                                    value.toString().toLowerCase().includes(state.searchValue.toLowerCase())
                                )
                            )
                            .slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage)
                            .map((row) => (
                                <TableRow key={row._id} hover>
                                    {columns.map((column) => (
                                        <TableCell key={column.id}>
                                            {column.id === 'effective_date' ? formatDate(row[column.id]) : row[column.id]}
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

            <EditPolicyModal
                open={state.editModalOpen}
                onClose={() => dispatch({ type: 'SET_EDIT_MODAL_OPEN', payload: false })}
                policy={state.selectedPolicy}
                onUpdate={loadPolicies}
            />
            <DeletePolicyModal
                open={state.deleteModalOpen}
                onClose={() => dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: false })}
                policyId={state.policyIdToDelete}
                onUpdate={loadPolicies}
            />
            <AddPolicyModal
                open={state.addModalOpen}
                onClose={() => dispatch({ type: 'SET_ADD_MODAL_OPEN', payload: false })}
                onAdd={loadPolicies}
            />
        </Paper>
    );
};

export default PoliciesViewTable;
