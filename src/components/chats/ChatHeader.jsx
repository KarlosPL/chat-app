import React, { useEffect, useContext, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { TbUser } from 'react-icons/tb';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { db } from '../../firebase';
import UserInfo from '../UserInfo';
import '../../styles/ChatHeader.scss';

const ChatHeader = (props) => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const [userInfoPopup, setUserInfoPopup] = useState(false);

  const [user, setUser] = useState([]);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'users', data.user.uid), (doc) => {
        setUser(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid, data.user.uid]);

  return (
    <div className="chat-header">
      <div className="chat-header-user">
        <div className="chat-header-user-section chat-header-user-section-avatar-container">
          <img
            src={user.photoURL === '' || user.photoURL === null ? props.avatar : user.photoURL}
            alt="avatar"
          />
        </div>
        <div className="chat-header-user-section chat-header-user-section-name-container">
          <span>{data.user.displayName}</span>
        </div>
      </div>
      <div className="chat-header-interaction">
        <TbUser onClick={() => setUserInfoPopup(!userInfoPopup)} />
      </div>
      {userInfoPopup ? <UserInfo /> : null}
    </div>
  );
};

export default ChatHeader;
