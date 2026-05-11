import React from 'react';

import { DashboardContent } from 'src/layouts/dashboard/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PayrollviewTable from './PayrollviewTable';

export default function PayrollView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Payroll"
        links={[
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <PayrollviewTable />
    </DashboardContent>
  );
}
