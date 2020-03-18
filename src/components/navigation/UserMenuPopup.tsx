import { faDiscourse } from '@fortawesome/free-brands-svg-icons';
import { faCog, faColumns, faSignOutAlt, faUsersCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

type UserMenuPopupProps = {
  onLogout: () => void;
  toggleMenu: (expanded: boolean) => void;
};

const UserMenuPopup: React.FC<UserMenuPopupProps> = ({ onLogout, toggleMenu }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(AuthContext);

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
    <div className="absolute bg-white right-0 rounded shadow-lg border border-gray-400 w-full mt-2 pt-2" ref={menuRef}>
      <span className="pl-3 text-sm font-bold uppercase text-gray-600">Account</span>
      <Link to="/account" className="block p-2 px-5 hover:bg-gray-200 w-full text-left" title="Einstellungen">
        <FontAwesomeIcon icon={faCog} className="hover:bg-blue-500" />
        <span className="pl-2">Einstellungen</span>
      </Link>
      {user && user.roles.includes('ADMIN') && (
        <>
          <span className="pl-3 text-sm font-bold uppercase text-gray-600">Admin</span>
          <Link to="/admin" className="block p-2 px-5 hover:bg-gray-200 w-full text-left" title="Admin Dashboard">
            <FontAwesomeIcon icon={faColumns} className="hover:bg-blue-500" />
            <span className="pl-2">Dashboard</span>
          </Link>
          <Link
            to="/admin/users"
            className="block p-2 px-5 hover:bg-gray-200 w-full text-left"
            title="Benutzerverwaltung"
          >
            <FontAwesomeIcon icon={faUsersCog} className="hover:bg-blue-500" />
            <span className="pl-2">Benutzer</span>
          </Link>
          <Link to="/admin/courses" className="block p-2 px-5 hover:bg-gray-200 w-full text-left" title="Kurse">
            <FontAwesomeIcon icon={faDiscourse} className="hover:bg-blue-500" />
            <span className="pl-2">Kurse</span>
          </Link>
        </>
      )}
      <button
        onClick={onLogout}
        className="block p-2 px-5 hover:bg-gray-200 w-full text-left focus:outline-none border-t border-gray-400"
        title="Logout"
      >
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span className="pl-2">Logout</span>
      </button>
    </div>
  );
};

export default UserMenuPopup;
