import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AllemployeeView } from 'src/sections/all-employees/AllemployeeView';
// ----------------------------------------------------------------------

const metadata = { title: `All Employees | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      < AllemployeeView />
    </>
  );
}
