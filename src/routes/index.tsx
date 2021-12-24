import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import DashboardLayout from '../layouts/dashboard';

// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';

// components
import LoadingScreen from '../components/LoadingScreen';
import Page404 from '../pages/Page404';
import { CHAT_ROLES } from '../utils/constants';

// ----------------------------------------------------------------------

const Loadable = (Component: React.ElementType) => (props: any) => {
  const isDashboard = true; // pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            // @ts-ignore
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        { path: 'reset-password', element: <ResetPassword /> }
      ]
    },

    // Dashboard Routes
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/chat" replace /> },
        {
          path: 'chat',
          children: [
            {
              element: (
                <RoleBasedGuard accessibleRoles={CHAT_ROLES}>
                  <Chat />
                </RoleBasedGuard>
              )
            },
            { path: 'new', element: <Chat /> },
            { path: ':conversationKey', element: <Chat /> }
          ]
        },
        {
          path: 'therapist',
          children: [
            { element: <Navigate to="/dashboard/therapist/list" replace /> },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':id/edit', element: <UserCreate /> }
          ]
        },
        {
          path: 'surveys',
          children: [
            { element: <Navigate to="/dashboard/surveys/list" replace /> },
            { path: 'list', element: <SurveysList /> },
            { path: 'new', element: <CreateSurvey /> },
            { path: ':id/edit', element: <CreateSurvey /> }
          ]
        },
        { path: '*', element: <Page404 /> }
      ]
    },
    {
      path: 'user',
      children: [
        { element: <Navigate to="/dashboard/user/profile" replace /> },
        { path: 'profile', element: <UserProfile /> },
        { path: 'cards', element: <UserCards /> },
        { path: 'list', element: <UserList /> },
        { path: 'new', element: <UserCreate /> },
        { path: ':name/edit', element: <UserCreate /> },
        { path: 'account', element: <UserAccount /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));

// Dashboard
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/TherapistList')));
const SurveysList = Loadable(lazy(() => import('../pages/dashboard/Surveys')));
const CreateSurvey = Loadable(lazy(() => import('../pages/dashboard/CreateSurvey')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/CreateTherapist')));
