import React from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import LeavesViewTable from './LeavesViewTable'; 

export function LeavesView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Leaves"
        links={[
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <LeavesViewTable />
    </DashboardContent>
  );
}
