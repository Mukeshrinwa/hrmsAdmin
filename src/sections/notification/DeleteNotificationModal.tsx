import React from 'react';

import { Box, Stack, Modal, Button, Typography } from '@mui/material';

import useAnnouncementsApi from 'src/Api/announcements/useAnnouncementsApi';

interface DeleteNotificationModalProps {
    open: boolean;
    onClose: () => void;
    announcementId: string | null;
    onUpdate: () => void;
}

const DeleteNotificationModal: React.FC<DeleteNotificationModalProps> = ({ open, onClose, announcementId, onUpdate }) => {
    const { deleteAnnouncement } = useAnnouncementsApi();

    const handleDelete = async () => {
        if (announcementId) {
            await deleteAnnouncement(announcementId);
            onUpdate();
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ ...modalStyle, width: 400 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Delete Announcement
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Are you sure you want to delete this announcement?
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

export default DeleteNotificationModal;
