import React, { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { db } from '../../firebase';
import SidebarContacts from './SidebarContacts';
import '../../styles/SideBarChat.scss';

const SidebarChat = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: 'CHANGE_USER', payload: u });
  };

  const secondsToTime = (seconds) => {
    const x = new Date().getTimezoneOffset() * 60000;
    return new Date(seconds * 1000 - x).toISOString().slice(11, 16);
  };

  return (
    <div className="sidebar-chat">
      <div className="sidebar-chat-title">
        <h2>Chats</h2>
      </div>
      <SidebarContacts />
      <div className="sidebar-chat-users">
        {chats && Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div
            className="user-chat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
            >         
              <div className="user-chat-info">
                {chat[1].userInfo.displayName.length > 10 ?  (
                   <span>{chat[1].userInfo.displayName.substring(0, 10) + "..."}</span>
                ) : (
                  <span>{chat[1].userInfo.displayName}</span>
                ) }
              
              {chat[1].lastMessage.text === '' && chat[1].lastMessage.img ? (
                  <p>{chat[1].userInfo.displayName} sent a photo</p>
                ) : (
                  chat[1].lastMessage.text.length > 15 ?  (
                    <p>{chat[1].lastMessage.text.substring(0, 15) + "..."}</p>
                 ) : (
                   <p>{chat[1].lastMessage.text}</p>
                 ) 
                )}
              </div>
              <div className="user-chat-time">
                <p>
                  {chat[1].date ? secondsToTime(chat[1].date.seconds) : null}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SidebarChat;
