import React from 'react';
import { Link } from 'react-router-dom';
import { Bar, XAxis, YAxis, Legend, Tooltip, BarChart, ResponsiveContainer } from 'recharts';

import { Box, Card, Grid, Avatar, Select, Button, MenuItem, Typography, CardContent, FormControl, } from '@mui/material';

const attendanceData = [
  { day: 'Mon', Present: 70, Absent: 20, Leave: 10 },
  { day: 'Tue', Present: 60, Absent: 25, Leave: 15 },
  { day: 'Wed', Present: 80, Absent: 10, Leave: 10 },
  { day: 'Thu', Present: 90, Absent: 5, Leave: 5 },
  { day: 'Fri', Present: 75, Absent: 15, Leave: 10 },
  { day: 'Sat', Present: 85, Absent: 10, Leave: 5 },
  { day: 'Sun', Present: 95, Absent: 5, Leave: 0 },
];

const onLeaveData = [
  {
    date: 'Wednesday, 06 July 2023',
    employees: [
      { name: 'Nithin Vig', role: 'Cloud Systems Engineer', avatar: '/path/to/avatar1.jpg' },
      { name: 'Aaradhy Pharnandis', role: 'Computer Research Manager', avatar: '/path/to/avatar2.jpg' },
      { name: 'Bijoy Adina', role: 'Systems Designer', avatar: '/path/to/avatar3.jpg' },
    ],
  },
  {
    date: 'Thursday, 07 July 2023',
    employees: [
      { name: 'Paritosh Meghwal', role: 'React Developer', avatar: '/path/to/avatar4.jpg' },
      { name: 'Kartik Nimkar', role: 'UX Architect', avatar: '/path/to/avatar5.jpg' },
    ],
  },
];



const Chart: React.FC = () => (
  <Box sx={{ marginTop: '20px' }}>
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Card sx={{ height: '450px' }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">Attendance Overview</Typography>
              <FormControl>
                <Select
                  displayEmpty
                  inputProps={{ 'aria-label': 'Export Options' }}
                  value="This Month"
                >
                  <MenuItem value="This Month">Today</MenuItem>
                  <MenuItem value="This Day">Yesterday</MenuItem>
                  <MenuItem value="This Year">Tomorrow</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Present" fill="#82ca9d" />
                  <Bar dataKey="Absent" fill="#ff7300" />
                  <Bar dataKey="Leave" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card sx={{ height: '450px' }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">On Leave</Typography>
              <Link to='/dashboard/leaves'>
                <Button variant="outlined" size="medium" color='primary'>View All</Button>
              </Link>
            </Box>
            <Box sx={{ overflowY: 'auto' }}>
              {onLeaveData.map((day, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="body2" color="textSecondary">{day.date}</Typography>
                  {day.employees.map((employee, idx) => (
                    <Box key={idx} display="flex" alignItems="center" mt={1}>
                      <Avatar src={employee.avatar} />
                      <Box ml={2}>
                        <Typography variant="body1">{employee.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{employee.role}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default Chart;