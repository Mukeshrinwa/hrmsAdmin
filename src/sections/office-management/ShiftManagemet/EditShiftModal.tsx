import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

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

interface EditShiftModalProps {
    open: boolean;
    onClose: () => void;
    onUpdateShift: (id: string, shiftData: any) => Promise<void>;
    shiftToEdit: ShiftData | null;
}

interface ShiftData {
    _id: string;
    name: string;
    start_time: string;
    end_time: string;
    breakDuration: number;
    workingDays: string[];
    lateThreshold: number;
    earlyCheckInAllowed: number;
    description: string;
    status: boolean;
}

const EditShiftModal: React.FC<EditShiftModalProps> = ({
    open,
    onClose,
    onUpdateShift,
    shiftToEdit
}) => {
    const [shiftData, setShiftData] = useState<{
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

    useEffect(() => {
        if (shiftToEdit) {
            setShiftData({
                name: shiftToEdit.name,
                start_time: shiftToEdit.start_time ? dayjs(shiftToEdit.start_time, "HH:mm") : null,
                end_time: shiftToEdit.end_time ? dayjs(shiftToEdit.end_time, "HH:mm") : null,
                breakDuration: shiftToEdit.breakDuration || 0,
                workingDays: shiftToEdit.workingDays || [],
                lateThreshold: shiftToEdit.lateThreshold || 0,
                earlyCheckInAllowed: shiftToEdit.earlyCheckInAllowed || 0,
                description: shiftToEdit.description,
                status: shiftToEdit.status
            });
        }
    }, [shiftToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setShiftData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setShiftData(prev => ({ ...prev, [name]: value }));
    };

    const handleTimeChange = (name: string) => (newValue: any) => {
        setShiftData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async () => {
        if (!shiftToEdit) return;

        setIsSubmitting(true);

        try {
            const formattedData = {
                name: shiftData.name,
                startTime: shiftData.start_time ? shiftData.start_time.format("HH:mm") : "",
                endTime: shiftData.end_time ? shiftData.end_time.format("HH:mm") : "",
                breakDuration: Number(shiftData.breakDuration),
                workingDays: shiftData.workingDays,
                lateThreshold: Number(shiftData.lateThreshold),
                earlyCheckInAllowed: Number(shiftData.earlyCheckInAllowed),
                description: shiftData.description,
                isActive: shiftData.status
            };

            await onUpdateShift(shiftToEdit._id, formattedData);
            onClose();
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Shift</DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        {/* Shift Name */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Shift Name</InputLabel>
                                <Select name="name" value={shiftData.name} onChange={handleSelectChange}>
                                    <MenuItem value="Morning Shift">Morning Shift</MenuItem>
                                    <MenuItem value="Evening Shift">Evening Shift</MenuItem>
                                    <MenuItem value="Night Shift">Night Shift</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Start / End Time */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid item xs={12} sm={6}>
                                <TimePicker
                                    label="Start Time"
                                    value={shiftData.start_time}
                                    onChange={handleTimeChange("start_time")}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TimePicker
                                    label="End Time"
                                    value={shiftData.end_time}
                                    onChange={handleTimeChange("end_time")}
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

                        {/* Early Check-in Allowed */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Early Check-in Allowed (min)"
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
                                    name="workingDays"
                                    value={shiftData.workingDays}
                                    onChange={handleSelectChange}
                                >
                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => (
                                        <MenuItem value={day} key={day}>
                                            {day}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                name="description"
                                value={shiftData.description}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Active Status */}
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="status"
                                        checked={shiftData.status}
                                        onChange={handleChange}
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    startIcon={<Iconify icon="eva:checkmark-outline" />}
                >
                    {isSubmitting ? "Updating..." : "Update Shift"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditShiftModal;
