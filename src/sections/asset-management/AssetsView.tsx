import React, { useState } from 'react';

import { Grid, Button } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import AssetList from './AssetList/AssetList';
import AssignedAsset from './AssignedAsset/AssetTable';
import Maintenance from './maintenance/maintenanceTable';

export function AssetsView() {
  const [buttonType, setButtonType] = useState('assignedAsset');

  const getButtonStyles = (currentType: string) => ({
    borderRadius: '30px',
    backgroundColor: buttonType === currentType ? 'primary.main' : 'white',
    color: buttonType === currentType ? 'primary.contrastText' : 'text.primary',
    padding: '10px 15px',
    boxShadow: buttonType === currentType ? '0px 4px 10px rgba(0,0,0,0.2)' : 'none',
    '&:hover': {
      backgroundColor: buttonType === currentType ? 'primary.main' : 'white',
      color: buttonType === currentType ? 'primary.contrastText' : 'text.primary'
    },
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="App Settings"
        links={[
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Grid container spacing={2} sx={{ justifyContent: { xs: 'center', sm: 'start' }, mb: '15px', marginLeft: { xs: '0', sm: '0px', } }} gap={3}>
        <Button
          sx={getButtonStyles('assignedAsset')}
          onClick={() => setButtonType('assignedAsset')}
          variant={buttonType === 'assignedAsset' ? 'contained' : 'outlined'}
        >
          Assigned Asset
        </Button>
        <Button
          sx={getButtonStyles('assetList')}
          onClick={() => setButtonType('assetList')}
          variant={buttonType === 'assetList' ? 'contained' : 'outlined'}
        >
          Asset List
        </Button>
        <Button
          sx={getButtonStyles('maintenance')}
          onClick={() => setButtonType('maintenance')}
          variant={buttonType === 'assetList' ? 'contained' : 'outlined'}
        >
          Maintenance
        </Button>
      </Grid>
      <Grid container marginTop={3}>
        {buttonType === 'assignedAsset' && <AssignedAsset />}
        {buttonType === 'assetList' && <AssetList />}
        {buttonType === 'maintenance' && <Maintenance />}
      </Grid>
    </DashboardContent>
  );
}