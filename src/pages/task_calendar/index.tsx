import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TaskCalendarView } from 'src/sections/kanban/view/TaskCalendarView';
// ----------------------------------------------------------------------

const metadata = { title: `All Employees | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TaskCalendarView />
    </>
  );
}
