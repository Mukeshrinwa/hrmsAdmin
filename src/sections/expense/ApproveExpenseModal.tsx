import React from "react";

import {
  Box,
  Dialog,
  Button,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
} from "@mui/material";

interface ApproveExpenseProps {
  open: boolean;
  onClose: () => void;
  expenseId: string;
}

export default function ApproveExpenseModal({ open, onClose, expenseId }: ApproveExpenseProps) {
  const [comment, setComment] = React.useState("");

  const handleApprove = () => {
    console.log("Approved:", expenseId, comment);
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
        Approve Expense
      </DialogTitle>

      <DialogContent sx={{ paddingX: 4, paddingBottom: 3 }}>
        <Typography textAlign="center" color="text.secondary" mb={3}>
          Are you sure you want to approve this expense?
          <br />
          This will move it to the next approval level.
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{
            mb: 3,
            background: "#F8F9FA",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />

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
              background: "#00796B",
              textTransform: "none",
              paddingY: 1.2,
            }}
            onClick={handleApprove}
          >
            Approve
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
