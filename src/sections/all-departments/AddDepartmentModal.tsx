import React, { useState } from "react";

import {
  Box,
  Modal,
  Stack,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  borderRadius: "12px",
  p: 4,
  boxShadow: 24,
};

interface AddDepartmentModalProps {
  open: boolean;
  handleClose: () => void;
  handleAddDepartment: (
    name: string,
    description: string,
    departmentId: string
  ) => void;
}

export default function AddDepartmentModal({
  open,
  handleClose,
  handleAddDepartment,
}: AddDepartmentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const onSubmit = () => {
    if (!name.trim()) {
      alert("Department name is required");
      return;
    }

    handleAddDepartment(name, description, departmentId);

    // Reset form
    setName("");
    setDescription("");
    setDepartmentId("");

    // Close modal
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        {/* Heading */}
        <Typography variant="h6" fontWeight={600} mb={2}>
          Add New Department
        </Typography>

        {/* Form Fields */}
        <Stack spacing={2} mt={2} mb={3}>
          <TextField
            label="Department Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            label="Department ID (Optional)"
            fullWidth
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
          />
        </Stack>

        {/* Buttons */}
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>

          <Button
          color="primary"
            variant="contained"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
