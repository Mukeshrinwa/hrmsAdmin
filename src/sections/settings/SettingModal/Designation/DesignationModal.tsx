import type { DesignationModalProps } from '@/src/Interface/designation_table.interface';

import React from 'react';

import {
  Box,
  Modal,
  Button,
  TextField,
  IconButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';


const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '12px',
  boxShadow: 24,
  p: 3,
  maxHeight: '90vh',
  overflowY: 'auto',
};
const DesignationModal: React.FC<DesignationModalProps> = ({
  editmodal,
  open,
  handleClose,
  setDesignation,
  designation,
}) => {
  const handleDesignationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesignation(e.target.value);
  };
  return (
    <Modal
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
    >
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '30px', marginBottom: '20px' }}>
          <h2 id="child-modal-title">  {editmodal ? 'Edit Designation' : 'Add New Designation'}</h2>

          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              // position: 'absolute',
              // right: 8,
              // top: 8,
              color: (theme) => theme.palette.grey[500],
              border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
            }}
          >
            <Iconify icon="clarity:close-line" />
          </IconButton>
        </Box>
        <Box sx={{ mt: '10px', mb: '10px', pb: '10px', pt: '10px', display: 'flex', flexDirection: 'column', gap: '20px', borderBottom: '1px solid whitesmoke', borderTop: '1px solid whitesmoke' }} >

          <TextField
            sx={{ width: '100%' }}
            value={designation}
            onChange={handleDesignationChange}
            placeholder="Designation Name"
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'right' }}>
          <Button variant="contained" color='primary' autoFocus onClick={handleClose}>
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DesignationModal;
