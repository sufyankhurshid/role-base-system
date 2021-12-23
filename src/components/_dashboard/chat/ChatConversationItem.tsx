import { formatDistanceToNowStrict } from 'date-fns';
// material
import { styled } from '@mui/material/styles';
import { Avatar, Box, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';

import BadgeStatus from '../../BadgeStatus';
import { useEffect, useState } from 'react';
import {
  ChatItem,
  getChatTyping,
  getMessages,
  getUnreadChatCount,
  Message
} from '../../../utils/firebase';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

const AVATAR_SIZE = 48;

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  transition: theme.transitions.create('all')
}));

const AvatarWrapperStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  '& .MuiAvatar-img': { borderRadius: '50%' },
  '& .MuiAvatar-root': { width: '100%', height: '100%' }
}));

// ----------------------------------------------------------------------

type ChatConversationItemProps = {
  isSelected: boolean;
  conversation: ChatItem;
  isOpenSidebar: boolean;
  onSelectConversation: VoidFunction;
};

export default function ChatConversationItem({
  isSelected,
  conversation,
  isOpenSidebar,
  onSelectConversation
}: ChatConversationItemProps) {
  const [message, setMessage] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [chatData, setChatData] = useState<Record<string, any>>({});
  const { therapistId } = useAuth();
  const lastMessage: Message = message?.[0] ?? {};
  const { chatId } = conversation;
  const isUnread = unreadCount > 0;

  useEffect(() => {
    let unListenMessages: any = null;
    let unListenChatTyping: any = null;
    if (chatId) {
      unListenMessages = getMessages(chatId, 1, 'desc', (messages) => {
        setMessage(messages);
      });
      unListenChatTyping = getChatTyping(chatId, (chatInfo: Record<string, any>) => {
        setChatData(chatInfo?.typing ?? {});
      });
    }
    return () => {
      unListenMessages?.();
      unListenChatTyping?.();
    };
  }, [chatId]);

  useEffect(() => {
    let unlisten: any = null;
    if (chatId && therapistId) {
      unlisten = getUnreadChatCount(chatId, therapistId, (count: number) => {
        setUnreadCount(count);
      });
    }
    return () => unlisten?.();
  }, [chatId, therapistId]);

  return (
    <RootStyle
      onClick={onSelectConversation}
      sx={{
        ...(isSelected && { bgcolor: 'action.selected' })
      }}
    >
      <ListItemAvatar>
        <Box>
          <AvatarWrapperStyle className="avatarWrapper">
            <Avatar alt={'icon'} src={'/favicon/kyan-logo.svg'} />
            {/*
            <BadgeStatus status={'online'} sx={{ right: 2, bottom: 2, position: 'absolute' }} />
*/}
          </AvatarWrapperStyle>
        </Box>
      </ListItemAvatar>

      {isOpenSidebar && (
        <>
          <ListItemText
            primary={conversation?.user?.fullname ?? ''}
            primaryTypographyProps={{
              noWrap: true,
              variant: 'subtitle2'
            }}
            secondary={
              chatData?.[conversation.userId ?? '']
                ? `${conversation?.user?.fullname?.split(' ')?.[0] ?? ''} is Typing`
                : lastMessage?.text
            }
            secondaryTypographyProps={{
              noWrap: true,
              variant: isUnread ? 'subtitle2' : 'body2',
              color: isUnread ? 'textPrimary' : 'textSecondary'
            }}
          />

          <Box
            sx={{
              ml: 2,
              height: 44,
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                mb: 1.25,
                fontSize: 12,
                lineHeight: '22px',
                whiteSpace: 'nowrap',
                color: 'text.disabled'
              }}
            >
              {formatDistanceToNowStrict(
                lastMessage?.createdAt ? new Date(lastMessage?.createdAt) : new Date(),
                {
                  addSuffix: false
                }
              )}
            </Box>
            {isUnread && <BadgeStatus status="unread" size="small" />}
          </Box>
        </>
      )}
    </RootStyle>
  );
}
