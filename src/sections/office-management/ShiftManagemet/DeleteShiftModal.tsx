// DeleteShiftModal.tsx
import React from 'react';

import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@mui/material';

interface DeleteShiftModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteShiftModal: React.FC<DeleteShiftModalProps> = ({ open, onClose, onConfirm }) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this shift? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
      </DialogActions>
    </Dialog>
  );

export default DeleteShiftModal;
