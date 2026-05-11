import type { SelectChangeEvent } from '@mui/material';
import type { Data, Column } from '@/src/Interface/leaves.nterface';

import * as React from 'react';
import { useEffect, useReducer, useCallback, } from 'react';

import {
    Tab,
    Tabs,
    Grid,
    Paper,
    Table,
    Stack,
    Modal,
    Select,
    Button,
    MenuItem,
    TableRow,
    TextField,
    TableHead,
    TableBody,
    TableCell,
    FormControl,
    TableContainer,
    InputAdornment,
    TablePagination,
    TextareaAutosize,
} from '@mui/material';

import leavesApi from 'src/Api/leaves/leavesApi';

import { Iconify } from 'src/components/iconify';

const columns: Column[] = [
    {
        id: 'employeeName',
        label: 'Employee Name ',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'leave_type',
        label: 'Leave Type',
        minWidth: 100,
        align: 'right',
    },
    {
        id: 'days',
        label: 'Days',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 170,
        align: 'left',
    },
];



interface State {
    open: boolean;
    page: number;
    rowsPerPage: number;
    searchValue: string;
    exportOption: string;
    tabIndex: number;
    filteredRows: Data[];
    leaveRequests: Data[];
    reviewData: string;
    currentRejectRow: Data | null;
}

type Action =
    | { type: 'SET_OPEN'; payload: boolean }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_ROWS_PER_PAGE'; payload: number }
    | { type: 'SET_SEARCH_VALUE'; payload: string }
    | { type: 'SET_EXPORT_OPTION'; payload: string }
    | { type: 'SET_TAB_INDEX'; payload: number }
    | { type: 'SET_FILTERED_ROWS'; payload: Data[] }
    | { type: 'SET_LEAVE_REQUESTS'; payload: Data[] }
    | { type: 'SET_REVIEW_DATA'; payload: string }
    | { type: 'SET_CURRENT_REJECT_ROW'; payload: Data | null };

const initialState: State = {
    open: false,
    page: 0,
    rowsPerPage: 10,
    searchValue: '',
    exportOption: 'This Month',
    tabIndex: 0,
    filteredRows: [],
    leaveRequests: [],
    reviewData: '',
    currentRejectRow: null,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_OPEN':
            return { ...state, open: action.payload };
        case 'SET_PAGE':
            return { ...state, page: action.payload };
        case 'SET_ROWS_PER_PAGE':
            return { ...state, rowsPerPage: action.payload, page: 0 };
        case 'SET_SEARCH_VALUE':
            return { ...state, searchValue: action.payload, page: 0 };
        case 'SET_EXPORT_OPTION':
            return { ...state, exportOption: action.payload };
        case 'SET_TAB_INDEX':
            return { ...state, tabIndex: action.payload, page: 0 };
        case 'SET_FILTERED_ROWS':
            return { ...state, filteredRows: action.payload };
        case 'SET_LEAVE_REQUESTS':
            return { ...state, leaveRequests: action.payload };
        case 'SET_REVIEW_DATA':
            return { ...state, reviewData: action.payload };
        case 'SET_CURRENT_REJECT_ROW':
            return { ...state, currentRejectRow: action.payload };
        default:
            return state;
    }
};

const LeavesViewTable: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { fetchLeave, updateLeave } = leavesApi();

    const handleViewModeChange = useCallback(() => {
        let filtered: Data[];
        switch (state.tabIndex) {
            case 0:
                filtered = state.leaveRequests.filter((row) => row.status === 'Approved');
                break;
            case 1:
                filtered = state.leaveRequests.filter(
                    (row) => row.status === 'Pending'
                );
                break;
            case 2:
                filtered = state.leaveRequests.filter((row) => row.status === 'Unapproved');
                break;
            default:
                filtered = state.leaveRequests;
        }
        dispatch({ type: 'SET_FILTERED_ROWS', payload: filtered });
    }, [state.leaveRequests, state.tabIndex]);


    useEffect(() => {
        handleViewModeChange();
    }, [state.leaveRequests, handleViewModeChange]);

    const displayedRows = state.filteredRows.filter((row) =>
        row._id.toLowerCase().includes(state.searchValue.toLowerCase())
    );

    const paginatedRows = displayedRows.slice(
        state.page * state.rowsPerPage,
        state.page * state.rowsPerPage + state.rowsPerPage
    );

    const handleChangePage = (event: unknown, newPage: number) => {
        dispatch({ type: 'SET_PAGE', payload: newPage });
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        dispatch({ type: 'SET_ROWS_PER_PAGE', payload: parseInt(event.target.value, 10) });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_SEARCH_VALUE', payload: event.target.value });
    };

    const handleExportOptionChange = (event: SelectChangeEvent<string>) => {
        dispatch({ type: 'SET_EXPORT_OPTION', payload: event.target.value as string });
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        dispatch({ type: 'SET_TAB_INDEX', payload: newValue });
    };

    const handleReject = (row: Data) => {
        dispatch({ type: 'SET_CURRENT_REJECT_ROW', payload: row });
        dispatch({ type: 'SET_OPEN', payload: true });
    };

    const handleClose = () => {
        dispatch({ type: 'SET_OPEN', payload: false });
        dispatch({ type: 'SET_CURRENT_REJECT_ROW', payload: null });
        dispatch({ type: 'SET_REVIEW_DATA', payload: '' });
    };

    const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ type: 'SET_REVIEW_DATA', payload: event.target.value });
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const newStatus = event.target.value as string;
        if (state.currentRejectRow) {
            const updatedRow = { ...state.currentRejectRow, status: newStatus };
            dispatch({ type: 'SET_CURRENT_REJECT_ROW', payload: updatedRow });
        }
    };

    const handleSubmit = async (row: Data) => {

        if (!state.currentRejectRow) return;
        const updatedData = {
            review: state.reviewData,
            status: state.currentRejectRow.status,
        };

        try {
            await updateLeave(row._id, updatedData);
            const updatedRequests = state.leaveRequests.map((request) =>
                request._id === row._id ? { ...request, ...updatedData } : request
            );
            dispatch({ type: 'SET_LEAVE_REQUESTS', payload: updatedRequests });
        } catch (error) {
            console.error('Error updating leave:', error);
        } finally {
            handleClose();
        }
    };

    //   useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const leaveData = await fetchLeave();

    //             if (leaveData && Array.isArray(leaveData.data)) {
    //                 const updatedLeaveData = await Promise.all(leaveData.data.map(async (leave) => {
    //                     try {
    //                         // Check if employee_id is an object and has _id property
    //                         const employeeId = typeof leave.employee_id === 'object' && leave.employee_id !== null 
    //                             ? leave.employee_id._id 
    //                             : leave.employee_id;

    //                         const employeeData = await fetchEmployeesByid(employeeId);
    //                         return {
    //                             ...leave,
    //                             employeeName: employeeData
    //                                 ? `${employeeData.first_name} ${employeeData.last_name}`
    //                                 : employeeId, // fallback to the ID if employee data not found
    //                         };
    //                     } catch (error) {
    //                         console.error(`Error fetching employee for id: ${employeeId}`, error);
    //                         return {
    //                             ...leave,
    //                             employeeName: employeeId,
    //                         };
    //                     }
    //                 }));

    //                 dispatch({ type: 'SET_LEAVE_REQUESTS', payload: updatedLeaveData });
    //             } else {
    //                 console.error('Invalid leave data format', leaveData);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching leave data:', error);
    //         }
    //     };

    //     fetchData();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const leaveData = await fetchLeave();

                if (leaveData && Array.isArray(leaveData.data)) {
                    const updatedLeaveData = leaveData.data.map((leave: Data) => {
                        if (typeof leave.employee_id === 'object' && leave.employee_id !== null) {
                            return {
                                ...leave,
                                employeeName: `${leave.employee_id.first_name} ${leave.employee_id.last_name}`
                            };
                        }
                        return {
                            ...leave,
                            employeeName: 'Loading...'
                        };
                    });


                    dispatch({ type: 'SET_LEAVE_REQUESTS', payload: updatedLeaveData });
                }
            } catch (error) {
                console.error('Error fetching leave data:', error);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Grid>
            <Tabs value={state.tabIndex} onChange={handleTabChange}>
                <Tab label="Approved Leave" />
                <Tab label="Pending Leave" />
                <Tab label="Rejected Leave" />
            </Tabs>

            <Paper
                sx={{
                    p: 2,
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    marginTop: '12px',
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <TextField
                                placeholder="Search..."
                                value={state.searchValue}
                                onChange={handleInputChange}
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
                        <Select
                            value={state.exportOption}
                            onChange={handleExportOptionChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Export Options' }}
                        >
                            <MenuItem value="This Month">This Month</MenuItem>
                            <MenuItem value="This Day">This Day</MenuItem>
                            <MenuItem value="This Year">This Year</MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <TableContainer sx={{ marginTop: '26px' }}>
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
                            {paginatedRows.map((row) => (
                                <TableRow key={row._id} hover>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.id === 'status' ? (
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    {row.status === 'Approved' && (
                                                        <>
                                                            <span
                                                                style={{
                                                                    color: 'green',
                                                                    background: '#3FC28A1A',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '6px',
                                                                }}
                                                            >
                                                                Approved
                                                            </span>
                                                            <Button onClick={() => handleReject(row)}>
                                                                <Iconify icon="eva:close-fill" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    {row.status === 'Pending' && (
                                                        <>
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                onClick={() => handleReject(row)}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button onClick={() => handleReject(row)}>
                                                                <Iconify icon="eva:close-fill" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    {row.status === 'Unapproved' && (
                                                        <>   <span
                                                            style={{
                                                                color: '#FF474D',
                                                                background: '#FFEAEB',
                                                                padding: '4px 10px',
                                                                borderRadius: '6px',
                                                            }}
                                                        >
                                                            Rejected
                                                        </span>
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                onClick={() => handleReject(row)}
                                                            >
                                                                Approve
                                                            </Button>

                                                        </>
                                                    )}

                                                </Stack>
                                            ) : (
                                                row[column.id as keyof Data]
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={displayedRows.length}
                    rowsPerPage={state.rowsPerPage}
                    page={state.page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Modal
                open={state.open}
                onClose={handleClose}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h2 id="edit-modal-title"> Reason</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (state.currentRejectRow) {
                                handleSubmit(state.currentRejectRow);
                            }
                        }}
                    >
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Enter your rejection reason"
                            value={state.reviewData}
                            onChange={handleReviewChange}
                            style={{ width: '100%', marginBottom: '15px' }}
                        />

                        <Select
                            value={state.currentRejectRow?.status || ''}
                            onChange={handleStatusChange}
                            displayEmpty
                            fullWidth
                            sx={{ marginBottom: '25px' }}
                        >
                            <MenuItem value="" disabled>
                                Select Status
                            </MenuItem>
                            <MenuItem value="Approved">Approved</MenuItem>
                            <MenuItem value="Unapproved">Rejected</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                        </Select>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                style={{ marginRight: 10 }}
                            >
                                Submit
                            </Button>
                            <Button onClick={handleClose} style={{ position: 'absolute', top: 20, right: 20 }}>
                                <Iconify icon="eva:close-fill" />
                            </Button>
                        </div>
                    </form>
                </Paper>
            </Modal>
        </Grid>
    );
};

export default LeavesViewTable;
