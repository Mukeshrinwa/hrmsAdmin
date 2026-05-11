import type { Dayjs } from 'dayjs';

import React, { useState } from 'react';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    Box,
    Grid,
    Dialog,
    Button,
    Switch,
    Select,
    MenuItem,
    TextField,
    InputLabel,
    DialogTitle,
    FormControl,
    DialogContent,
    DialogActions,
    FormControlLabel
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface AddShiftModalProps {
    open: boolean;
    onClose: () => void;
    onAddShift: (shiftData: any) => Promise<void>;
}

const AddShiftModal: React.FC<AddShiftModalProps> = ({ open, onClose, onAddShift }) => {

    const [shiftData, setShiftData] = useState<{
        branchId: string;
        name: string;
        start_time: Dayjs | null;
        end_time: Dayjs | null;
        breakDuration: number;
        workingDays: string[];
        lateThreshold: number;
        earlyCheckInAllowed: number;
        description: string;
        status: boolean;
    }>({
        branchId: "6914e5e9e101edc475d7674c",
        name: '',
        start_time: null,
        end_time: null,
        breakDuration: 0,
        workingDays: [],
        lateThreshold: 0,
        earlyCheckInAllowed: 0,
        description: '',
        status: true
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setShiftData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTimeChange = (name: string) => (newValue: any) => {
        setShiftData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleWorkingDaysChange = (e: any) => {
        const {value} = e.target;
        setShiftData(prev => ({
            ...prev,
            workingDays: value
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const formattedData = {
                branchId: shiftData.branchId,
                name: shiftData.name,
                startTime: shiftData.start_time ? shiftData.start_time.format('HH:mm') : '',
                endTime: shiftData.end_time ? shiftData.end_time.format('HH:mm') : '',
                breakDuration: Number(shiftData.breakDuration),
                workingDays: shiftData.workingDays,
                description: shiftData.description,
                lateThreshold: Number(shiftData.lateThreshold),
                earlyCheckInAllowed: Number(shiftData.earlyCheckInAllowed),
                isActive: shiftData.status
            };

            await onAddShift(formattedData);

            onClose();

            setShiftData({
                branchId: "6914e5e9e101edc475d7674c",
                name: '',
                start_time: null,
                end_time: null,
                breakDuration: 0,
                workingDays: [],
                lateThreshold: 0,
                earlyCheckInAllowed: 0,
                description: '',
                status: true
            });

        } catch (error) {
            console.error('Error adding shift:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Shift</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>

                        {/* Shift Name */}
                        <Grid item xs={12}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Shift Name</InputLabel>
                                    <Select
                                        name="name"
                                        value={shiftData.name}
                                        onChange={(e) =>
                                            setShiftData(prev => ({
                                                ...prev,
                                                name: e.target.value
                                            }))
                                        }
                                    >
                                        <MenuItem value="Morning Shift">Morning Shift</MenuItem>
                                        <MenuItem value="Evening Shift">Evening Shift</MenuItem>
                                        <MenuItem value="Night Shift">Night Shift</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                        </Grid>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid item xs={12} sm={6}>
                                <TimePicker
                                    label="Start Time"
                                    value={shiftData.start_time}
                                    onChange={handleTimeChange('start_time')}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TimePicker
                                    label="End Time"
                                    value={shiftData.end_time}
                                    onChange={handleTimeChange('end_time')}
                                />
                            </Grid>
                        </LocalizationProvider>

                        {/* Break Duration */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Break Duration (min)"
                                name="breakDuration"
                                type="number"
                                value={shiftData.breakDuration}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Late Threshold */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Late Threshold (min)"
                                name="lateThreshold"
                                type="number"
                                value={shiftData.lateThreshold}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Early Check-In */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Early Check-In Allowed (min)"
                                name="earlyCheckInAllowed"
                                type="number"
                                value={shiftData.earlyCheckInAllowed}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Working Days */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Working Days</InputLabel>
                                <Select
                                    multiple
                                    value={shiftData.workingDays}
                                    onChange={handleWorkingDaysChange}
                                >
                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => (
                                        <MenuItem key={day} value={day}>{day}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={shiftData.description}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />
                        </Grid>

                        {/* Status */}
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="status"
                                        checked={shiftData.status}
                                        onChange={handleChange}
                                        color="primary"
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
                    Cancel
                </Button>

                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={
                        isSubmitting ||
                        !shiftData.name ||
                        !shiftData.start_time ||
                        !shiftData.end_time
                    }
                    startIcon={<Iconify icon="eva:checkmark-outline" />}
                >
                    {isSubmitting ? 'Saving...' : 'Save Shift'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddShiftModal;
