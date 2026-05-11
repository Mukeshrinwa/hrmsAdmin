import React from 'react';

import {Box, Stack ,Modal,  Button, Typography, } from '@mui/material';

import useHolidaysApi from 'src/Api/holidays/holidaysApi';

interface DeleteHolidayModalProps {
    open: boolean;
    onClose: () => void;
    holidayId: string | null;
    onUpdate: () => void; // Added onUpdate prop
}

const DeleteHolidayModal: React.FC<DeleteHolidayModalProps> = ({ open, onClose, holidayId, onUpdate }) => {
    const { deleteHolidays } = useHolidaysApi();

    const handleDelete = async () => {
        if (holidayId) {
            await deleteHolidays(holidayId);
            onUpdate(); // Refresh the data after deletion
            onClose(); // Close the modal after deleting
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ ...modalStyle, width: 400 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Delete Holiday
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Are you sure you want to delete this holiday?
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleDelete}>
                        Delete
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 24,
    p: 4,
};

export default DeleteHolidayModal;
