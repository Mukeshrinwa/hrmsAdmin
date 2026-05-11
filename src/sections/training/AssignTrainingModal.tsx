import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Grid, Modal, Button, TextField, Typography, Autocomplete } from '@mui/material';

import trainingApi from 'src/Api/training/trainingApi';

interface AddTrainingModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const AssignTrainingModal: React.FC<AddTrainingModalProps> = ({ open, onClose, onAdd }) => {
  const { addTraining, fetchAllEmployees } = trainingApi();
  const [employees, setEmployees] = useState<{ _id: string; first_name: string; last_name: string }[]>([]);
  const [training, setTraining] = useState({
    program_id: '',
    name: '',
    description: '',
    trainer_id: '', // This will store the _id of the selected trainer
    start_date: null as string | null,
    end_date: null as string | null,
    participants: [] as string[], // List of user_ids of participants
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTraining({ ...training, [name]: value });
  };

  const handleDateChange = (date: Dayjs | null, field: string) => {
    setTraining({
      ...training,
      [field]: date ? date.format('YYYY-MM-DD') : null
    });
  };

  const handleAdd = async () => {
    if (!training.program_id || !training.name || !training.trainer_id || !training.start_date || !training.end_date) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      await addTraining(training);
      onAdd();
      onClose(); 
    } catch (error) {
      console.error('Error adding training:', error);
    }
  };

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeeData = await fetchAllEmployees();
        setEmployees(employeeData);  // Storing the employees with _id
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        borderRadius: '12px',
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2">Add New Training</Typography>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={employees}
              getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Trainer"
                  variant="outlined"
                />
              )}
              onChange={(event, newValue) => {
                setTraining({ ...training, trainer_id: newValue?._id || '' });  
              }}
              isOptionEqualToValue={(option, value) => option._id === value._id}  
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Program Id"
              name="program_id"
              value={training.program_id}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Training Name"
              name="name"
              value={training.name}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} display="flex" justifyContent="center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={training.start_date ? dayjs(training.start_date) : null}
                onChange={(newValue) => handleDateChange(newValue, 'start_date')}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} display="flex" justifyContent="center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={training.end_date ? dayjs(training.end_date) : null}
                onChange={(newValue) => handleDateChange(newValue, 'end_date')}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={employees}
              getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Participants"
                  variant="outlined"
                />
              )}
              onChange={(event, newValue) => {
                setTraining({ ...training, participants: newValue.map((emp) => emp._id) }); 
              }}
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={training.description}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} color="secondary" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleAdd} variant="contained" color="primary">
            Add Training
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignTrainingModal;
