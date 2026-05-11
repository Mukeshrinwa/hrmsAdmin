import React, { useState, useEffect } from "react";

import {
  Box,
  Card,
  Table,
  Paper,
  Button,
  TableRow,
  TextField,
  TableHead,
  TableBody,
  TableCell,
  Typography,
  Pagination,
  TableContainer,
} from "@mui/material";

import { DashboardContent } from 'src/layouts/dashboard';
import useExpensesApi from 'src/Api/expenses/useExpensesApi';

import { Iconify } from "src/components/iconify";
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ExpenseInfoModal from "./ExpenseInfoModal";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING_MANAGER_APPROVAL":
    case "PENDING":
      return "#f5a623";
    case "REJECTED":
      return "#ff4d4f";
    case "APPROVED":
      return "#52c41a";
    case "REIMBURSED":
      return "#1677ff";
    default:
      return "#999";
  }
};

export default function ExpenseView() {
  const { fetchAllExpenses } = useExpensesApi();

  const [expensesData, setExpensesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  // ---------------------------
  // 🔥 API CALL – get expenses
  // ---------------------------
  const loadExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetchAllExpenses();

      if (response?.data?.expenses) {
        setExpensesData(response.data.expenses);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Expense Detail"
        links={[
          { name: 'Expense' },
          { name: 'Expense Detail' },
        ]}
      />

      <Box mt={2}>
        {/* Top Bar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            placeholder="Search"
            size="small"
            sx={{ width: 250, background: "#fff", borderRadius: "8px" }}
          />

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:filter-linear" width={20} />}
              sx={{ borderRadius: "8px", textTransform: "none" }}
            >
              Filter
            </Button>

            <Button
              variant="contained"
              sx={{
                borderRadius: "8px",
                background: "#00796B",
                textTransform: "none",
                paddingX: 3,
              }}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Table */}
        <Card sx={{ padding: 2, borderRadius: "12px" }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  {["Expense ID", "Employee", "Category", "Amount", "Date", "Status", "Reimbursed", "Actions"].map(
                    (col) => (
                      <TableCell key={col} sx={{ fontWeight: 600, fontSize: "14px", color: "#555" }}>
                        {col}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">Loading...</TableCell>
                  </TableRow>
                )}

                {!loading && expensesData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">No Records Found</TableCell>
                  </TableRow>
                )}

                {!loading &&
                  expensesData.map((row: any, i: number) => (
                    <TableRow key={i} hover>
                      <TableCell>{row.expenseId}</TableCell>

                      <TableCell>{row.employeeId}</TableCell>

                      <TableCell>{row.category}</TableCell>

                      <TableCell>₹{row.amount}</TableCell>

                      <TableCell>
                        {new Date(row.expenseDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </TableCell>

                      <TableCell sx={{ color: getStatusColor(row.status), fontWeight: 600 }}>
                        {row.status}
                      </TableCell>

                      <TableCell>
                        {row.reimbursement?.status === "PENDING" ? "No" : row.reimbursement?.status}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<Iconify icon="solar:arrow-down-linear" width={20} />}
                          sx={{ borderRadius: "20px", textTransform: "none" }}
                          onClick={() => {
                            setSelectedExpense(row);
                            setOpenInfo(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Static For Now */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
            <Typography fontSize="14px">Showing {expensesData.length} records</Typography>
            <Pagination count={1} color="primary" />
          </Box>
        </Card>
      </Box>


      <ExpenseInfoModal
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        data={selectedExpense}
      />

    </DashboardContent>
  );
}
