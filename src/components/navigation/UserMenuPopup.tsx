import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

type UserMenuPopupProps = {
  onLogout: () => void;
  toggleMenu: (expanded: boolean) => void;
};

const UserMenuPopup: React.FC<UserMenuPopupProps> = ({ onLogout, toggleMenu }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closePopup = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!menuRef.current?.contains(target)) {
        toggleMenu(false);
      }
    };
    document.body.addEventListener('click', closePopup);
    return () => {
      document.body.removeEventListener('click', closePopup);
    };
  }, [toggleMenu]);

  return (
    <div className="absolute bg-white right-0 rounded shadow w-48 mt-2" ref={menuRef}>
      <Link to="/account" className="block p-2 px-5 hover:bg-gray-200 w-full text-left">
        <FontAwesomeIcon icon={faCog} />
        <span className="pl-2">Einstellungen</span>
      </Link>
      <button
        onClick={onLogout}
        className="block p-2 px-5 hover:bg-gray-200 w-full text-left focus:outline-none"
        title="Logout"
      >
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span className="pl-2">Logout</span>
      </button>
    </div>
  );
};

export default UserMenuPopup;
