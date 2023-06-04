import React, { useContext, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { TbUserCircle } from 'react-icons/tb';
import { CSSTransition } from 'react-transition-group';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase';
import { secondsToTime } from '../../utils';
import '../../styles/SidebarUser.scss';

const SidebarUser = () => {
  const nodeRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const avatarSrc = require('../../assets/img/default_avatar.png');
  const [isClick, setIsClick] = useState(true);

  const handleIsClick = () => {
    setIsClick(!isClick);
  };

  const [chats, setChats] = useState([]);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const signUpDate = secondsToTime(currentUser.metadata.createdAt / 1000);

  return (
    <div className="sidebar-user">
      <div className="sidebar-user-title">
        <h2>My profile</h2>
      </div>
      <div className="sidebar-user-avatar">
        {currentUser.photoURL === '' || currentUser.photoURL === null ? (
            <img src={avatarSrc} alt="default_avatar" />
          ) : (
            <img src={currentUser.photoURL} alt={currentUser.displayName} />
        )}
        <p>{currentUser.displayName}</p>
      </div>
      <div className="sidebar-user-about">
        <p>{chats?.desc}</p>
      </div>
      <div className="sidebar-user-information">
        <div className="sidebar-user-information-option">
          <div className="sidebar-user-information-option-header">
            <button onClick={handleIsClick}>
              <TbUserCircle /> Info
            </button>
          </div>
          <CSSTransition
            nodeRef={nodeRef}
            in={isClick}
            classNames="appear"
            timeout={100}
          >
            <div
              ref={nodeRef}
              className="sidebar-user-information-option-body appear-enter-done"
            >
              <div className="option-body-collapse">
                <h4>Name :</h4>
                <p>{currentUser.displayName}</p>
              </div>
              <div className="option-body-collapse">
                <h4>Email :</h4>
                <p>{currentUser.email}</p>
              </div>
              <div className="option-body-collapse">
                <h4>Joined :</h4>
                <p>{signUpDate}</p>
              </div>
            </div>
          </CSSTransition>
        </div>
      </div>
    </div>
  );
};

export default SidebarUser;
