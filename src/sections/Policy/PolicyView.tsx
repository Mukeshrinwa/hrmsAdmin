import React from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PoliciesViewTable from './PoliciesViewTable'; 

export function PolicyView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Policy"
        links={[
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <PoliciesViewTable />
    </DashboardContent>
  );
}
