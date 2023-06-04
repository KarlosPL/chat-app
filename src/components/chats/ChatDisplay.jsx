import React from 'react';
import Messages from '../Messages';
import '../../styles/ChatDisplay.scss';

const ChatDisplay = () => {
  return (
    <div className="chat-display">
      <Messages />
    </div>
  );
};

export default ChatDisplay;
