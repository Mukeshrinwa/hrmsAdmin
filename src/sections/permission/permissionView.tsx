import React from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PermissionViewTable from './permissionViewTable'; 

export function PermissionView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Permission"
        links={[
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <PermissionViewTable />
    </DashboardContent>
  );
}
