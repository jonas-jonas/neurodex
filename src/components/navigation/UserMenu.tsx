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
        className="px-2 py-1 rounded focus:outline-none text-gray-900 font-semibold hover:bg-gray-200 focus:bg-gray-200"
        onClick={handleUserMenuClick}
        title="Usermenu"
      >
        <span className="mr-3">{user.email}</span>
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
      {expanded && <UserMenuPopup onLogout={onLogout} toggleMenu={setExpanded} />}
    </div>
  );
};

export default UserMenu;
