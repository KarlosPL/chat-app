import React, { useContext, useState } from 'react';
import { TbSearch } from 'react-icons/tb';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase';
import '../../styles/SidebarContacts.scss';

const SidebarContacts = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const avatarSrc = require('../../assets/img/default_avatar.png');
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', username.toLowerCase())
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (key) => {
    key.code === 'Enter' && handleSearch() && setUser(null);
  };

  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });

        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
          },

          [combinedId + '.lastMessage']: {
            text: '',
          },
          [combinedId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
          },
          [combinedId + '.lastMessage']: {
            text: '',
          },
          [combinedId + '.date']: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername('');
  };

  return (
    <div className="sidebar-contacts">
      <div className="sidebar-contacts-serchbar">
        <span>
          <TbSearch />
        </span>
        <input
          type="text"
          maxLength={32}
          id="searchbar"
          placeholder="Search for a user"
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="sidebar-contacts-users" onClick={handleSelect}>
          <img
            src={user.photoURL === '' || user.photoURL === null ? avatarSrc : user.photoURL}
            alt="avatar"
          />
          <div className="sidebar-contacts-users-info">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarContacts;
