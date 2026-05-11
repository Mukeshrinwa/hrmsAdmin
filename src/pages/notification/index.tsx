import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { NotificationView } from 'src/sections/notification/NotificationView';
// ----------------------------------------------------------------------

const metadata = { title: `All Employees | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      < NotificationView />
    </>
  );
}
