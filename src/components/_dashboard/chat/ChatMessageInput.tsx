import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import roundSend from '@iconify/icons-ic/round-send';
// material
import { styled } from '@mui/material/styles';
import { Divider, IconButton, Input, InputAdornment } from '@mui/material';
// @types
//
import EmojiPicker from '../../EmojiPicker';
import { encryptMessage } from '../../../utils/security';
import useAuth from '../../../hooks/useAuth';
import { Message, setTyping } from '../../../utils/firebase';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: 56,
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  paddingLeft: theme.spacing(2)
}));

// ----------------------------------------------------------------------

type ChatMessageInputProps = {
  disabled: boolean;
  conversationId: string;
  onSend: (data: Message) => void;
};

export default function ChatMessageInput({
  disabled,
  conversationId,
  onSend
}: ChatMessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const { therapistId } = useAuth();

  useEffect(() => {
    setTyping(message.length > 0, conversationId, therapistId);
    return () => setTyping(false, conversationId, therapistId);
  }, [message, conversationId, therapistId]);

  const onRemoveTextInputFocus = () => {
    setTyping(false, conversationId, therapistId);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = () => {
    if (!message) {
      return '';
    }
    if (onSend && therapistId) {
      const formattedMessage = {
        _id: uuidv4(),
        text: encryptMessage(message),
        createdAt: new Date(),
        chatId: conversationId,
        user: {
          _id: therapistId,
          avatar: ''
        },
        sent: false,
        senderId: therapistId,
        received: false
      };
      onSend(formattedMessage);
    }
    return setMessage('');
  };

  return (
    <RootStyle>
      <Input
        disabled={disabled}
        fullWidth
        value={message}
        disableUnderline
        onKeyUp={handleKeyUp}
        onBlur={onRemoveTextInputFocus}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        startAdornment={
          <InputAdornment position="start">
            <EmojiPicker disabled={disabled} value={message} setValue={setMessage} />
          </InputAdornment>
        }
        sx={{ height: '100%' }}
      />

      <Divider orientation="vertical" flexItem />

      <IconButton color="primary" disabled={!message} onClick={handleSend} sx={{ mx: 1 }}>
        <Icon icon={roundSend} width={24} height={24} />
      </IconButton>

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
    </RootStyle>
  );
}
