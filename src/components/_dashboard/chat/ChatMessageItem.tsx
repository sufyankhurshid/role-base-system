import { formatDistanceToNowStrict } from 'date-fns';
// material
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
// @types
import useAuth from '../../../hooks/useAuth';
import { Message } from '../../../utils/firebase';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary
}));

// ----------------------------------------------------------------------

type ChatMessageItemProps = {
  message: Message;
  receiverName: string;
};

export default function ChatMessageItem({ message, receiverName }: ChatMessageItemProps) {
  const { therapistId } = useAuth();

  const isMe = message?.senderId === therapistId;
  const firstName = receiverName?.split(' ')?.[0] ?? '';

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto'
          })
        }}
      >
        {!isMe && (
          <Avatar
            alt={'icon'}
            src={'/favicon/kyan-logo.svg'}
            sx={{ width: 32, height: 32, mr: 2 }}
          />
        )}

        <div>
          <InfoStyle variant="caption" sx={{ ...(isMe && { justifyContent: 'flex-end' }) }}>
            {!isMe && `${firstName},`}&nbsp;
            {formatDistanceToNowStrict(new Date(message.createdAt), {
              addSuffix: true
            })}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && { color: 'grey.800', bgcolor: 'primary.lighter' })
            }}
          >
            <Typography variant="body2">{message.text}</Typography>
            {isMe && <Typography align="right">{message?.received ? '✓✓' : '✓'}</Typography>}
          </ContentStyle>
        </div>
      </Box>
    </RootStyle>
  );
}
