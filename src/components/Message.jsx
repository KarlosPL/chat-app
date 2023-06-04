import React, { useContext, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import '../styles/Message.scss';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const avatarSrc = require('../assets/img/default_avatar.png');
  const ref = useRef();

  const [chats, setChats] = useState([]);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'users', message.senderId), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid, message.senderId]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && 'owner'}`}
    >
      <div className="message-info">
        {message.senderId === currentUser.uid ? (
          <img
            src={chats.photoURL === '' || chats.photoURL === null ? avatarSrc : chats.photoURL}
            alt="avatar"
          />
        ) : (
          <img
            src={chats.photoURL === '' || chats.photoURL === null ? avatarSrc : chats.photoURL}
            alt="avatar"
          />
        )}
      </div>
      <div className="message-content">
        {message.text === '' ? null : <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="img" />}
      </div>
    </div>
  );
};

export default Message;
