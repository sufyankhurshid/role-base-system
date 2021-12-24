import { useNavigate } from 'react-router-dom';
// material
import { List, ListProps } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import ChatConversationItem from './ChatConversationItem';
import { ChatItem } from '../../../utils/firebase';
import { useDispatch } from '../../../redux/store';
import { setActiveConversation } from '../../../redux/slices/chat';

// ----------------------------------------------------------------------

interface ChatConversationListProps extends ListProps {
  conversations: ChatItem[];
  isOpenSidebar: boolean;
  activeConversationId: string | null;
}

export default function ChatConversationList({
  conversations,
  isOpenSidebar,
  activeConversationId,
  ...other
}: ChatConversationListProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectConversation = (conversationId: string) => {
    dispatch(setActiveConversation(conversationId));
    navigate(`${PATH_DASHBOARD.chat.root}/${conversationId}`);
  };

  return (
    <List disablePadding {...other}>
      {conversations?.map((conversation: ChatItem) => (
        <ChatConversationItem
          key={conversation.chatId}
          isOpenSidebar={isOpenSidebar}
          conversation={conversation}
          isSelected={activeConversationId === conversation.chatId}
          onSelectConversation={() => handleSelectConversation(conversation.chatId)}
        />
      ))}
    </List>
  );
}
