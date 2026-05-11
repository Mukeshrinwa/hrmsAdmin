import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/Dashboard'));
const AllEmployeePage = lazy(() => import('src/pages/all-employees/index'));
const AlldepartmentsView = lazy(() => import('src/pages/all-departments/index'));
const AttendanceView = lazy(() => import('src/pages/attendance/index'));
const TaskCalendarView = lazy(() => import('src/pages/task_calendar/index'));
const PayrollView = lazy(() => import('src/pages/payroll/index'));
const LeavesView = lazy(() => import('src/pages/leaves/index'));
const PermissionView = lazy(() => import('src/pages/permission/index'));
const HolidaysView = lazy(() => import('src/pages/holidays/index'));
const TrainingView = lazy(() => import('src/pages/training/index'));
const PolicyView = lazy(() => import('src/pages/policy/index'));
const NotificationView = lazy(() => import('src/pages/notification/index'));
const EmployeeProfileView = lazy(() => import('src/sections/all-employees/EmployeeProfileView'));
const SettingView = lazy(() => import('src/pages/settings/index'));
const SingleDepartment = lazy(() => import('src/sections/all-departments/SingleDepartment'));
const AssetsView = lazy(() => import('src/pages/asset-management/index'));
const OfficeManagement = lazy(() => import('src/pages/office-management/index'));
const ExpenseView = lazy(() => import('src/pages/expense/index'));
const ExpenseTable = lazy(() => import('src/sections/expense/ExpenseTable'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: '/',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { path: 'dashboard', element: <IndexPage />, index: true },
      { path: 'all-employee', element: <AllEmployeePage /> },
      { path: 'all-departments', element: <AlldepartmentsView /> },
      { path: 'attendance', element: <AttendanceView /> },
      { path: 'taskCalendar', element: <TaskCalendarView /> },
      { path: 'payroll', element: <PayrollView /> },
      { path: 'leaves', element: <LeavesView /> },
      { path: 'permission', element: <PermissionView /> },

      { path: 'holidays', element: <HolidaysView /> },
      { path: 'training', element: <TrainingView /> },
      { path: 'policy', element: <PolicyView /> },
      { path: 'assets', element: <AssetsView /> },
      { path: 'office-management', element: <OfficeManagement /> },
      { path: 'expense', element: <ExpenseView /> },
      { path: 'expense-detail', element: <ExpenseTable/> },


      { path: 'notification', element: <NotificationView /> },
      { path: 'employee-profile/:id', element: <EmployeeProfileView /> },
      { path: 'settings', element: <SettingView /> },
      { path: 'departments/single-departments', element: <SingleDepartment /> },

    ],
  },
];
