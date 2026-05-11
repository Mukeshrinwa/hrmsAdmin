import type { Department } from 'src/Interface/all_department.interface';

import React, { useState, useEffect } from 'react';

import { Box, Stack, Button, TextField, Typography, InputAdornment } from '@mui/material';

import useDepartmentsApi from 'src/Api/all_departments/useDepartmentsApi';

import { Iconify } from 'src/components/iconify';

import { DepartmentBox } from './DepartmentBox';
import AddDepartmentModal from './AddDepartmentModal';

export function OverviewalldepartmentsView() {
  const { fetchAllDepartments, addDepartments, deleteDepartments } = useDepartmentsApi();

  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const loadDepartments = async () => {
    try {
      const response = await fetchAllDepartments();
      if (response && Array.isArray(response.data)) {
        setDepartments(response.data);
      } else {
        console.error('Invalid data format', response);
      }
    } catch (error) {
      console.error('Failed to fetch departments', error);
    }
  };

  useEffect(() => {
    loadDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddDepartment = async (name: string, description: string, departmentId: string) => {
    try {
      const newDepartment = {
        name,
        description,
        department_id: departmentId,
      };

      await addDepartments(newDepartment);
      setOpen(false);
      loadDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      await deleteDepartments(id);
      loadDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2 }, mt: 4 }}>

      {/* Title */}
      <Typography variant="h6" sx={{ mb: 2, pl: { xs: 1, sm: 2 } }}>
        Department
      </Typography>

      {/* Main Container */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          m: 'auto',
          width: '100%',
          maxWidth: '1200px',
          borderRadius: 2,
          border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        {/* Search + Button */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <TextField
            sx={{ width: { xs: '100%', sm: '240px' } }}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="gg:add" />}
            fullWidth
            sx={{
              width: { xs: '100%', sm: 'auto' },
              py: 1.2,
            }}
            onClick={() => setOpen(true)}
          >
            Add New Department
          </Button>
        </Stack>

        {/* Department Grid */}
        <Box
          sx={{
            mt: 2,
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',  
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)', 
            },
          }}
        >
          {departments.map((department) => (
            <DepartmentBox
              key={department.id}
              department={department}
              onDelete={handleDeleteDepartment}
              onUpdate={loadDepartments}
            />
          ))}
        </Box>
      </Box>

      {/* Modal */}
      <AddDepartmentModal
        open={open}
        handleClose={() => setOpen(false)}
        handleAddDepartment={handleAddDepartment}
      />
    </Box>
  );
}
