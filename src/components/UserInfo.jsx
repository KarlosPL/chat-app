import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { secondsToTime } from '../utils';
import '../styles/UserInfo.scss';

const UserInfo = () => {
  const { data } = useContext(ChatContext);
  const avatarSrc = require('../assets/img/default_avatar.png');

  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'users', data.user.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    data.user.uid && getChats();
  }, [data.user.uid]);

  const signUpDate = secondsToTime(chats.joinDate / 1000);

  return (
    <div className="user-info">
      <div className="user-info-title">
        <h2>{chats.displayName}</h2>
      </div>
      <div className="user-info-avatar">
        {chats.photoURL === '' || chats.photoURL === null ? (
            <img src={avatarSrc} alt="default_avatar" />
          ) : (
          <img src={chats.photoURL} alt={chats.displayName} />
        )}
      </div>
      <div className="user-info-about">
        <p>{chats.desc}</p>
      </div>
      <div className="user-info-joined">
        <h4>Joined</h4>
        <p>{signUpDate}</p>
      </div>
    </div>
  );
};

export default UserInfo;
