import type { ExpenseData, EmployeeClaim, MonthlyExpense, CategorySummary } from 'src/Interface/all_expenses';

import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Pie, Bar, Cell, XAxis, Tooltip, PieChart, BarChart } from "recharts";

import {
  Box,
  Card,
  Grid,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
} from "@mui/material";

import useExpensesApi from 'src/Api/expenses/useExpensesApi';

const COLORS = ["#3DDAD7", "#7C83FD", "#FFB4B4", "#FF9800", "#00C49F"];
const PRIMARY = "#1976D2";

// Month abbreviations
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Expense() {
  const { fetchAllExpenses } = useExpensesApi();
  const [expensesData, setExpensesData] = useState<ExpenseData[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySummary[]>([]);
  const [monthlyExpenseData, setMonthlyExpenseData] = useState<MonthlyExpense[]>([]);
  const [employeeClaims, setEmployeeClaims] = useState<EmployeeClaim[]>([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    pendingApproval: 0,
    approvedThisMonth: 0,
    approvedAmountThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchExpenseData = async () => {
    try {
      setLoading(true);
      const response = await fetchAllExpenses();

      // Handle the API response structure - using object destructuring
      const { data } = response;
      if (data && data.expenses) {
        const { expenses } = data; // Destructure here
        setExpensesData(expenses);

        // Calculate category-wise expenses
        const categoryMap = new Map<string, number>();
        expenses.forEach((expense: ExpenseData) => {
          const current = categoryMap.get(expense.category) || 0;
          categoryMap.set(expense.category, current + expense.amount);
        });

        const categorySummary: CategorySummary[] = Array.from(categoryMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        setCategoryData(categorySummary);

        // Calculate monthly expenses
        const monthlyMap = new Map<string, number>();
        expenses.forEach((expense: ExpenseData) => {
          const date = new Date(expense.expenseDate);
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          const current = monthlyMap.get(monthKey) || 0;
          monthlyMap.set(monthKey, current + expense.amount);
        });

        // Convert to chart data format (last 6 months)
        const monthlyData: MonthlyExpense[] = [];
        const now = new Date();

        for (let i = 0; i < 6; i += 1) {
          const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          const expense = monthlyMap.get(monthKey) || 0;

          monthlyData.push({
            month: MONTHS[date.getMonth()],
            expense,
          });
        }

        setMonthlyExpenseData(monthlyData);

        // Calculate employee claims (top 5)
        const employeeMap = new Map<string, { name: string; dept: string; branch: string; total: number }>();

        // Note: You'll need to fetch employee names separately or modify API to include them
        // For now, using employeeId as name
        expenses.forEach((expense: ExpenseData) => {
          const current = employeeMap.get(expense.employeeId) || {
            name: `Employee ${expense.employeeId.substring(0, 6)}`,
            dept: "Unknown", // You'll need to fetch department data separately
            branch: "Unknown", // You'll need to fetch branch data separately
            total: 0
          };

          employeeMap.set(expense.employeeId, {
            ...current,
            total: current.total + expense.amount
          });
        });

        const topEmployees = Array.from(employeeMap.values())
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)
          .map(emp => ({
            ...emp,
            formattedTotal: `₹${emp.total.toLocaleString('en-IN')}`
          }));

        setEmployeeClaims(topEmployees);

        // Set summary from API response - using destructuring for summary
        if (data.summary) {
          const {
            totalAmount = 0,
            pendingApproval = 0,
            approvedThisMonth = 0,
            approvedAmountThisMonth = 0
          } = data.summary;

          setSummary({
            totalAmount,
            pendingApproval,
            approvedThisMonth,
            approvedAmountThisMonth,
          });
        } else {
          // Fallback calculation
          const totalAmount = expenses.reduce((sum: number, expense: ExpenseData) => sum + expense.amount, 0);
          const pendingApproval = expenses.filter((e: ExpenseData) => e.status === 'PENDING_MANAGER_APPROVAL' || e.status === 'DRAFT').length;
          const currentMonth = new Date().getMonth();
          const approvedThisMonth = expenses.filter((e: ExpenseData) =>
            e.status === 'APPROVED' && new Date(e.expenseDate).getMonth() === currentMonth
          ).length;
          const approvedAmountThisMonth = expenses
            .filter((e: ExpenseData) => e.status === 'APPROVED' && new Date(e.expenseDate).getMonth() === currentMonth)
            .reduce((sum: number, expense: ExpenseData) => sum + expense.amount, 0);

          setSummary({
            totalAmount,
            pendingApproval,
            approvedThisMonth,
            approvedAmountThisMonth
          });
        }
      }
    } catch (error) {
      console.error('Error fetching expense data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading expense data...</Typography>
      </Box>
    );
  }
  const goToExpenseDetail = () => {
    navigate('/expense-detail');
  };
  return (
    <Box>
      {/* ----------- TOP CARDS ----------- */}
      <Grid container spacing={2} mb={3}>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              height: 140,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": { boxShadow: 4 }
            }}
            onClick={goToExpenseDetail}
          >
            <Typography variant="body2">Total Expenses (This Month)</Typography>
            <Typography variant="h5">₹{summary.totalAmount.toLocaleString('en-IN')}</Typography>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              height: 140,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": { boxShadow: 4 }
            }}
            onClick={goToExpenseDetail}
          >
            <Typography variant="body2">Pending Approvals</Typography>
            <Typography variant="h5">{summary.pendingApproval}</Typography>
            <Typography color="orange">Needs attention</Typography>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              height: 140,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": { boxShadow: 4 }
            }}
            onClick={goToExpenseDetail}
          >
            <Typography variant="body2">Approved (This Month)</Typography>
            <Typography variant="h5">{summary.approvedThisMonth}</Typography>
            <Typography color="green">₹{summary.approvedAmountThisMonth.toLocaleString('en-IN')}</Typography>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              height: 140,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": { boxShadow: 4 }
            }}
            onClick={goToExpenseDetail}
          >
            <Typography variant="body2">Total Expenses Count</Typography>
            <Typography variant="h5">{expensesData.length}</Typography>
            <Typography color="blue">All time records</Typography>
          </Card>
        </Grid>

      </Grid>



      {/* ----------- CHARTS SECTION ----------- */}
      <Grid container spacing={3}>
        {/* Donut Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Expense Category Distribution</Typography>

            {categoryData.length > 0 ? (
              <>
                <Box display="flex" justifyContent="center" mt={2}>
                  <PieChart width={280} height={260}>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
                  </PieChart>
                </Box>

                {/* Category Table */}
                <Table size="small">
                  <TableBody>
                    {categoryData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box
                              width={12}
                              height={12}
                              bgcolor={COLORS[index % COLORS.length]}
                              borderRadius="50%"
                              mr={1}
                            />
                            {item.name}
                          </Box>
                        </TableCell>
                        <TableCell>₹{item.value.toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              <Typography align="center" sx={{ py: 4 }}>
                No category data available
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Month Wise Expense Trend</Typography>

            {monthlyExpenseData.length > 0 ? (
              <BarChart width={400} height={240} data={monthlyExpenseData}>
                <XAxis dataKey="month" />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Expense']} />
                <Bar dataKey="expense" fill={PRIMARY} />
              </BarChart>
            ) : (
              <Typography align="center" sx={{ py: 4 }}>
                No monthly trend data available
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* ----------- EMPLOYEE CLAIM TABLE ----------- */}
      <Card sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" mb={2}>
          Top 5 Employees With Highest Claims
        </Typography>

        {employeeClaims.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Total ₹</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {employeeClaims.map((emp, index) => (
                  <TableRow key={index}>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.dept}</TableCell>
                    <TableCell>{emp.branch}</TableCell>
                    <TableCell>{emp.formattedTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography align="center" sx={{ py: 2 }}>
            No employee claim data available
          </Typography>
        )}
      </Card>
    </Box>
  );
}