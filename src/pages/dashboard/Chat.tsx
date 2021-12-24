import { useEffect } from 'react';
// material
import { Card, Container } from '@mui/material';
// redux
import { useDispatch } from '../../redux/store';
import { getConversations } from '../../redux/slices/chat';
// routes

// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { ChatSidebar, ChatWindow } from '../../components/_dashboard/chat';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { therapistId } = useAuth();

  useEffect(() => {
    dispatch(getConversations(therapistId));
  }, [dispatch, therapistId]);

  return (
    <Page title="Chat | Kyan Admin">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Card sx={{ height: '72vh', display: 'flex' }}>
          <ChatSidebar />
          <ChatWindow />
        </Card>
      </Container>
    </Page>
  );
}
