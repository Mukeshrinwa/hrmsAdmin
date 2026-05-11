// src/sections/officeManagement/DeleteLocationModal.tsx

import React from 'react';

import {
    Dialog,
    Button,
    Typography,
    IconButton,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface DeleteLocationModalProps {
    open: boolean;
    onClose: () => void;
    officeId: string;
    officeName: string;
    onDeleteSuccess: () => void;
    deleteofficeManagement: (id: string) => Promise<void>;
}

const DeleteLocationModal: React.FC<DeleteLocationModalProps> = ({
    open,
    onClose,
    officeId,
    officeName,
    onDeleteSuccess,
    deleteofficeManagement,
}) => {
    const handleDelete = async () => {
        try {
            await deleteofficeManagement(officeId);
            onDeleteSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to delete office location:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                Confirm Delete
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Iconify icon="mdi:close" />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete the location &quot;<strong>{officeName}</strong>&quot;?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="error" variant="contained" onClick={handleDelete}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteLocationModal;
