import type { Data } from '@/src/Interface/training.interface';

import React, { useState, useEffect } from 'react';

import { Box, Grid, Modal, Stack, Button, TextField, Typography, Autocomplete, } from '@mui/material';

import trainingApi from 'src/Api/training/trainingApi';

interface EditTrainingModalProps {
  open: boolean;
  onClose: () => void;
  training: Data | null;
  onUpdate: () => void;
}

const removeUnwantedProperties = (obj: any, properties: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (!properties.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

const EditTrainingModal: React.FC<EditTrainingModalProps> = ({ open, onClose, training, onUpdate }) => {
  const { updateTraining, fetchAllEmployees } = trainingApi();
  const [employees, setEmployees] = useState<{ user_id: string; first_name: string; last_name: string; }[]>([]);
  const [formData, setFormData] = useState<Data | null>(null);

  useEffect(() => {
    if (training) {
      setFormData({
        ...training,
        participants: training.participants.map((p: any) =>
          typeof p === 'string'
            ? employees.find((emp) => emp.user_id === p) || p
            : p
        ),
      });
    }
    // eslint-disable-next-line
  }, [training, employees]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeeData = await fetchAllEmployees();
        setEmployees(employeeData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleParticipantsChange = (event: any, newValue: any[]) => {
    if (formData) {
      setFormData({ ...formData, participants: newValue });
    }
  };
  const handleSubmit = async () => {
    if (formData) {
      const cleanedData = removeUnwantedProperties(
        {
          ...formData,
          trainer_id: formData.trainer_id && formData.trainer_id._id ? formData.trainer_id._id : formData.trainer_id,
          participants: Array.isArray(formData.participants)
            ? formData.participants.map((p: any) => (p._id ? p._id : p))
            : [],
        },
        ['_id', 'end_date', 'start_date', 'createdAt', 'updatedAt', '__v']
      );
      await updateTraining(formData._id, cleanedData);
      onUpdate();
      onClose();
    }
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, width: 400 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Edit Training
        </Typography>
        {formData && (
          <Stack spacing={2}>
            <TextField
              fullWidth
              name="program_id"
              label="Program ID"
              value={formData.program_id}
              onChange={handleChange}
            />
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={employees}
                getOptionLabel={(option) =>
                  option.first_name && option.last_name
                    ? `${option.first_name} ${option.last_name}`
                    : ''
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Participants"
                    variant="outlined"
                  />
                )}
                value={formData.participants.filter((p: any) => p && p.user_id)}
                onChange={handleParticipantsChange}
                isOptionEqualToValue={(option, value) => option.user_id === value.user_id}
              />
            </Grid>
            <TextField
              fullWidth
              name="name"
              label="Program Name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Update
              </Button>
              <Button variant="outlined" color="secondary" onClick={onClose}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}
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

export default EditTrainingModal;
