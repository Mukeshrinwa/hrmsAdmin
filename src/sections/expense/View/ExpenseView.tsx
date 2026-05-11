import React from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import Expense from '../Expense';

export function ExpenseView() {

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Expense"
        links={[
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Expense />

    </DashboardContent>
  );
}
