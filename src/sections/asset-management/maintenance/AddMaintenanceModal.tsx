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
    InputLabel,
    DialogTitle,
    FormControl,
    DialogContent,
    DialogActions
} from '@mui/material';

interface AddMaintenanceModalProps {
    open: boolean;
    onClose: () => void;
    onAddMaintenance: (_id: string, data: {
        date: string;
        description: string;
        cost: number;
        performedBy: string;
        nextMaintenanceDate?: string;
    }) => void;
    assets: Array<{
        _id: string;
        name: string;
        serialNumber: string;
    }>;
}

const AddMaintenanceModal = ({ 
    open, 
    onClose, 
    onAddMaintenance, 
    assets, 
}: AddMaintenanceModalProps) => {
    const [selectedAssetId, setSelectedAssetId] = useState('');
    const [date, setDate] = useState<Dayjs | null>(null);
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState<number>(0);
    const [performedBy, setPerformedBy] = useState('');
    const [nextMaintenanceDate, setNextMaintenanceDate] = useState<Dayjs | null>(null);

    const handleAddMaintenance = () => {
        if (!selectedAssetId || !date) return;
        
        onAddMaintenance(selectedAssetId, {
            date: date.format('YYYY-MM-DD'),
            description,
            cost,
            performedBy,
            nextMaintenanceDate: nextMaintenanceDate?.format('YYYY-MM-DD')
        });
    };

    const resetForm = () => {
        setSelectedAssetId('');
        setDate(null);
        setDescription('');
        setCost(0);
        setPerformedBy('');
        setNextMaintenanceDate(null);
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Maintenance</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="asset-select-label">Select Asset</InputLabel>
                            <Select
                                labelId="asset-select-label"
                                value={selectedAssetId}
                                onChange={(e) => setSelectedAssetId(e.target.value)}
                                label="Select Asset"
                            >
                                {assets.map((asset) => (
                                    <MenuItem key={asset._id} value={asset._id}>
                                        {asset.name} ({asset.serialNumber})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                  
                    <Grid item xs={12} md={6}>
                        <DatePicker
                            label="Maintenance Date"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            format="YYYY-MM-DD"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DatePicker
                            label="Next Maintenance Date"
                            value={nextMaintenanceDate}
                            onChange={(newValue) => setNextMaintenanceDate(newValue)}
                            format="YYYY-MM-DD"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Cost"
                            fullWidth
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(Number(e.target.value))}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Performed By"
                            fullWidth
                            value={performedBy}
                            onChange={(e) => setPerformedBy(e.target.value)}
                            required
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button 
                    onClick={handleAddMaintenance} 
                    variant="contained" 
                    color="primary"
                    disabled={!selectedAssetId || !date || !description || !performedBy}
                >
                    Add Maintenance
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMaintenanceModal;