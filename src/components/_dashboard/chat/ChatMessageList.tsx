import { useEffect, useRef } from 'react';
import { Message } from '../../../utils/firebase';
import Scrollbar from '../../Scrollbar';
import ChatMessageItem from './ChatMessageItem';
import { RootState, useSelector } from '../../../redux/store';

// ----------------------------------------------------------------------

type ChatMessageListProps = {
  conversation: Message[];
  chatId: string;
};

export default function ChatMessageList({ conversation, chatId }: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [conversation]);

  const { allConversations } = useSelector((state: RootState) => state.chat);
  const activeChat = allConversations.filter(
    (conversation: any) => conversation?.chatId === chatId
  );

  return (
    <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, height: 1 }}>
      {conversation.map((message, index) => (
        <ChatMessageItem
          key={String(index)}
          message={message}
          receiverName={activeChat?.[0]?.user?.fullname ?? ''}
        />
      ))}
    </Scrollbar>
  );
}
