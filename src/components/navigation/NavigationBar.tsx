import { faGithubSquare } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { PageContext } from '../../contexts/pagecontext';
import UserMenu from './UserMenu';

const Navigation: React.FC = () => {
  const { pageTitle } = useContext(PageContext);
  const { isAuthenticated, user, deauthenticate } = useContext(AuthContext);
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
    <nav className="flex items-center justify-between flex-wrap bg-white py-2 px-5 border-blue-500 border-b-4 shadow fixed w-full">
      <div className="block">
        <Link className="font-semibold text-xl tracking-tight" to="/">
          <img src="/static/assets/logo-wide.png" className="h-8" alt="Neurodex Logo" />
        </Link>
      </div>
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
            className="flex items-center px-5 py-1 rounded border border-blue-800 text-blue-800 font-bold focus:shadow-outline hover:bg-gray-100"
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
