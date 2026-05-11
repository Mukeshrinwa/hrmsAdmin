import type { Dayjs } from 'dayjs';

import React, { useState } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Grid,
    Dialog,
    Button,
    Select,
    MenuItem,
    TextField,
    Typography,
    DialogTitle,
    FormControl,
    DialogContent,
    DialogActions
} from '@mui/material';

interface AssignAssetModalProps {
    open: boolean;
    onClose: () => void;
    onAssign: (data: {
        selectedAssetId: string;
        selectedEmployeeId: string;
        assignmentDate: string;
        expectedReturnDate?: string;
        notes: string;
    }) => void;
    unassignedAssets: Array<{
        _id: string;
        name: string;
        serialNumber: string;
    }>;
    employees: Array<{
        _id: string;
        first_name: string;
        last_name: string;
        employee_id: string;
    }>;
}

const AssignAssetModal = ({ 
    open, 
    onClose, 
    onAssign, 
    unassignedAssets, 
    employees 
}: AssignAssetModalProps) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [selectedAssetId, setSelectedAssetId] = useState('');
    const [assignmentDate, setAssignmentDate] = useState<Dayjs | null>(null);
    const [expectedReturnDate, setExpectedReturnDate] = useState<Dayjs | null>(null);
    const [assignmentNotes, setAssignmentNotes] = useState('');

    const handleAssign = () => {
        onAssign({
            selectedAssetId,
            selectedEmployeeId,
            assignmentDate: assignmentDate?.format('YYYY-MM-DD') || new Date().toISOString().split('T')[0],
            expectedReturnDate: expectedReturnDate?.format('YYYY-MM-DD'),
            notes: assignmentNotes
        });
        resetForm();
    };

    const resetForm = () => {
        setSelectedEmployeeId('');
        setSelectedAssetId('');
        setAssignmentDate(null);
        setExpectedReturnDate(null);
        setAssignmentNotes('');
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Assign Asset</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <Typography variant="subtitle2" gutterBottom>
                                Select Asset
                            </Typography>
                            <Select
                                value={selectedAssetId}
                                onChange={(e) => setSelectedAssetId(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select an asset
                                </MenuItem>
                                {unassignedAssets.map((asset) => (
                                    <MenuItem key={asset._id} value={asset._id}>
                                        {asset.name} ({asset.serialNumber})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <Typography variant="subtitle2" gutterBottom>
                                Select Employee
                            </Typography>
                            <Select
                                value={selectedEmployeeId}
                                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select an employee
                                </MenuItem>
                                {employees.map((employee) => (
                                    <MenuItem key={employee._id} value={employee._id}>
                                        {employee.first_name} {employee.last_name} ({employee.employee_id})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                            Assignment Date
                        </Typography>
                        <DatePicker
                            value={assignmentDate}
                            onChange={(newValue) => setAssignmentDate(newValue)}
                            format="YYYY-MM-DD"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                            Expected Return Date
                        </Typography>
                        <DatePicker
                            value={expectedReturnDate}
                            onChange={(newValue) => setExpectedReturnDate(newValue)}
                            format="YYYY-MM-DD"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                            Notes
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={assignmentNotes}
                            onChange={(e) => setAssignmentNotes(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button 
                    onClick={handleAssign} 
                    variant="contained" 
                    color="primary"
                    disabled={!selectedAssetId || !selectedEmployeeId}
                >
                    Assign
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignAssetModal;