import type { EditData, Department } from 'src/Interface/all_department.interface';

import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { Box, Stack, Modal, Button, TextField, Typography, IconButton } from '@mui/material';

import useDepartmentsApi from 'src/Api/all_departments/useDepartmentsApi';

import { Iconify } from 'src/components/iconify';

interface DepartmentBoxProps {
  department: Department;
  onDelete: (id: string) => Promise<void>;
  onUpdate: () => void;
}

export function DepartmentBox({ department, onDelete, onUpdate }: DepartmentBoxProps) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [name, setName] = useState(department.name);
  const [description, setDescription] = useState(department.description || '');
  const navigate = useNavigate();
  const { updateDepartments, } = useDepartmentsApi();

  const handleEditClick = () => {
    setOpenEditModal(true);
  };

  const handleDeleteClick = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedDepartment: EditData = { name, description };
      await updateDepartments(department.id as string, updatedDepartment);
      handleCloseEditModal();
      onUpdate(); // Trigger the department list to reload
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(department.id as string);
      handleCloseDeleteModal();
      onUpdate(); // Trigger the department list to reload
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  return (
    <Box
      sx={{
        p: '10px',
        height: 'auto',
        borderRadius: 2,
        border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
      }}
    >
      <Stack
        direction={{ xs: 'row', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        gap="10px"
        sx={{ borderBottom: '1px solid #A2A1A833', pb: '10px' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'left',
            gap: '2px',
          }}
        >
          <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
            {department.name}
          </Typography>
          <Typography sx={{ color: '#A2A1A8', fontSize: '14px', fontWeight: 300 }}>
            {/* {/ {department.memberCount} Member /} */}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={handleEditClick}>
            <Iconify icon="eva:edit-2-outline" />
          </IconButton>
          <IconButton onClick={handleDeleteClick}>
            <Iconify icon="weui:delete-outlined" />
          </IconButton>
          <Button
            onClick={() => navigate(`/departments/single-departments?id=${department.id}`)}
          >
            View All
          </Button>
        </Stack>
      </Stack>

      <Stack
        direction={{ xs: 'row', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        gap="10px"
        sx={{
          mt: '2px',
          ':hover': { background: 'rgba(162, 161, 168, 0.05)', cursor: 'pointer' },
          p: '5px',
          borderRadius: '5px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'left',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid red',
            }}
          >
            {/* {/ {department.initials} /} */}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'left',
              gap: '2px',
            }}
          >
            <Typography sx={{ fontSize: '16px', fontWeight: 300 }}>
              {department.name}
            </Typography>
            <Typography sx={{ color: '#A2A1A8', fontSize: '12px', fontWeight: 300 }}>
              {/* {/ {department.memberCount} Member /} */}
            </Typography>
          </Box>
        </Box>
        <Iconify icon="formkit:right" />
      </Stack>

      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-department-modal"
        aria-describedby="edit-department-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="edit-department-modal" variant="h6" component="h2">
            Edit Department
          </Typography>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
            multiline
            rows={3}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button onClick={handleCloseEditModal}>Cancel</Button>
            <Button color='primary' onClick={handleSaveEdit} variant="contained">
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* {/ Delete Modal /} */}
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 380,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "12px",
            p: 4,
            textAlign: "center",
          }}
        >
          {/* Title */}
          <Typography variant="h6" fontWeight={600} mb={1}>
            Delete Department
          </Typography>

          {/* Description */}
          <Typography variant="body1" color="text.secondary" mb={3}>
            Are you sure you want to delete this department?
            <br /> This action cannot be undone.
          </Typography>

          {/* Buttons */}
          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button
              variant="outlined"
              onClick={handleCloseDeleteModal}
              sx={{ width: "48%" }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{ width: "48%" }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
}
