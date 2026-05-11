import React from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import EemployeeTable from './EemployeeTable'; 

export function AllemployeeView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="All Employee"
        links={[
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <EemployeeTable />
    </DashboardContent>
  );
}