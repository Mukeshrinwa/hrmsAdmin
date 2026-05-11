import type { DeleteEmployeeProps } from '@/src/Interface/all_employee.interface';

import * as React from 'react';

import { Button, Dialog, Typography, DialogTitle, DialogActions, DialogContent } from '@mui/material';

const DeleteEmployeeModal: React.FC<DeleteEmployeeProps> = ({ open, onClose, onDelete }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
            <Typography>Are you sure you want to delete this employee?</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary">
                Cancel
            </Button>
            <Button onClick={onDelete} color="primary">
                Delete
            </Button>
        </DialogActions>
    </Dialog>
);

export default DeleteEmployeeModal;
