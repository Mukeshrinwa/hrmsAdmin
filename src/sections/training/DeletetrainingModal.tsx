import React from 'react';

import { Box, Stack, Modal, Button, Typography } from '@mui/material';

import trainingApi from 'src/Api/training/trainingApi';

interface DeleteTrainingModalProps {
    open: boolean;
    onClose: () => void;
    trainingId: string | null;
    onUpdate: () => void;
}

const DeleteTrainingModal: React.FC<DeleteTrainingModalProps> = ({ open, onClose, trainingId, onUpdate }) => {
    const { deleteTraining } = trainingApi();

    const handleDelete = async () => {
        if (trainingId) {
            await deleteTraining(trainingId);
            onUpdate();
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ ...modalStyle, width: 400 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Delete Training
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Are you sure you want to delete this training program?
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

export default DeleteTrainingModal;
