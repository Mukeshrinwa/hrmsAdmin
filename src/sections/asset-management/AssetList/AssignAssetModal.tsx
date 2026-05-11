import type { Dayjs } from 'dayjs';
import type { Asset, Employee } from 'src/Interface/asset-managementinterfaces';

import React from 'react';
import dayjs from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Stack, Dialog, Button, MenuItem, TextField, DialogTitle, FormControl, DialogContent, DialogActions } from '@mui/material';

interface AssignAssetModalProps {
    open: boolean;
    onClose: () => void;
    onAssign: () => void;
    selectedAsset: Asset | null;
    employees: Employee[];
    assignmentForm: {
        assignedTo: string;
        assignmentDate: string;
        expectedReturnDate: string;
        notes: string;
    };
    onAssignmentChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onDateChange: (name: string, value: Dayjs | null) => void;
}

const AssignAssetModal: React.FC<AssignAssetModalProps> = ({
    open,
    onClose,
    onAssign,
    selectedAsset,
    employees,
    assignmentForm,
    onAssignmentChange,
    onDateChange
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
            '& .MuiDialog-paper': {
                width: '100%',
                maxWidth: '500px',
                borderRadius: '12px',
            }
        }}
    >
        <DialogTitle>Assign Asset</DialogTitle>
        <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
                {selectedAsset && (
                    <TextField
                        label="Assigning"
                        value={selectedAsset ? `${selectedAsset.assetName} (${selectedAsset.serialNumber})` : ''}
                        disabled
                        fullWidth
                    />
                )}

                <FormControl fullWidth>
                    <TextField
                        select
                        label="Assign To"
                        name="assignedTo"
                        value={assignmentForm.assignedTo}
                        onChange={onAssignmentChange}
                        required
                    >
                        {employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.id}>
                                {employee.firstName} {employee.lastName} ({employee.employeeId})
                            </MenuItem>
                        ))}

                    </TextField>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Assignment Date"
                        value={dayjs(assignmentForm.assignmentDate)}
                        onChange={(value) => onDateChange('assignmentDate', value)}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Expected Return Date"
                        value={dayjs(assignmentForm.expectedReturnDate)}
                        onChange={(value) => onDateChange('expectedReturnDate', value)}
                        slotProps={{ textField: { fullWidth: true } }}
                        minDate={dayjs(assignmentForm.assignmentDate)}
                    />
                </LocalizationProvider>

                <TextField
                    label="Notes"
                    name="notes"
                    value={assignmentForm.notes}
                    onChange={onAssignmentChange}
                    multiline
                    rows={3}
                    fullWidth
                />
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="inherit">
                Cancel
            </Button>
            <Button
                onClick={onAssign}
                variant="contained"
                color="primary"
                disabled={!assignmentForm.assignedTo}
            >
                Assign
            </Button>
        </DialogActions>
    </Dialog>
);

export default AssignAssetModal;