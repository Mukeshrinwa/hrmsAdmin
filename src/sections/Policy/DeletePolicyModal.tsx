import React from 'react';

import { Box, Stack, Modal, Button, Typography } from '@mui/material';

import usePoliciesApi from 'src/Api/policies/policiesApi';

interface DeletePolicyModalProps {
    open: boolean;
    onClose: () => void;
    policyId: string | null;
    onUpdate: () => void; 
}

const DeletePolicyModal: React.FC<DeletePolicyModalProps> = ({ open, onClose, policyId, onUpdate }) => {
    const { deletePolicies } = usePoliciesApi();

    const handleDelete = async () => {
        if (policyId) {
            await deletePolicies(policyId);
            onUpdate(); 
            onClose(); 
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ ...modalStyle, width: 400 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Delete Policy
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Are you sure you want to delete this policy?
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

export default DeletePolicyModal;
