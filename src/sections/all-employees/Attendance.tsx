import type { AttendanceData } from "src/Interface/all_employee.interface";

import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import duration from "dayjs/plugin/duration";
import React, { useState, useEffect } from "react";

import {
  Box, Grid, Chip, Table, Select, TableRow, MenuItem, TableCell, TableHead, TableBody,
  InputLabel, FormControl, TableContainer, TablePagination
} from "@mui/material";

import useAttandanceApi from "src/Api/all_attandance/useAttandanceApi";

dayjs.extend(duration);

const Attendance: React.FC = () => {
  const [page, setPage] = useState(0);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { id } = useParams<{ id: string }>();
  const { fetchattendanceByid } = useAttandanceApi();

  const calculateWorkingHours = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return "N/A";

    const checkInTime = dayjs(`1970-01-01T${checkIn}`);
    const checkOutTime = dayjs(`1970-01-01T${checkOut}`);

    if (!checkInTime.isValid() || !checkOutTime.isValid()) {
      return "Invalid time format";
    }

    const diff = dayjs.duration(checkOutTime.diff(checkInTime));
    return `${diff.hours()}h ${diff.minutes()}m`;
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Check In", dataIndex: "check_in_time", key: "check_in_time" },
    { title: "Check Out", dataIndex: "check_out_time", key: "check_out_time" },
    {
      title: "Working Hours",
      dataIndex: "working_hours",
      key: "working_hours",
      render: (_: any, row: AttendanceData) =>
        calculateWorkingHours(row.check_in_time, row.check_out_time)
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Chip
          label={status}
          color={status === "Present" ? "success" : "error"}
          sx={{
            backgroundColor: status === "Present" ? "#3FC28A1A" : "#F45B691A",
            color: status === "Present" ? "green" : "red"
          }}
        />
      )
    }
  ];

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      if (id) {
        const { data } = await fetchattendanceByid(id);
        console.log("Fetched data:", data);
        setAttendanceData(data || []);
      }
    };
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ border: "1px solid #A2A1A833", padding: "17px", borderRadius: "10px", margin: "15px" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="day-select-label">Day</InputLabel>
            <Select labelId="day-select-label" id="day-select" label="Day">
              <MenuItem value="This Month">This Month</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{column.title}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row._id}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render
                          ? column.render(
                            row[column.dataIndex as keyof AttendanceData] as string,
                            row
                          )
                          : (row[column.dataIndex as keyof AttendanceData] ?? "N/A").toString()}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={attendanceData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
            labelRowsPerPage="Rows per page:"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Attendance;
