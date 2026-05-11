import React from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import HolidaysViewTable from './HolidaysViewTable'; 

export function HolidaysView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Holidays"
        links={[
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <HolidaysViewTable />
    </DashboardContent>
  );
}
