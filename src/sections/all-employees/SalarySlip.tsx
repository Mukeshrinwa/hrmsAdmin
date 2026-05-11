import type { MouseEvent, ChangeEvent } from 'react';
import type { Data, Column, EditData } from 'src/Interface/payrollview.interface';

import * as XLSX from 'xlsx';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';

import usePayrollApi from 'src/Api/all_payroll/usePayrollApi';

import { Iconify } from 'src/components/iconify';

const columns: Column[] = [
    // { id: 'month', label: 'Month', align: 'center' },
    { id: 'basic_salary', label: 'Monthly Salary', align: 'center' },
    { id: 'deductions', label: 'Deduction', align: 'center' },
    { id: 'net_salary', label: 'Total Pay', align: 'center' },
    { id: 'action', label: 'Action', align: 'center' },
];

const initialState = {
    rows: [] as Data[],
    page: 0,
    rowsPerPage: 10,
    open: false,
    addOpen: false,
    searchValue: '',
    editData: null as EditData | null,
    newPayrollData: {
        _id: '',
        employee_id: '',
        month: '',
        bonuses: 0,
        net_salary: 0,
        basic_salary: 0,
        deductions: 0,
    } as EditData,
    confirmDeleteOpen: false,
    deleteEmployeeId: null as string | null,
    viewModalOpen: false,
    viewModalData: null as Data | null,
};

type Action =
    | { type: 'SET_ROWS'; payload: Data[] }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_ROWS_PER_PAGE'; payload: number }
    | { type: 'SET_OPEN'; payload: boolean }
    | { type: 'SET_ADD_OPEN'; payload: boolean }
    | { type: 'SET_SEARCH_VALUE'; payload: string }
    | { type: 'SET_EDIT_DATA'; payload: EditData | null }
    | { type: 'SET_FORM_DATA'; payload: Partial<EditData> }
    | { type: 'SET_VIEW_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_VIEW_MODAL_DATA'; payload: Data | null };

const reducer = (state: typeof initialState, action: Action): typeof initialState => {
    switch (action.type) {
        case 'SET_ROWS':
            return { ...state, rows: action.payload };
        case 'SET_PAGE':
            return { ...state, page: action.payload };
        case 'SET_ROWS_PER_PAGE':
            return { ...state, rowsPerPage: action.payload, page: 0 };
        case 'SET_OPEN':
            return { ...state, open: action.payload };
        case 'SET_ADD_OPEN':
            return { ...state, addOpen: action.payload };
        case 'SET_SEARCH_VALUE':
            return { ...state, searchValue: action.payload };
        case 'SET_EDIT_DATA':
            return { ...state, editData: action.payload };
        case 'SET_FORM_DATA':
            return { ...state, newPayrollData: { ...state.newPayrollData, ...action.payload } };
        case 'SET_VIEW_MODAL_OPEN':
            return { ...state, viewModalOpen: action.payload };
        case 'SET_VIEW_MODAL_DATA':
            return { ...state, viewModalData: action.payload };
        default:
            return state;
    }
};

const SalarySlip = () => {
    const { updatePayroll, fetchsalaryShlipByid, fetchPdfShlipByid } = usePayrollApi();
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const { id } = useParams<{ id: string }>();
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleOpen = (rowData: Data) => {
        const editData: EditData = {
            _id: rowData._id,
            employee_id: rowData.employee_id._id,
            month: rowData.month,
            bonuses: rowData.bonuses,
            net_salary: rowData.net_salary,
            basic_salary: rowData.basic_salary,
            deductions: rowData.deductions,
            payment_status: rowData.payment_status,
            hourly_pay: 0,
            overtime_pay: 0
        };
        dispatch({ type: 'SET_EDIT_DATA', payload: editData });
        dispatch({ type: 'SET_OPEN', payload: true });
    };

    const handleViewOpen = (rowData: Data) => {
        dispatch({ type: 'SET_VIEW_MODAL_DATA', payload: rowData });
        dispatch({ type: 'SET_VIEW_MODAL_OPEN', payload: true });
    };

    const handleViewClose = () => {
        dispatch({ type: 'SET_VIEW_MODAL_OPEN', payload: false });
    };

    const handleClose = () => {
        dispatch({ type: 'SET_OPEN', payload: false });
    };

    const handleChangePage = (_event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        dispatch({ type: 'SET_PAGE', payload: newPage });
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_ROWS_PER_PAGE', payload: +event.target.value });
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { id: fieldId, value } = event.target;
        const updatedValue = ['bonuses', 'net_salary', 'basic_salary', 'deductions'].includes(fieldId)
            ? Number(value)
            : value;

        if (state.editData) {
            dispatch({ type: 'SET_EDIT_DATA', payload: { ...state.editData, [fieldId]: updatedValue } });
        } else {
            dispatch({ type: 'SET_FORM_DATA', payload: { ...state.newPayrollData, [fieldId]: updatedValue } });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!state.editData) return;

        try {
            await updatePayroll(state.editData._id, state.editData);
            loadPayrollData();
        } finally {
            handleClose();
        }
    };
    const handlePdfDownload = async (employeeId: string) => {
        try {
            const response = await fetchPdfShlipByid(employeeId,);
            if (!response?.url) {
                throw new Error("No PDF URL found in response");
            }

            const newWindow = window.open(response.url, '_blank');

            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                const link = document.createElement('a');
                link.href = response.url;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (errr) {
            console.error("PDF Download Error:", errr);
        }
    };

    const handleExportAll = () => {
        const allData = state.rows.map((row: Data) => Object.values(row));
        const header = Object.keys(state.rows[0]);
        const worksheetData = [header, ...allData];
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'All Data');
        XLSX.writeFile(workbook, 'all_payroll_data.xlsx');
    };

    // const handleMonthChange = (newValue: Dayjs | null) => {
    //     const month = newValue ? newValue.format('YYYY-MM') : '';
    //     if (state.editData) {
    //         dispatch({ type: 'SET_EDIT_DATA', payload: { ...state.editData, month } });
    //     } else {
    //         dispatch({ type: 'SET_FORM_DATA', payload: { ...state.newPayrollData, month } });
    //     }
    // };

    const loadPayrollData = async () => {
        if (id) {
            setLoading(true);
            setError(null);
            try {
                const payrollData = await fetchsalaryShlipByid(id);

                if (!payrollData || (Array.isArray(payrollData) && payrollData.length === 0)) {
                    dispatch({ type: 'SET_ROWS', payload: [] });
                    setError('No payroll data found for this employee.');
                } else {
                    dispatch({ type: 'SET_ROWS', payload: Array.isArray(payrollData) ? payrollData : [payrollData] });
                }
            } catch (err: any) {
                if (err?.response?.status === 404) {
                    setError('No payroll data found for this employee.');
                } else {
                    setError('Something went wrong while fetching payroll data.');
                }
                dispatch({ type: 'SET_ROWS', payload: [] });
            } finally {
                setLoading(false);
            }
        }
    };

    React.useEffect(() => {
        loadPayrollData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <Paper component="div" sx={{ p: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
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
                <Grid item xs={8} container justifyContent="flex-end" gap={2}>
                    <Button variant="contained" color="primary" startIcon={<Iconify icon="raphael:export" />} onClick={handleExportAll}>
                        Export All
                    </Button>
                </Grid>
            </Grid>

            <TableContainer sx={{ marginTop: '16px' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" style={{ color: "red" }}>
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : state.rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    No payroll data found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            state.rows
                                .slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage)
                                .map((row) => (
                                    <TableRow key={row._id}>
                                        {/* <TableCell align="center">{row.month}</TableCell> */}
                                        <TableCell align="center">{row.basic_salary}</TableCell>
                                        <TableCell align="center">{row.deductions}</TableCell>
                                        <TableCell align="center">{row.net_salary}</TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleViewOpen(row)}>
                                                <Iconify icon="raphael:view" />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpen(row)}>
                                                <Iconify icon="eva:edit-2-outline" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handlePdfDownload(row.employee_id._id,)}
                                                title="Download Payslip"
                                            >
                                                <Iconify icon="la:cloud-download-alt" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
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

            {/* Edit modal */}
            <Modal open={state.open} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <Paper sx={{
                        p: 4,
                        width: 400,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: 24
                    }}>
                        <Stack spacing={2}>
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Month"
                                    value={state.editData?.month ? dayjs(state.editData.month) : null}
                                    onChange={handleMonthChange}
                                />
                            </LocalizationProvider> */}
                            <TextField
                                id="bonuses"
                                label="Bonuses"
                                type="number"
                                value={state.editData?.bonuses || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                id="net_salary"
                                label="Net Salary"
                                type="number"
                                value={state.editData?.net_salary || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                id="basic_salary"
                                label="Basic Salary"
                                type="number"
                                value={state.editData?.basic_salary || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                id="deductions"
                                label="Deductions"
                                type="number"
                                value={state.editData?.deductions || ''}
                                onChange={handleInputChange}
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Update
                            </Button>
                        </Stack>
                    </Paper>
                </form>
            </Modal>

            {/* View Salary Slip Modal */}
            <Modal open={state.viewModalOpen} onClose={handleViewClose}>
                <Paper sx={{
                    p: 4,
                    width: 500,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: 24
                }}>
                    <Stack spacing={3}>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Salary Slip</h2>

                        {state.viewModalData && (
                            <>
                                <div style={{ marginBottom: '20px' }}>
                                    <h3>Salary </h3>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Full</th>
                                                <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Actual</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>BASIC</td>
                                                <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>₹ {state.viewModalData.basic_salary.toFixed(2)}</td>
                                                <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>₹ {state.viewModalData.basic_salary.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>HRA</td>
                                                <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>₹ {(state.viewModalData.basic_salary * 0.5).toFixed(2)}</td>
                                                <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>₹ {(state.viewModalData.basic_salary * 0.4).toFixed(2)}</td>
                                            </tr>

                                            <tr>
                                                <td style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Special Allowance</td>
                                                <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>₹ {(state.viewModalData.basic_salary * 0.3).toFixed(2)}</td>
                                                <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>₹ {(state.viewModalData.basic_salary * 0.3).toFixed(2)}</td>
                                            </tr>
                                            <tr style={{ fontWeight: 'bold' }}>
                                                <td style={{ textAlign: 'left', padding: '8px', borderTop: '1px solid #ddd' }}>Total Earnings:</td>
                                                <td style={{ textAlign: 'right', padding: '8px', borderTop: '1px solid #ddd' }}>
                                                    ₹ {(state.viewModalData.basic_salary + (state.viewModalData.basic_salary * 0.5) + 1600 + 1250 + (state.viewModalData.basic_salary * 0.3)).toFixed(2)}
                                                </td>
                                                <td style={{ textAlign: 'right', padding: '8px', borderTop: '1px solid #ddd' }}>
                                                    ₹ {(state.viewModalData.basic_salary + (state.viewModalData.basic_salary * 0.4) + 1600 + 1250 + (state.viewModalData.basic_salary * 0.3)).toFixed(2)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div>
                                    <h3>Deductions</h3>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Professional Tax</td>
                                                <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>₹ 00</td>
                                            </tr>
                                            <tr style={{ fontWeight: 'bold' }}>
                                                <td style={{ textAlign: 'left', padding: '8px', borderTop: '1px solid #ddd' }}>Total Deductions:</td>
                                                <td style={{ textAlign: 'right', padding: '8px', borderTop: '1px solid #ddd' }}>₹ {state.viewModalData.deductions.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ marginTop: '20px', fontWeight: 'bold', textAlign: 'right' }}>
                                    Net Pay: ₹ {state.viewModalData.net_salary.toFixed(2)}
                                </div>
                            </>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleViewClose}
                            style={{ marginTop: '20px' }}
                        >
                            Close
                        </Button>
                    </Stack>
                </Paper>
            </Modal>
        </Paper>
    );
};

export default SalarySlip;