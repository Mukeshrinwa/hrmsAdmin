import type { Data } from '@/src/Interface/policies';

import React, { useState, useEffect } from 'react';

import { Box, Modal, Stack, Button, TextField, Typography } from '@mui/material';

import usePoliciesApi from 'src/Api/policies/policiesApi';

interface EditPolicyModalProps {
  open: boolean;
  onClose: () => void;
  policy: Data | null;
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

const EditPolicyModal: React.FC<EditPolicyModalProps> = ({ open, onClose, policy, onUpdate }) => {
  const { updatePolicies } = usePoliciesApi();
  const [formData, setFormData] = useState<Data | null>(null);

  useEffect(() => {
    if (policy) {
      setFormData(policy);
    }
  }, [policy]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    if (formData) {
      const cleanedData = removeUnwantedProperties(formData, ['_id', 'createdAt', 'updatedAt', '__v']);
      await updatePolicies(formData._id, cleanedData);
      onUpdate();
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, width: 400 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Edit Policy
        </Typography>
        {formData && (
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Policy ID"
              value={formData.policy_id}
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              name="title"
              label="Title"
              value={formData.title}
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

export default EditPolicyModal;
