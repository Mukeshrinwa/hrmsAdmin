import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    boxShadow: 24,
    p: 4,
    bgcolor: 'background.paper',
};

interface ConfirmationProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const DeletePayroll: React.FC<ConfirmationProps> = ({ open, onClose, onConfirm, title, message }) => (
    <Modal open={open} onClose={onClose}>
        <Paper sx={style}>
            <Typography variant="h6" component="h2" gutterBottom>
                {title}
            </Typography>
            <Typography sx={{ mt: 2 }}>{message}</Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} color="error" variant="outlined">Cancel</Button>
                <Button onClick={onConfirm} color="primary" variant="contained" sx={{ ml: 1 }}>Confirm</Button>
            </Box>
        </Paper>
    </Modal>
);

export default DeletePayroll;
