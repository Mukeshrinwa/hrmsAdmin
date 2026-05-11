import type { Data } from '@/src/Interface/notification.interface';

import React, { useState, useEffect } from 'react';

import { Box, Modal, Stack, Button, TextField, Typography, Autocomplete } from '@mui/material';

import useDepartmentsApi from 'src/Api/all_departments/useDepartmentsApi';
import useAnnouncementsApi from 'src/Api/announcements/useAnnouncementsApi';

interface EditNotificationModalProps {
  open: boolean;
  onClose: () => void;
  announcement: Data | null;
  onUpdate: () => void;
}



const removeUnwantedProperties = (obj: any, properties: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (!properties.includes(key)) {
      if (key === 'author_id' && obj[key] && typeof obj[key] === 'object') {
        newObj[key] = obj[key]._id; 
      } else {
        newObj[key] = obj[key];
      }
    }
  });
  return newObj;
};



const EditNotificationModal: React.FC<EditNotificationModalProps> = ({ open, onClose, announcement, onUpdate }) => {
  const { updateAnnouncement } = useAnnouncementsApi();
  const { fetchAllDepartments } = useDepartmentsApi();
  const [departments, setDepartments] = useState<any[]>([]);
  const [formData, setFormData] = useState<Data | null>(null);

  useEffect(() => {
    if (announcement) {
      setFormData(announcement);
    }
  }, [announcement]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    if (formData) {
      const cleanedData = removeUnwantedProperties(formData, ['_id', 'createdAt', 'updatedAt', '__v']);
      await updateAnnouncement(formData._id, cleanedData);
      onUpdate();
      onClose();
    }
  };

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const departmentData = await fetchAllDepartments();
        setDepartments(departmentData.data); // Assuming the data is in the 'data' property
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    loadDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, width: 400 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Edit Notification
        </Typography>
        {formData && (
          <Stack spacing={2}>
            <TextField
              fullWidth
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              name="content"
              label="Content"
              value={formData.content}
              onChange={handleChange}
              multiline
              rows={4}
            />
            <Autocomplete
              multiple
              options={departments}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Audience (Departments)"
                  variant="outlined"
                />
              )}
              value={departments.filter(dept => formData.audience.includes(dept._id))}
              onChange={(event, newValue) => {
                setFormData({ ...formData, audience: newValue.map((dept) => dept._id) });
              }}
              isOptionEqualToValue={(option, value) => option._id === value._id}
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

export default EditNotificationModal;