import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import SingleDepartmentTable from './singleDepartment/SingleDepartmentTable';


export default function SingleDepartment() {

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Department"
        links={[
          { name: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <SingleDepartmentTable />
    </DashboardContent>
  );
}
