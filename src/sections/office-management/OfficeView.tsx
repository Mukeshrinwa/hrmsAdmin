import React, { useState } from 'react';

import { Grid, Button } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CompanyManagement from './CompanyManagement/CompanyManagement';
import ShiftManagemetTable from './ShiftManagemet/ShiftManagemetTable';
import OfficeManagementTable from './OffficeManagement/OfficeManagementTable';

export function OfficeView() {
  const [buttonType, setButtonType] = useState<'company' | 'office' | 'shift'>('office');

  const getButtonStyles = (currentType: string) => ({
    backgroundColor: buttonType === currentType ? 'primary.main' : 'white',
    color: buttonType === currentType ? 'primary.contrastText' : 'text.primary',
    padding: '10px 15px',
    boxShadow: buttonType === currentType ? '0px 4px 10px rgba(0,0,0,0.2)' : 'none',
    '&:hover': {
      backgroundColor: buttonType === currentType ? 'primary.main' : 'white',
      color: buttonType === currentType ? 'primary.contrastText' : 'text.primary',
    },
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="App Settings"
        links={[{ name: '' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* TOP BUTTONS */}
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: { xs: 'center', sm: 'start' },
          mb: '15px',
        }}
        gap={3}
      >
        {/* Company Management */}
        <Button
          sx={getButtonStyles('company')}
          onClick={() => setButtonType('company')}
          variant={buttonType === 'company' ? 'contained' : 'outlined'}
        >
          Company Management
        </Button>

        {/* Office Management */}
        <Button
          sx={getButtonStyles('office')}
          onClick={() => setButtonType('office')}
          variant={buttonType === 'office' ? 'contained' : 'outlined'}
        >
          Office Management
        </Button>

        {/* Shift Management */}
        <Button
          sx={getButtonStyles('shift')}
          onClick={() => setButtonType('shift')}
          variant={buttonType === 'shift' ? 'contained' : 'outlined'}
        >
          Shift Management
        </Button>
      </Grid>

      {/* TABLES */}
      <Grid container marginTop={3}>
        {buttonType === 'company' && <CompanyManagement />}
        {buttonType === 'office' && <OfficeManagementTable />}
        {buttonType === 'shift' && <ShiftManagemetTable />}
      </Grid>
    </DashboardContent>
  );
}
