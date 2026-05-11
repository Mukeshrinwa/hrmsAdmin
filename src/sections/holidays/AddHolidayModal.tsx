import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Box, Grid, Modal, Button, TextField, Typography, Autocomplete } from '@mui/material';

import holidaysApi from 'src/Api/holidays/holidaysApi';

interface AddHolidayModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: () => void;
}

const AddHolidayModal: React.FC<AddHolidayModalProps> = ({ open, onClose, onAdd }) => {
    const { addHolidays, fetchAllEmployees } = holidaysApi();
    const [employees, setEmployees] = useState<{ _id: string; first_name: string; last_name: string }[]>([]);
    const [holiday, setHoliday] = useState({
        employee_id: '',
        benefit_type: '',
        provider: '',
        policy_number: '',
        coverage_amount: 0,
        start_date: dayjs().format('YYYY-MM-DD'), 
        end_date: dayjs().format('YYYY-MM-DD'),   
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHoliday({ ...holiday, [name]: name === 'coverage_amount' ? +value : value });
    };

    const handleDateChange = (name: string, newValue: dayjs.Dayjs | null) => {
        if (newValue) {
            setHoliday({
                ...holiday,
                [name]: newValue.format('YYYY-MM-DD') 
            });
        }
    };

    const handleAdd = async () => {
        try {
            const holidayData = {
                ...holiday,
                start_date: holiday.start_date, 
                end_date: holiday.end_date,  
                coverage_amount: Number(holiday.coverage_amount)
            };

            await addHolidays(holidayData);
            onAdd();
            onClose();
        } catch (error) {
            console.error('Error adding holiday:', error);
        }
    };

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const employeeData = await fetchAllEmployees();
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
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Add New Holiday
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={employees}
                            getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Employee"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                            onChange={(event, newValue) => {
                                setHoliday({ ...holiday, employee_id: newValue?._id || '' });
                            }}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Benefit Type"
                            name="benefit_type"
                            value={holiday.benefit_type}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Provider"
                            name="provider"
                            value={holiday.provider}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Policy Number"
                            name="policy_number"
                            value={holiday.policy_number}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Coverage Amount"
                            name="coverage_amount"
                            type="number"
                            value={holiday.coverage_amount}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
                                value={dayjs(holiday.start_date)}
                                onChange={(newValue) => handleDateChange('start_date', newValue)}
                                format="YYYY-MM-DD"
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="End Date"
                                value={dayjs(holiday.end_date)}
                                onChange={(newValue) => handleDateChange('end_date', newValue)}
                                format="YYYY-MM-DD"
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} color="secondary" sx={{ mr: 2 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAdd}
                        variant="contained"
                        color="primary"
                        disabled={!holiday.employee_id || !holiday.start_date || !holiday.end_date}
                    >
                        Add Holiday
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddHolidayModal;