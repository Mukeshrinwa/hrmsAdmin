import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Box, Grid, Modal, Button, TextField, Typography, Autocomplete } from '@mui/material';

import policiesApi from 'src/Api/policies/policiesApi';

interface AddPolicyModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: () => void;
}

const AddPolicyModal: React.FC<AddPolicyModalProps> = ({ open, onClose, onAdd }) => {
    const { addPolicies, fetchAllDepartment } = policiesApi();
    const [employees, setEmployees] = useState<{ department_id: string; }[]>([]);
    const [policy, setPolicy] = useState({
        policy_id: '',
        title: '',
        description: '',
        effective_date: dayjs().format('YYYY-MM-DD'),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPolicy({ ...policy, [name]: value });
    };

    const handleDateChange = (newValue: dayjs.Dayjs | null) => {
        if (newValue) {
            setPolicy({ ...policy, effective_date: newValue.format('YYYY-MM-DD') });
        }
    };

    const handleAdd = async () => {
        try {
            const payload = {
                policy_id: policy.policy_id,
                title: policy.title,
                description: policy.description,
                effective_date: policy.effective_date,
            };
            await addPolicies(payload);
            onAdd();
            onClose();
        } catch (error) {
            console.error('Error adding policy:', error);
        }
    };

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const employeeData = await fetchAllDepartment();
                setEmployees(employeeData);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        loadEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                borderRadius: '12px',
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h6" component="h2">
                    Add New Policy
                </Typography>
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={employees}
                            getOptionLabel={(option) => `${option.department_id} `}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Policy Id"
                                    variant="outlined"
                                />
                            )}
                            onChange={(event, newValue) => {
                                setPolicy({ ...policy, policy_id: newValue?.department_id || '' });
                            }}
                            isOptionEqualToValue={(option, value) => option.department_id === value.department_id}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={policy.title}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={policy.description}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Effective Date"
                                value={dayjs(policy.effective_date)}
                                onChange={handleDateChange}
                            // renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} color="secondary" sx={{ mr: 2 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} variant="contained" color="primary">
                        Add Policy
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddPolicyModal;
