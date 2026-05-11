import React from "react";

import {
  Box,
  Dialog,
  Button,
  Divider,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import { Iconify } from "src/components/iconify";

import RejectExpenseModal from "./RejectExpenseModal";
import ApproveExpenseModal from "./ApproveExpenseModal";

interface ExpenseInfoProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

export default function ExpenseInfoModal({ open, onClose, data }: ExpenseInfoProps) {
  const [openApprove, setOpenApprove] = React.useState(false);
  const [openReject, setOpenReject] = React.useState(false);

  if (!data) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "18px",
            paddingBottom: 2,
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "22px",
            paddingY: 3,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          Expense Info
          <IconButton onClick={onClose} sx={{ position: "absolute", right: 20, top: 20 }}>
            <Iconify icon="solar:close-circle-bold" width={26} />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ paddingX: 4, paddingTop: 3 }}>
          {/* Section: Employee Details */}
          <Typography
            sx={{
              fontWeight: 600,
              mb: 1,
              fontSize: "14px",
              color: "#374151",
            }}
          >
            Employee Details
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns="repeat(4,1fr)"
            gap={3}
            mb={3}
            sx={{ fontSize: "15px" }}
          >
            <InfoBox label="Employee" value={data.employeeName || "N/A"} />
            <InfoBox label="Employee Code" value={data.employeeCode || "N/A"} />
            <InfoBox label="Branch" value="Mumbai" />
            <InfoBox label="Department" value="Sales" />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Section: Expense Details */}
          <Typography
            sx={{
              fontWeight: 600,
              mb: 1,
              fontSize: "14px",
              color: "#374151",
            }}
          >
            Expense Details
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns="repeat(4,1fr)"
            gap={3}
            mb={3}
            sx={{ fontSize: "15px" }}
          >
            <InfoBox label="Category" value={data.category} />
            <InfoBox label="Expense Type" value={data.expenseType} />
            <InfoBox label="Amount" value={`₹${data.amount}`} />
            <InfoBox
              label="Expense Date"
              value={new Date(data.expenseDate).toLocaleDateString()}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Buttons */}
          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button
              variant="outlined"
              onClick={() => setOpenReject(true)}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                px: 4,
                py: 1.2,
              }}
            >
              Reject
            </Button>

            <Button
              variant="contained"
              onClick={() => setOpenApprove(true)}
              sx={{
                background: "#00796B",
                borderRadius: "10px",
                textTransform: "none",
                px: 4,
                py: 1.2,
              }}
            >
              Approve
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Approve Modal */}
      <ApproveExpenseModal
        open={openApprove}
        onClose={() => setOpenApprove(false)}
        expenseId={data.expenseId}
      />

      {/* Reject Modal */}
      <RejectExpenseModal
        open={openReject}
        onClose={() => setOpenReject(false)}
        expenseId={data.expenseId}
      />
    </>
  );
}

/* Small Component to Avoid Repeating - Clean UI */
function InfoBox({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <Box>
      <Typography sx={{ fontSize: "13px", color: "#6B7280" }}>{label}</Typography>
      <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
}
