import React, { useContext } from 'react';
import ChatDisplay from './chats/ChatDisplay';
import ChatHeader from './chats/ChatHeader';
import ChatInput from './chats/ChatInput';
import { ChatContext } from '../context/ChatContext';
import { TbMessageCircle } from 'react-icons/tb';
import '../styles/Chat.scss';
import '../styles/Messages.scss';

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      {!data.user.uid ? (
        <div className="chat-logo">
          <TbMessageCircle />
        </div>
      ) : (
        <div className="chat-wrapper">
          <ChatHeader avatar={require(`../assets/img/default_avatar.png`)} />
          <ChatDisplay />
          <ChatInput />
        </div>
      )}
    </div>
  );
};

export default Chat;
