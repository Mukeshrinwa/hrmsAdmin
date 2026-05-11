import React from 'react';

import { Dialog, Button, Typography, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface DeleteAssetModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAssetModal: React.FC<DeleteAssetModalProps> = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Delete Asset</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete this asset? This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color="error"
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteAssetModal;