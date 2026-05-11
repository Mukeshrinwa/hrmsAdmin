import React, { useState } from "react";

import {
  Box,
  Dialog,
  Button,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
} from "@mui/material";

interface RejectExpenseProps {
  open: boolean;
  onClose: () => void;
  expenseId: string;
}

export default function RejectExpenseModal({ open, onClose, expenseId }: RejectExpenseProps) {
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleReject = () => {
    console.log("Rejected:", expenseId, reason, file);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          paddingBottom: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "20px",
          textAlign: "center",
          paddingTop: 3,
        }}
      >
        Reject Expense
      </DialogTitle>

      <DialogContent sx={{ paddingX: 4, paddingBottom: 3 }}>
        <Typography textAlign="center" color="text.secondary" mb={3}>
          Rejecting this expense will stop the approval workflow.
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{
            mb: 2,
            background: "#F8F9FA",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            paddingY: 1.2,
            mb: 3,
          }}
        >
          {file ? file.name : "Choose file"}
          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </Button>

        <Box display="flex" gap={2}>
          <Button
            fullWidth
            variant="outlined"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              paddingY: 1.2,
            }}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            variant="contained"
            sx={{
              borderRadius: "10px",
              background: "#D32F2F",
              textTransform: "none",
              paddingY: 1.2,
            }}
            onClick={handleReject}
          >
            Reject
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
