import type { DesignationModalProps } from '@/src/Interface/shift_table.interface';

import React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import {
  Box,
  Modal,
  Stack,
  Button,
  TextField,
  IconButton,
  Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const ShiftModal: React.FC<DesignationModalProps> = ({
  editmodal,
  open,
  handleClose,
  start,
  shift,
  end,
  punch,
  fullTime,
  halfTime,
  graceTime,
  setStart,
  setEnd,
  setShift,
  setFullTime,
  setHalfTime,
  setGraceTime,
  setPunch,
}) =>
(
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="shift-modal-title"
    aria-describedby="shift-modal-description"
  >
    <Box sx={modalStyle}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
      }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          {editmodal ? 'Edit Shift' : 'Add New Shift'}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <Iconify icon="clarity:close-line" width={20} />
        </IconButton>
      </Box>

      {/* Form Content */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        py: 2,
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        {/* Shift Name and Start Time */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            label="Shift Name"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Shift Start"
              value={start}
              onChange={(newValue) => setStart(newValue)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              slotProps={{
                textField: {
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Stack>

        {/* Shift End and Auto Punch Out */}
        <Stack direction="row" spacing={2} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Shift End"
              value={end}
              onChange={(newValue) => setEnd(newValue)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              slotProps={{
                textField: {
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Auto Punch Out"
              value={punch}
              onChange={(newValue) => setPunch(newValue)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              slotProps={{
                textField: {
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Stack>

        {/* Full Day and Half Day Hours */}
        <Stack direction="row" spacing={2} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Full day hours (minutes)"
              value={fullTime}
              onChange={(newValue) => setFullTime(newValue)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              slotProps={{
                textField: {
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Half day hours (minutes)"
              value={halfTime}
              onChange={(newValue) => setHalfTime(newValue)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              slotProps={{
                textField: {
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Stack>

        {/* Grace Time */}
        <Box sx={{ width: '50%' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Grace time (minutes)"
              value={graceTime}
              onChange={(newValue) => setGraceTime(newValue)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              slotProps={{
                textField: {
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          color='primary'
          sx={{
            px: 3,
            py: 1,
            textTransform: 'none',
            fontSize: '1rem',
          }}
          onClick={handleClose}
        >
          {editmodal ? 'Update Shift' : 'Add Shift'}
        </Button>
      </Box>
    </Box>
  </Modal>
);


export default ShiftModal;