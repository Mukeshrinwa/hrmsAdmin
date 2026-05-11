import React from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import NotificationTable from './NotificationTable'; 

export function NotificationView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Notification"
        links={[
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <NotificationTable />
    </DashboardContent>
  );
}
