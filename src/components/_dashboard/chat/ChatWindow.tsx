import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
// material
import { Box, Divider, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import ChatMessageList from './ChatMessageList';
import ChatHeaderDetail from './ChatHeaderDetail';
import ChatMessageInput from './ChatMessageInput';
import { getMessages, Message, sendMessage, updateMessageStatus } from '../../../utils/firebase';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function ChatWindow() {
  const { pathname } = useLocation();
  const { therapistId } = useAuth();
  const { conversationKey: chatId = '' } = useParams();
  const [conversation, setConversation] = useState<Message[]>([]);

  useEffect(() => {
    let unListenMessages: any = null;
    if (chatId) {
      unListenMessages = getMessages(chatId, 100, 'desc', (messages) => {
        setConversation(messages);
      });
    }
    return () => unListenMessages?.();
  }, [chatId]);

  useEffect(() => {
    const unreadMessages = conversation.filter(
      (message) => message.user._id !== therapistId && !message?.received
    );
    if (unreadMessages.length && chatId) {
      updateMessageStatus(unreadMessages, chatId);
    }
  }, [conversation, chatId, therapistId]);

  const handleSendMessage = async (message: Message) => {
    try {
      sendMessage(message, chatId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack sx={{ flexGrow: 1, minWidth: '1px' }}>
      <ChatHeaderDetail conversationId={chatId} />

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        {chatId && (
          <Stack sx={{ flexGrow: 1 }}>
            <ChatMessageList chatId={chatId} conversation={conversation} />

            <Divider />

            <ChatMessageInput
              conversationId={chatId}
              onSend={handleSendMessage}
              disabled={pathname === PATH_DASHBOARD.chat.new}
            />
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
