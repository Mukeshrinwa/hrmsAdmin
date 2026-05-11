import React from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import AttandanceTable from '../AttandanceTable';

export function OverAttendanceView() {

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Attendance"
        links={[
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <AttandanceTable />

    </DashboardContent>
  );
}
