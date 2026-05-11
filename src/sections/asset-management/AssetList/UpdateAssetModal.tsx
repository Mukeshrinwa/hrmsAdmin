
import React from 'react';

import {
    Box,
    Dialog,
    Button,
    MenuItem,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

interface UpdateAssetModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    selectedAsset: any;
}

const UpdateAssetModal: React.FC<UpdateAssetModalProps> = ({
    open,
    onClose,
    onSubmit,
    selectedAsset
}) => {
    const [formData, setFormData] = React.useState({
        name: '',
        status: '',
        condition: '',
        notes: ''
    });

    React.useEffect(() => {
        if (selectedAsset) {
            setFormData({
                name: selectedAsset.name || '',
                status: selectedAsset.status || 'AVAILABLE',
                condition: selectedAsset.condition || 'NEW',
                notes: selectedAsset.notes || ''
            });
        }
    }, [selectedAsset]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Update Asset</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Asset Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <TextField
                        select
                        fullWidth
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleSelectChange}
                        margin="normal"
                    >
                        {['AVAILABLE',  'RETIRED', 'LOST'].map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        label="Condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleSelectChange}
                        margin="normal"
                    >
                        {['NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED'].map((condition) => (
                            <MenuItem key={condition} value={condition}>
                                {condition}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Update Asset
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateAssetModal;