import { ReactNode } from 'react';
import { Container, Alert, AlertTitle } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  accessibleRoles: string[];
  children: ReactNode | string;
};

export const useCurrentRole = () => {
  // Logic here to get current user role
  const { roles, therapistId } = useAuth();
  let role = ROLES.NONE;

  if (roles.chat && roles.admin) {
    if (Boolean(therapistId)) {
      role = ROLES.ADMIN_CHAT;
    } else {
      role = ROLES.CHAT_WITHOUT_THERAPIST;
    }
  } else if (roles.chat) {
    if (Boolean(therapistId)) {
      role = ROLES.CHAT_ONLY;
    } else {
      role = ROLES.CHAT_WITHOUT_THERAPIST;
    }
  } else if (roles.admin) {
    role = ROLES.ADMIN_ONLY;
  }

  return role;
};

export default function RoleBasedGuard({ accessibleRoles, children }: RoleBasedGuardProp) {
  const currentRole = useCurrentRole();

  let roleMessage = 'You do not have permission to access this page';

  if (currentRole === ROLES.CHAT_WITHOUT_THERAPIST) {
    roleMessage = 'We could not find a therapist profile linked to your account';
  }

  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          {roleMessage}
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
