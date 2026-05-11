import React from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TrainingViewTable from './TrainingViewTable'; 

export function TrainingView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Training"
        links={[
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <TrainingViewTable />
    </DashboardContent>
  );
}
