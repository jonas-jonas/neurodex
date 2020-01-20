import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { User } from '../../data/models';
import UserMenuPopup from './UserMenuPopup';
type UserMenuProps = {
  user: User;
  onLogout: () => void;
};

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [expanded, setExpanded] = useState(false);

  const handleUserMenuClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="relative">
      <button
        className="px-5 py-1 rounded border border-blue-800 text-blue-800 font-bold focus:shadow-outline hover:bg-gray-100"
        onClick={handleUserMenuClick}
        title="Usermenu"
      >
        <span className="uppercase mr-3">{user.username}</span>
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
      {expanded && <UserMenuPopup onLogout={onLogout} toggleMenu={setExpanded} />}
    </div>
  );
};

export default UserMenu;
