import type { Dayjs } from 'dayjs';

import React, { useState } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Modal,
  Stack,
  Button,
  MenuItem,
  Checkbox,
  useTheme,
  TextField,
  Typography,
  useMediaQuery,
  FormControlLabel,
} from '@mui/material';

import trainingApi from 'src/Api/training/trainingApi';

/* ------------------------- Types ------------------------- */

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

/* ---------------------- Component ------------------------ */

const AddTrainingModal: React.FC<Props> = ({ open, onClose, onAdd }) => {
  const { addTraining } = trainingApi();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /* ---------------------- State ---------------------- */

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'ONLINE',
    level: 'BEGINNER',
    startDate: null as Dayjs | null,
    endDate: null as Dayjs | null,
    duration: '',
    maxEmployees: '',
    isMandatory: false,
    allowSelfEnrollment: true,
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
  });

  /* ---------------------- Handlers ---------------------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /* ---------------------- Validation ---------------------- */

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
      category: '',
      duration: '',
    };

    let valid = true;

    if (formData.title.trim().length < 3) {
      newErrors.title = 'Minimum 3 characters required';
      valid = false;
    }

    if (formData.description.trim().length < 10) {
      newErrors.description = 'Minimum 10 characters required';
      valid = false;
    }

    if (formData.category.trim().length < 2) {
      newErrors.category = 'Minimum 2 characters required';
      valid = false;
    }

    if (Number(formData.duration) < 0.5) {
      newErrors.duration = 'Minimum duration is 0.5 hour';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  /* ---------------------- Submit ---------------------- */

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      type: formData.type,
      level: formData.level,
      startDate: formData.startDate?.format('YYYY-MM-DD'),
      endDate: formData.endDate?.format('YYYY-MM-DD'),
      duration: Number(formData.duration),
      content: { materials: [] },
      requirements: {
        maxEmployees: Number(formData.maxEmployees) || 0,
        requiredRoles: [],
      },
      isMandatory: formData.isMandatory,
      allowSelfEnrollment: formData.allowSelfEnrollment,
    };

    await addTraining(payload);
    onAdd();
    onClose();
  };

  /* ---------------------- Styles ---------------------- */

  const modalStyle = {
    position: 'absolute' as const,
    top: isMobile ? "10%" : '50%',
    left: isMobile ? 0 : '50%',
    transform: isMobile ? 'none' : 'translate(-50%, -50%)',
    width: isMobile ? '100%' : 600,
    height: isMobile ? '80%' : 'auto',
    bgcolor: 'background.paper',
    borderRadius: isMobile ? 2 : 2,
    p: 3,
    overflowY: 'auto',
  };

  /* ---------------------- Render ---------------------- */

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h3" mb={2}>
          Add Training
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              required
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={isMobile ? 4 : 3}
              fullWidth
              required
            />

            <TextField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={!!errors.category}
              helperText={errors.category}
              fullWidth
              required
            />

            <TextField
              select
              label="Training Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              fullWidth
            >
              {['ONLINE', 'OFFLINE', 'HYBRID', 'SELF_PACED', 'INSTRUCTOR_LED'].map(
                (t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                )
              )}
            </TextField>

            <TextField
              select
              label="Level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              fullWidth
            >
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))}
            </TextField>

            {/* Date Pickers */}
            <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(v) =>
                  setFormData((p) => ({ ...p, startDate: v }))
                }
                slotProps={{ textField: { fullWidth: true } }}
              />

              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(v) =>
                  setFormData((p) => ({ ...p, endDate: v }))
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Stack>

            <TextField
              label="Duration (hours)"
              name="duration"
              type="number"
              inputProps={{ min: 0.5, step: 0.5 }}
              value={formData.duration}
              onChange={handleChange}
              error={!!errors.duration}
              helperText={errors.duration}
              fullWidth
              required
            />

            <TextField
              label="Max Employees"
              name="maxEmployees"
              type="number"
              value={formData.maxEmployees}
              onChange={handleChange}
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isMandatory}
                  name="isMandatory"
                  onChange={handleChange}
                />
              }
              label="Mandatory Training"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.allowSelfEnrollment}
                  name="allowSelfEnrollment"
                  onChange={handleChange}
                />
              }
              label="Allow Self Enrollment"
            />

            {/* Buttons */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ position: isMobile ? 'sticky' : 'static', bottom: 0 }}
            >
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmit} color="primary">
                Save
              </Button>
            </Stack>
          </Stack>
        </LocalizationProvider>
      </Box>
    </Modal>
  );
};

export default AddTrainingModal;
