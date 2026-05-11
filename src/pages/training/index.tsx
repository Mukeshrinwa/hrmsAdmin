import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TrainingView } from 'src/sections/training/TrainingView';
// ----------------------------------------------------------------------

const metadata = { title: `All Employees | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      < TrainingView />
    </>
  );
}
