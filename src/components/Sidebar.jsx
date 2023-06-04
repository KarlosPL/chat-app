import React from 'react';
import SidebarChat from './sidebars/SidebarChat';
import SidebarUser from './sidebars/SidebarUser';
import '../styles/Sidebar.scss';

const Sidebar = (props) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {props.currentPage === 'user' ? (
          <SidebarUser />
        ) : null}
        {props.currentPage === 'chat' ? <SidebarChat /> : null}
      </div>
    </div>
  );
};

export default Sidebar;
