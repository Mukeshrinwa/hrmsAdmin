import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LeavesView } from 'src/sections/leaves/LeavesView';
// ----------------------------------------------------------------------

const metadata = { title: `All Employees | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      < LeavesView />
    </>
  );
}
