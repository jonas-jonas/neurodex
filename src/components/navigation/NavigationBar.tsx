import { faGithubSquare } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useUserContext } from '../../contexts/auth';
import { PageContext } from '../../contexts/pagecontext';
import UserMenu from './UserMenu';

const Navigation: React.FC = () => {
  const { pageTitle } = useContext(PageContext);
  const { isAuthenticated, user, deauthenticate } = useUserContext();
  const history = useHistory();

  /**
   * Triggers the logout of the AuthContext
   *
   * If the logout is successful the current route is changed to /login
   */
  const handleLogout = async () => {
    const loggedOut = await deauthenticate();
    if (loggedOut) {
      history.push('/login');
    }
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-white py-1 px-2 border-blue-700 border-b-4 shadow fixed w-full z-50">
      <Link
        className="flex font-semibold text-2xl tracking-tight rounded transition-colors duration-300 hover:bg-gray-200 px-2 items-center"
        to="/"
      >
        <img className="h-6 mr-2" src="/static/assets/logo.png" alt="Neurodex logo" />
        <span className="text-blue-700">Neuro</span>
        <span className="text-orange-500">DEX</span>
      </Link>
      <div className="mr-6">
        <h2 className="font-bold">{pageTitle}</h2>
      </div>
      <div className="flex items-center">
        <a
          href="https://github.com/jonas-jonas/neurodex"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-1 mr-3 text-gray-600 hover:text-black"
          title="Source Code anzeigen"
        >
          <FontAwesomeIcon icon={faGithubSquare} size={'lg'} />
        </a>
        {!isAuthenticated && (
          <Link
            className="px-2 py-1 rounded focus:outline-none text-gray-900 font-semibold hover:bg-gray-200 focus:bg-gray-200"
            to="/login"
          >
            Login
          </Link>
        )}
        {isAuthenticated && user && <UserMenu user={user} onLogout={handleLogout} />}
      </div>
    </nav>
  );
};

export default Navigation;
