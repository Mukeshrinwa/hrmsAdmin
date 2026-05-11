import type { SelectChangeEvent } from '@mui/material';
import type { Data, Column } from '@/src/Interface/leaves.nterface';

import * as React from 'react';
import { useEffect, useReducer, useCallback } from 'react';

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
    { id: 'employeeName', label: 'Employee Name', minWidth: 170, align: 'left', },
    { id: 'applyingDate', label: 'Applying Date', minWidth: 170, align: 'center', },
    { id: 'leaveTypeName', label: 'Leave Type', minWidth: 100, align: 'right', },
    { id: 'duration', label: 'Duration', minWidth: 170, align: 'center', },
    { id: 'days', label: 'Days', minWidth: 170, align: 'center', },
    { id: 'status', label: 'Status', minWidth: 170, align: 'left', },
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
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    loading: boolean;
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
    | { type: 'SET_CURRENT_REJECT_ROW'; payload: Data | null }
    | { type: 'SET_SORT'; payload: { sortBy: string; sortDirection: 'asc' | 'desc' } }
    | { type: 'SET_LOADING'; payload: boolean };

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
    sortBy: '',
    sortDirection: 'asc',
    loading: false,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_OPEN': return { ...state, open: action.payload };
        case 'SET_PAGE': return { ...state, page: action.payload };
        case 'SET_ROWS_PER_PAGE': return { ...state, rowsPerPage: action.payload, page: 0 };
        case 'SET_SEARCH_VALUE': return { ...state, searchValue: action.payload, page: 0 };
        case 'SET_EXPORT_OPTION': return { ...state, exportOption: action.payload };
        case 'SET_TAB_INDEX': return { ...state, tabIndex: action.payload, page: 0 };
        case 'SET_FILTERED_ROWS': return { ...state, filteredRows: action.payload };
        case 'SET_LEAVE_REQUESTS': return { ...state, leaveRequests: action.payload };
        case 'SET_REVIEW_DATA': return { ...state, reviewData: action.payload };
        case 'SET_CURRENT_REJECT_ROW': return { ...state, currentRejectRow: action.payload };
        case 'SET_SORT':
            return {
                ...state,
                sortBy: action.payload.sortBy,
                sortDirection: action.payload.sortDirection,
            };
        case 'SET_LOADING': return { ...state, loading: action.payload };
        default: return state;
    }
};

const LeavesViewTable: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { fetchLeave, rejectLeave, approveLeave } = leavesApi();

    // Map API status to display status
    const getDisplayStatus = (apiStatus: string): string => {
        const statusMap: Record<string, string> = {
            'APPROVED': 'Approved',
            'PENDING': 'Pending',
            'REJECTED': 'Rejected',
            'CANCELLED': 'Cancelled'
        };
        return statusMap[apiStatus] || apiStatus;
    };

    // Get status for API from display status
    const getApiStatus = (displayStatus: string): string => {
        const statusMap: Record<string, string> = {
            'Approved': 'APPROVED',
            'Pending': 'PENDING',
            'Rejected': 'REJECTED',
            'Cancelled': 'CANCELLED'
        };
        return statusMap[displayStatus] || displayStatus;
    };

    // Get status for tab filtering
    const getStatusForTab = (tabIndex: number): string => {
        switch (tabIndex) {
            case 0: return 'APPROVED';
            case 1: return 'PENDING';
            case 2: return 'REJECTED';
            default: return '';
        }
    };

    const handleViewModeChange = useCallback(() => {
        let filtered: Data[];
        switch (state.tabIndex) {
            case 0:
                filtered = state.leaveRequests.filter((row) => getDisplayStatus(row.status) === 'Approved');
                break;
            case 1:
                filtered = state.leaveRequests.filter((row) => getDisplayStatus(row.status) === 'Pending');
                break;
            case 2:
                filtered = state.leaveRequests.filter((row) => getDisplayStatus(row.status) === 'Rejected');
                break;
            default:
                filtered = state.leaveRequests;
        }
        dispatch({ type: 'SET_FILTERED_ROWS', payload: filtered });
    }, [state.leaveRequests, state.tabIndex]);

    useEffect(() => { handleViewModeChange(); }, [state.leaveRequests, handleViewModeChange]);

    const displayedRows = state.filteredRows.filter((row) =>
        row._id.toLowerCase().includes(state.searchValue.toLowerCase()) ||
        (row.employeeName && row.employeeName.toLowerCase().includes(state.searchValue.toLowerCase()))
    );

    // Sorting logic
    const sortedRows = React.useMemo(() => {
        if (state.sortBy) {
            return [...displayedRows].sort((a, b) => {
                const aVal = a[state.sortBy as keyof Data];
                const bVal = b[state.sortBy as keyof Data];
                if (typeof aVal === 'string' && typeof bVal === 'string')
                    return state.sortDirection === 'asc'
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                if (typeof aVal === 'number' && typeof bVal === 'number')
                    return state.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
                return 0;
            });
        }
        // Default sort by applyingDate (most recent first)
        return [...displayedRows].sort((a, b) => {
            const dateA = new Date(a.appliedAt || a.createdAt || 0);
            const dateB = new Date(b.appliedAt || b.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
        });
    }, [displayedRows, state.sortBy, state.sortDirection]);

    const paginatedRows = sortedRows.slice(
        state.page * state.rowsPerPage,
        state.page * state.rowsPerPage + state.rowsPerPage
    );

    const handleChangePage = (event: unknown, newPage: number) => {
        dispatch({ type: 'SET_PAGE', payload: newPage });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    // Open modal for both approve and reject with current row
    const handleActionClick = (row: Data) => {
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
            const updatedRow = { ...state.currentRejectRow, status: getApiStatus(newStatus) };
            dispatch({ type: 'SET_CURRENT_REJECT_ROW', payload: updatedRow });
        }
    };

    const handleSortHeaderClick = (columnId: string) => {
        let newDirection: 'asc' | 'desc' = 'asc';
        if (state.sortBy === columnId && state.sortDirection === 'asc') newDirection = 'desc';
        dispatch({
            type: 'SET_SORT',
            payload: { sortBy: columnId, sortDirection: newDirection },
        });
    };

    // Handle submit from modal
    const handleSubmit = async () => {
        if (!state.currentRejectRow) return;

        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const newStatus = getDisplayStatus(state.currentRejectRow.status);
            const data = {
                comments: state.reviewData || (newStatus === 'Approved' ? 'Leave approved by admin' : 'Leave rejected by admin')
            };

            // Call appropriate API based on selected status
            if (newStatus === 'Approved') {
                await approveLeave(state.currentRejectRow._id, data);
            } else if (newStatus === 'Rejected') {
                await rejectLeave(state.currentRejectRow._id, data);
            }

            // Update local state
            const updatedRequests = state.leaveRequests.map((request) =>
                state.currentRejectRow && request._id === state.currentRejectRow._id
                    ? {
                        ...request,
                        status: state.currentRejectRow.status,
                        comments: data.comments
                    }
                    : request
            );

            dispatch({ type: 'SET_LEAVE_REQUESTS', payload: updatedRequests });

            handleClose();
        } catch (error) {
            console.error('Error updating leave:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const calculateDays = (startDate: string, endDate: string): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const formatDateToMonthDay = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    };

    const formatDuration = (startDate: string, endDate: string) => {
        const startFormatted = formatDateToMonthDay(startDate);
        const endFormatted = formatDateToMonthDay(endDate);
        return `${startFormatted} - ${endFormatted}`;
    };

    const formatApplyingDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get status based on current tab
                const statusForApi = getStatusForTab(state.tabIndex);

                // Fetch leave data with status filter
                const leaveData = await fetchLeave(statusForApi);

                if (leaveData && Array.isArray(leaveData.data)) {
                    const updatedLeaveData = leaveData.data.map((leave: any) => {
                        const days = calculateDays(leave.startDate, leave.endDate);
                        const duration = formatDuration(leave.startDate, leave.endDate);
                        const applyingDate = formatApplyingDate(leave.appliedAt || leave.createdAt);

                        // Check if employee_id is an object and has name properties
                        let employeeName = 'Loading...';
                        if (typeof leave.employee_id === 'object' && leave.employee_id !== null) {
                            employeeName = `${leave.employee_id.first_name || ''} ${leave.employee_id.last_name || ''}`.trim();
                        }

                        return {
                            ...leave,
                            _id: leave._id,
                            employeeName,
                            days,
                            duration,
                            applyingDate,
                            leaveTypeName: leave.leaveTypeName || 'N/A',
                            status: leave.status || 'PENDING',
                        };
                    });

                    dispatch({ type: 'SET_LEAVE_REQUESTS', payload: updatedLeaveData });
                } else if (leaveData && leaveData.data && leaveData.data.leaves) {
                    // Handle the nested structure from your API response
                    const { leaves } = leaveData.data;
                    const updatedLeaveData = leaves.map((leave: any) => {
                        const days = calculateDays(leave.startDate, leave.endDate);
                        const duration = formatDuration(leave.startDate, leave.endDate);
                        const applyingDate = formatApplyingDate(leave.appliedAt || leave.createdAt);

                        // Note: Your API response shows employeeId as string, not object with names
                        // You might need additional API call to get employee details
                        const employeeName = leave.employeeId || 'Employee';

                        return {
                            ...leave,
                            employeeName,
                            days,
                            duration,
                            applyingDate,
                            leaveTypeName: leave.leaveTypeName || 'N/A',
                            status: leave.status || 'PENDING',
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
    }, [state.tabIndex]);

    return (
        <Grid>
            <Tabs value={state.tabIndex} onChange={handleTabChange}>
                <Tab label="Approved Leave" />
                <Tab label="Pending Leave" />
                <Tab label="Rejected Leave" />
            </Tabs>
            <Paper sx={{
                p: 2,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                marginTop: '12px',
            }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <TextField
                                placeholder="Search by ID or Employee Name..."
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
                                {columns.map((column) => {
                                    const isSorted = state.sortBy === column.id;
                                    return (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, cursor: 'pointer', userSelect: 'none' }}
                                            onClick={() => handleSortHeaderClick(column.id)}
                                        >
                                            {column.label}
                                            {isSorted ? (state.sortDirection === 'asc' ? ' 🔼' : ' 🔽') : ''}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedRows.map((row) => {
                                const displayStatus = getDisplayStatus(row.status);
                                return (
                                    <TableRow key={row._id} hover>
                                        {columns.map((column) => (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.id === 'status' ? (
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        {displayStatus === 'Approved' && (
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
                                                                <Button
                                                                    onClick={() => handleActionClick(row)}
                                                                    size="small"
                                                                    sx={{ minWidth: 'auto', padding: '4px' }}
                                                                >
                                                                    <Iconify icon="eva:close-fill" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        {displayStatus === 'Pending' && (
                                                            <>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="primary"
                                                                    onClick={() => handleActionClick(row)}
                                                                    size="small"
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleActionClick(row)}
                                                                    size="small"
                                                                    sx={{ minWidth: 'auto', padding: '4px' }}
                                                                >
                                                                    <Iconify icon="eva:close-fill" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        {displayStatus === 'Rejected' && (
                                                            <>
                                                                <span
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
                                                                    onClick={() => handleActionClick(row)}
                                                                    size="small"
                                                                >
                                                                    Approve
                                                                </Button>
                                                            </>
                                                        )}
                                                        {displayStatus === 'Cancelled' && (
                                                            <span
                                                                style={{
                                                                    color: '#666',
                                                                    background: '#f5f5f5',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '6px',
                                                                }}
                                                            >
                                                                Cancelled
                                                            </span>
                                                        )}
                                                    </Stack>
                                                ) : column.id === 'days' ? (
                                                    row.days || row.totalDays || 'N/A'
                                                ) : (
                                                    row[column.id as keyof Data] || 'N/A'
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
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

            {/* Modal for both approve and reject */}
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
                    <h2 id="edit-modal-title">
                        {state.currentRejectRow
                            ? getDisplayStatus(state.currentRejectRow.status) === 'Pending'
                                ? 'Approve/Reject Leave'
                                : 'Update Leave Status'
                            : 'Leave Action'
                        }
                    </h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Enter reason (optional)"
                            value={state.reviewData}
                            onChange={handleReviewChange}
                            style={{
                                width: '100%',
                                marginBottom: '15px',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontFamily: 'inherit'
                            }}
                        />

                        <Select
                            value={state.currentRejectRow ? getDisplayStatus(state.currentRejectRow.status) : ''}
                            onChange={handleStatusChange}
                            displayEmpty
                            fullWidth
                            sx={{ marginBottom: '25px' }}
                        >
                            <MenuItem value="" disabled>Select Status</MenuItem>
                            <MenuItem value="Approved">Approve</MenuItem>
                            <MenuItem value="Rejected">Reject</MenuItem>
                            {getDisplayStatus(state.currentRejectRow?.status || '') === 'Pending' && (
                                <MenuItem value="Pending">Keep Pending</MenuItem>
                            )}
                        </Select>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, gap: '10px' }}>
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                disabled={state.loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={state.loading}
                            >
                                {state.loading ? 'Processing...' : 'Submit'}
                            </Button>
                            <Button
                                onClick={handleClose}
                                sx={{ position: 'absolute', top: 10, right: 10, minWidth: 'auto' }}
                                disabled={state.loading}
                            >
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