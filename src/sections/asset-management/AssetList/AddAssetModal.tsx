import type { SelectChangeEvent } from '@mui/material';

import dayjs from 'dayjs';
import React from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Grid,
    Stack,
    Dialog,
    Button,
    Select,
    MenuItem,
    TextField,
    Typography,
    DialogTitle,
    FormControl,
    DialogContent,
    DialogActions,
    InputAdornment
} from '@mui/material';

interface AddAssetModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    formData: {
        departmentId: unknown;
        branchId: unknown;
        name: string;
        category: string;
        assetType: string; // ✨ NEW FIELD
        serialNumber: string;
        purchaseDate: string;
        warrantyExpiry: string;
        status: string;
        purchasePrice: number;
        currentValue: number;
        condition: string;
        location: string;
        notes: string;
    };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (e: SelectChangeEvent<string>) => void;
    onDateChange: (name: string, value: any) => void;
}

const AddAssetModal = ({
    open,
    onClose,
    onSubmit,
    formData,
    onInputChange,
    onSelectChange,
    onDateChange
}: AddAssetModalProps) => (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Asset</DialogTitle>
        <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>

                {/* Asset Name */}
                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Asset Name
                    </Typography>
                    <TextField
                        name="name"
                        value={formData.name}
                        onChange={onInputChange}
                        placeholder="e.g., Dell Laptop"
                    />
                </FormControl>

                {/* CATEGORY DROPDOWN */}
                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Category
                    </Typography>
                    <Select
                        name="category"
                        value={formData.category}
                        onChange={onSelectChange}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Select Category</MenuItem>
                        <MenuItem value="IT Equipment">IT Equipment</MenuItem>
                        <MenuItem value="Office Furniture">Office Furniture</MenuItem>
                        <MenuItem value="Electronics">Electronics</MenuItem>
                        <MenuItem value="Accessories">Accessories</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>

                {/* ASSET TYPE DROPDOWN */}
                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Asset Type
                    </Typography>
                    <Select
                        name="assetType"
                        value={formData.assetType}
                        onChange={onSelectChange}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Select Asset Type</MenuItem>
                        <MenuItem value="LAPTOP">LAPTOP</MenuItem>
                        <MenuItem value="MOBILE">MOBILE</MenuItem>
                        <MenuItem value="TABLET">TABLET</MenuItem>
                        <MenuItem value="MONITOR">MONITOR</MenuItem>
                        <MenuItem value="KEYBOARD">KEYBOARD</MenuItem>
                        <MenuItem value="MOUSE">MOUSE</MenuItem>
                        <MenuItem value="HEADPHONE">HEADPHONE</MenuItem>
                        <MenuItem value="OTHER">OTHER</MenuItem>
                    </Select>
                </FormControl>

                {/* SERIAL NUMBER */}
                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Serial Number
                    </Typography>
                    <TextField
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={onInputChange}
                        placeholder="e.g., LAP1212"
                    />
                </FormControl>

                {/* DATES */}
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Purchase Date"
                                    value={formData.purchaseDate ? dayjs(formData.purchaseDate) : null}
                                    onChange={(value) => onDateChange('purchaseDate', value)}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Warranty Expiry"
                                    value={formData.warrantyExpiry ? dayjs(formData.warrantyExpiry) : null}
                                    onChange={(value) => onDateChange('warrantyExpiry', value)}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* PRICES */}
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <Typography variant="subtitle2" gutterBottom>
                                Purchase Price
                            </Typography>
                            <TextField
                                name="purchasePrice"
                                type="number"
                                value={formData.purchasePrice}
                                onChange={onInputChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                }}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <Typography variant="subtitle2" gutterBottom>
                                Current Value
                            </Typography>
                            <TextField
                                name="currentValue"
                                type="number"
                                value={formData.currentValue}
                                onChange={onInputChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                {/* CONDITION */}
                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Condition
                    </Typography>
                    <Select
                        name="condition"
                        value={formData.condition}
                        onChange={onSelectChange}
                        displayEmpty
                    >
                        <MenuItem value="NEW">NEW</MenuItem>
                        <MenuItem value="GOOD">GOOD</MenuItem>
                        <MenuItem value="FAIR">FAIR</MenuItem>
                        <MenuItem value="POOR">POOR</MenuItem>
                        <MenuItem value="DAMAGED">DAMAGED</MenuItem>
                    </Select>
                </FormControl>

                {/* LOCATION */}
                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Location
                    </Typography>
                    <TextField
                        name="location"
                        value={formData.location}
                        onChange={onInputChange}
                        placeholder="e.g., Office, IT Room"
                    />
                </FormControl>

                {/* BRANCH ID */}
                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Branch ID
                    </Typography>
                    <TextField
                        name="branchId"
                        value={formData.branchId}
                        onChange={onInputChange}
                        placeholder="Enter Branch ID"
                    />
                </FormControl>

                {/* DEPT ID */}
                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Department ID
                    </Typography>
                    <TextField
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={onInputChange}
                        placeholder="Enter Department ID"
                    />
                </FormControl>

                {/* NOTES */}
                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Notes
                    </Typography>
                    <TextField
                        name="notes"
                        value={formData.notes}
                        onChange={onInputChange}
                        multiline
                        rows={3}
                        placeholder="Add notes"
                    />
                </FormControl>

            </Stack>
        </DialogContent>

        <DialogActions>
            <Button onClick={onClose} color="inherit">
                Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={onSubmit}>
                Submit
            </Button>
        </DialogActions>
    </Dialog>
);

export default AddAssetModal;
