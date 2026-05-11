// CollectAssetModal.tsx
import type { Dayjs } from 'dayjs';
import type {
    SelectChangeEvent
} from '@mui/material';
import type { Asset, ReturnAssetData } from 'src/Interface/asset-managementinterfaces';

import dayjs from 'dayjs';
import React, { useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
    Stack,
    Dialog,
    Button,
    Select,
    MenuItem,
    TextField,
    Typography,
    InputLabel,
    DialogTitle,
    FormControl,
    DialogContent,
    DialogActions
} from '@mui/material';

interface CollectAssetModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: ReturnAssetData) => void;
    selectedAsset: Asset | null;
}

const CollectAssetModal: React.FC<CollectAssetModalProps> = ({
    open,
    onClose,
    onConfirm,
    selectedAsset
}) => {
    const [returnData, setReturnData] = useState<ReturnAssetData>({
        actualReturnDate: dayjs().format('YYYY-MM-DD'),
        returnCondition: 'GOOD',
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setReturnData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            setReturnData(prev => ({
                ...prev,
                actualReturnDate: date.format('YYYY-MM-DD')
            }));
        }
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        setReturnData(prev => ({
            ...prev,
            returnCondition: e.target.value as string
        }));
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Collect Asset</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <Typography>
                        Confirm you have received the asset from the employee.
                    </Typography>
                    {selectedAsset && selectedAsset.assignedTo && (
                        <>
                            <TextField
                                label="Asset"
                                value={`${selectedAsset.name} (Serial: ${selectedAsset.serialNumber})`}
                                fullWidth
                                disabled
                            />
                            <TextField
                                label="Assigned To"
                                value={`${selectedAsset.assignedTo.first_name} ${selectedAsset.assignedTo.last_name}`}
                                fullWidth
                                disabled
                            />
                        </>
                    )}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <DatePicker
                                label="Return Date"
                                value={dayjs(returnData.actualReturnDate)}
                                onChange={handleDateChange}
                            />
                        </Stack>
                    </LocalizationProvider>

                    <FormControl fullWidth>
                        <InputLabel>Condition</InputLabel>
                        <Select
                            value={returnData.returnCondition}
                            label="Condition"
                            onChange={handleSelectChange}
                        >
                            <MenuItem value="NEW">New</MenuItem>
                            <MenuItem value="GOOD">Good</MenuItem>
                            <MenuItem value="FAIR">Fair</MenuItem>
                            <MenuItem value="POOR">Poor</MenuItem>
                            <MenuItem value="DAMAGED">Damaged</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Notes"
                        name="notes"
                        value={returnData.notes}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={() => onConfirm(returnData)}
                    variant="contained"
                    color="primary"
                >
                    Confirm Return
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CollectAssetModal;