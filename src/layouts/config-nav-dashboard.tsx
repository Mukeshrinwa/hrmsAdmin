import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

import { Iconify } from '../components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  user: icon('ic-user'),
  employee: <Iconify icon="gridicons:multiple-users" />,
  departMent: <Iconify icon="arcticons:emoji-department-store" />,
  leaves: <Iconify icon="fontisto:holiday-village" /> ,
  attendance: <Iconify icon="fluent-mdl2:date-time" />,
  tour: icon('ic-tour'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  calendar: <Iconify icon="solar:calendar-bold" />,
  disabled: icon('ic-disabled'),
  analytics: icon('ic-analytics'),
  permission: <Iconify icon="fluent-mdl2:permissions-solid" />,
  dashboard: icon('ic-dashboard'),
  training: <Iconify icon="healthicons:i-training-class-24px" />,
  policy: <Iconify icon="material-symbols:policy-outline" />,
  asset: <Iconify icon="material-symbols:background-grid-small-sharp" />,
  setting: <Iconify icon="solar:settings-bold-duotone" />,
  notification: <Iconify icon="mdi:bell-notification" />,
  OfficeManagement: <Iconify icon="material-symbols:ballot-outline" />,
};


// ----------------------------------------------------------------------

export const navData = [

  {
    subheader: '',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'All Employees', path: paths.dashboard.allemployee, icon: ICONS.employee },
      { title: 'Office Management', path: paths.dashboard.OfficeManagement, icon: ICONS.OfficeManagement },

      { title: 'All DepartMent', path: paths.dashboard.alldepartments, icon: ICONS.departMent },
      { title: 'Asset Management', path: paths.dashboard.assets, icon: ICONS.asset },
      { title: 'Attendance', path: paths.dashboard.attendance, icon: ICONS.attendance },
      { title: 'Task Calendar', path: paths.dashboard.taskCalendar, icon: ICONS.calendar },
      { title: 'Payroll', path: paths.dashboard.payroll, icon: ICONS.banking },
      { title: 'Leaves', path: paths.dashboard.leaves, icon: ICONS.leaves },
      { title: 'Expense', path: paths.dashboard.expense, icon: ICONS.permission },
      // { title: 'Holidays', path: paths.dashboard.holidays, icon: ICONS.booking },
      { title: 'Training', path: paths.dashboard.training, icon: ICONS.training },
      { title: 'Policy', path: paths.dashboard.policy, icon: ICONS.policy },
      { title: 'Notification', path: paths.dashboard.notification, icon: ICONS.notification },
      { title: 'Settings', path: paths.dashboard.settings, icon: ICONS.setting },

    ],
  },
];
// Policy