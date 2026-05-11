import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import Chart from './Chart';
import DashboardContant from'./DashboardContant';
// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function BlankView({ title = 'Blank' }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Hello Robert 👋🏻"
        links={[
          { name: 'Good Morning' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DashboardContant/>
      <Chart/>
    </DashboardContent>
  );
}
