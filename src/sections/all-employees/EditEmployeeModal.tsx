import type { SelectChangeEvent } from '@mui/material/Select';
import type { EditData, Department } from '@/src/Interface/all_employee.interface';

import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
    Grid,
    Dialog,
    Select,
    Button,
    MenuItem,
    TextField,
    InputLabel,
    Typography,
    DialogTitle,
    FormControl,
    Autocomplete,
    DialogContent,
    DialogActions,
} from '@mui/material';

import useShiftApi from 'src/Api/shift_management/shiftmanagenmetApi';
import useDepartmentsApi from 'src/Api/all_departments/useDepartmentsApi';
import OfficeManagementApi from 'src/Api/office_Management/OfficeManagementApi';

interface EditEmployeeModalProps {
    open: boolean;
    onClose: () => void;
    employee: EditData | null;
    onSave: (updatedEmployee: EditData) => void;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ open, onClose, employee, onSave }) => {
    const [formData, setFormData] = useState<EditData | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [officeLocations, setOfficeLocations] = useState<any[]>([]);
    const [shifts, setShifts] = useState<any[]>([]);
    const { fetchAllDepartments } = useDepartmentsApi();
    const { fetchofficeManagement } = OfficeManagementApi();
    const { fetchofficeShift } = useShiftApi();

    const employeeTypes = [
        { label: "Full Time", value: "FULL_TIME" },
        { label: "Part Time", value: "PART_TIME" },
        { label: "On Probation", value: "ON_PROBATION" },
        { label: "On Notice Period", value: "ON_NOTICE_PERIOD" },
    ];
    useEffect(() => {
        const loadData = async () => {
            try {
                const deptResponse = await fetchAllDepartments();
                if (deptResponse && Array.isArray(deptResponse.data)) {
                    setDepartments(deptResponse.data as Department[]);
                }

                const officeResponse = await fetchofficeManagement();
                if (officeResponse) {
                    setOfficeLocations(officeResponse);
                }

                const shiftResponse = await fetchofficeShift();
                if (shiftResponse && Array.isArray(shiftResponse)) {
                    setShifts(shiftResponse);
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        };

        if (open) {
            loadData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        if (employee) {
            setFormData({
                ...employee,
                reporting_manager_id: employee.reporting_manager_id || undefined,
                shift_id: employee.shift_id
                    ? (typeof employee.shift_id === 'string'
                        ? shifts.find(shift => shift._id === employee.shift_id) || undefined
                        : employee.shift_id)
                    : undefined,
                emergency_contact: employee.emergency_contact || {
                    name: '',
                    relationship: '',
                    phone: ''
                },
                address: employee.address || {
                    street: '',
                    city: '',
                    state: '',
                    country: '',
                },
                bank_details: employee.bank_details || {
                    bank_name: '',
                    account_number: '',
                    ifsc_code: ''
                }
            });
        }
    }, [employee, shifts]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => prev ? { ...prev, [name]: value } : null);
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        if (name) {
            setFormData((prev) => prev ? { ...prev, [name]: value } : null);
        }
    };

    const handleDepartmentChange = (event: any, value: Department | null) => {
        setFormData((prev) => {
            if (!prev) return null;

            const updatedData = {
                ...prev,
                department_id: value ? {
                    id: value._id,
                    _id: value._id,
                    name: value.name,
                    ...(value.department_id && { department_id: value.department_id })
                } : { id: '', _id: '', name: '' }
            };

            if (value && (!prev.department_id || value._id !== prev.department_id._id) && value.manager_id) {
                updatedData.reporting_manager_id = {
                    _id: value.manager_id,
                };
            }

            return updatedData;
        });
    };

    const handleOfficeChange = (event: any, value: any | null) => {
        setFormData((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                office_id: value ? {
                    _id: value._id,
                    name: value.name
                } : { _id: '', name: '' }
            };
        });
    };

    const handleShiftChange = (event: any, value: any | null) => {
        setFormData(prev => prev ? {
            ...prev,
            shift_id: value ? value.id : ""
        } : null);
    };


    const handleSave = () => {
        if (formData) {
            onSave(formData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogContent>
                {formData && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            {/* Personal Information Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="first_name"
                                    label="First Name"
                                    value={formData.first_name || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="last_name"
                                    label="Last Name"
                                    value={formData.last_name || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="email"
                                    label="Personal Email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    type="email"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="phone"
                                    label="Phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    type="tel"
                                    margin="normal"
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <DatePicker
                                    label="Date of Birth"
                                    value={formData.date_of_birth ? dayjs(formData.date_of_birth) : null}
                                    onChange={(newValue) => {
                                        setFormData(prev => ({
                                            ...prev!,
                                            date_of_birth: newValue ? newValue.format('YYYY-MM-DD') : ''
                                        }));
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            margin: 'normal'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        name="gender"
                                        value={formData.gender || ''}
                                        onChange={handleSelectChange}
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Marital Status</InputLabel>
                                    <Select
                                        name="marital_status"
                                        value={formData.marital_status || ''}
                                        onChange={handleSelectChange}
                                    >
                                        <MenuItem value="Single">Single</MenuItem>
                                        <MenuItem value="Married">Married</MenuItem>
                                        <MenuItem value="Divorced">Divorced</MenuItem>
                                        <MenuItem value="Widowed">Widowed</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Emergency Contact */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Emergency Contact</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Full Name"
                                    value={formData.emergency_contact?.name || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev!,
                                        emergency_contact: {
                                            ...prev?.emergency_contact!,
                                            name: e.target.value
                                        }
                                    }))}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Relationship"
                                    value={formData.emergency_contact?.relationship || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev!,
                                        emergency_contact: {
                                            ...prev?.emergency_contact!,
                                            relationship: e.target.value
                                        }
                                    }))}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Phone"
                                    value={formData.emergency_contact?.phone || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev!,
                                        emergency_contact: {
                                            ...prev?.emergency_contact!,
                                            phone: e.target.value
                                        }
                                    }))}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>

                            {/* Address */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Address</Typography>
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    label="City"
                                    value={formData.address?.city || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev!,
                                        address: {
                                            ...prev?.address!,
                                            city: e.target.value
                                        }
                                    }))}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="State"
                                    value={formData.address?.state || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev!,
                                        address: {
                                            ...prev?.address!,
                                            state: e.target.value
                                        }
                                    }))}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Country"
                                    value={formData.address?.country || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev!,
                                        address: {
                                            ...prev?.address!,
                                            country: e.target.value
                                        }
                                    }))}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>

                            {/* Professional Information Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Professional Information</Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="employee_id"
                                    label="Employee ID"
                                    value={formData.employee_id || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="company_email"
                                    label="Company Email"
                                    value={formData.company_email || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    type="email"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="position"
                                    label="Position"
                                    value={formData.position || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <DatePicker
                                    label="Date of Joining"
                                    value={formData.date_of_joining ? dayjs(formData.date_of_joining) : null}
                                    onChange={(newValue) => {
                                        setFormData(prev => ({
                                            ...prev!,
                                            date_of_joining: newValue ? newValue.format('YYYY-MM-DD') : ''
                                        }));
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            margin: 'normal'
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Department, Office, Shift */}
                            <Grid item xs={6}>
                                <Autocomplete
                                    options={departments}
                                    getOptionLabel={(option) => option.name}
                                    value={formData.department_id || null}
                                    onChange={handleDepartmentChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Department"
                                            fullWidth
                                            margin="normal"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    options={officeLocations}
                                    getOptionLabel={(option) => option.name}
                                    value={
                                        formData.office_id
                                            ? (typeof formData.office_id === 'string'
                                                ? officeLocations.find(office => office._id === formData.office_id) || null
                                                : formData.office_id)
                                            : null
                                    }
                                    onChange={handleOfficeChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Office Location"
                                            fullWidth
                                            margin="normal"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    options={shifts}
                                    getOptionLabel={(option) => option.name}
                                    value={shifts.find(shift => shift.id === formData.shift_id) || null}

                                    onChange={handleShiftChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Shift"
                                            fullWidth
                                            margin="normal"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Employee Type</InputLabel>
                                    <Select
                                        name="employee_type"
                                        value={formData.employee_type || ""}
                                        onChange={(e) => {
                                            setFormData(prev => prev ? {
                                                ...prev,
                                                employee_type: e.target.value
                                            } : null)
                                        }}
                                    >
                                        {employeeTypes.map((t) => (
                                            <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                            </Grid>

                            {/* Bank Details Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Bank Details</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Bank Name"
                                    value={formData.bank_details?.bank_name || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev!,
                                        bank_details: {
                                            ...prev?.bank_details!,
                                            bank_name: e.target.value
                                        }
                                    }))}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Account Number"
                                    value={formData.bank_details?.account_number || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev!,
                                        bank_details: {
                                            ...prev?.bank_details!,
                                            account_number: e.target.value
                                        }
                                    }))}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="IFSC Code"
                                    value={formData.bank_details?.ifsc_code || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev!,
                                        bank_details: {
                                            ...prev?.bank_details!,
                                            ifsc_code: e.target.value
                                        }
                                    }))}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditEmployeeModal;