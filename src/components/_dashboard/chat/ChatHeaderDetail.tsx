// material
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
import { RootState, useSelector } from '../../../redux/store';
import { ChatItem } from '../../../utils/firebase';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  flexShrink: 0,
  minHeight: 92,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 3)
}));

// ----------------------------------------------------------------------

function OneAvatar({ conversation }: { conversation: ChatItem }) {
  if (conversation === undefined) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar src={'/favicon/kyan-logo.svg'} alt={conversation?.user?.fullname ?? 'icon'} />
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{conversation?.user?.fullname ?? ''}</Typography>
      </Box>
    </Box>
  );
}

export default function ChatHeaderDetail({ conversationId }: { conversationId: string }) {
  const { allConversations } = useSelector((state: RootState) => state.chat);
  const conversations: ChatItem[] = allConversations.filter(
    (conversation: any) => conversation?.chatId === conversationId
  );
  if (!conversationId) {
    return null;
  }
  return (
    <RootStyle>
      <OneAvatar conversation={conversations?.[0] ?? {}} />
    </RootStyle>
  );
}
