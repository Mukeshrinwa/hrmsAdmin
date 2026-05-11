import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ExpenseView } from 'src/sections/expense/View/ExpenseView';
// ----------------------------------------------------------------------

const metadata = { title: `All Employees | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      < ExpenseView />
    </>
  );
}
