import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { TbMessageCircle, TbUserCircle, TbSettings } from 'react-icons/tb';
import { MdOutlineMessage } from 'react-icons/md';
import { GoSignOut } from 'react-icons/go';
import Sidebar from './Sidebar';
import SettingsPopup from './SettingsPopup';
import '../styles/Navbar.scss';

const Navbar = () => {
  const [page, setPage] = useState('chat');
  const [settings, setSettings] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isClick, setIsClick] = useState(false);

  const handleClick = (page) => {
    setPage(page);
    setIsActive(true);
  };

  const handleSettings = () => {
    setSettings(!settings);
    setIsClick(!isClick);
  };
 
  return (
    <>
      <div className="navbar">
        <div className="navbar-item-container navbar-icon-container">
          <TbMessageCircle />
        </div>
        <div className="navbar-items-list">
          <div
            className={
              isActive && page === 'user'
                ? 'navbar-item-container active-item'
                : 'navbar-item-container'
            }
          >
            <TbUserCircle onClick={() => handleClick('user')} />
          </div>
          <div
            className={
              isActive && page === 'chat'
                ? 'navbar-item-container active-item'
                : 'navbar-item-container'
            }
          >
            <MdOutlineMessage onClick={() => handleClick('chat')} />
          </div>
        </div>
        <div className="navbar-item-container navbar-more-container">
          <div className="navbar-item-container navbar-settings">
            <TbSettings onClick={handleSettings} />
          </div>
          <GoSignOut onClick={() => signOut(auth)} />
        </div>
      </div>
      <Sidebar currentPage={page} />
      {settings ? <SettingsPopup close={handleSettings} /> : null}
    </>
  );
};

export default Navbar;
