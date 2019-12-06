import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';
import { useHistory } from 'react-router-dom';

const Navigation: React.FC = () => {
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
		<nav className="flex items-center justify-between flex-wrap bg-white py-2 px-5 border-blue-500 border-b-4">
			<div className="block">
				<button className="flex items-center px-3 py-2 bg-blue-400 rounded text-white focus:outline-none hover:shadow-md">
					<i className="material-icons">menu</i>
				</button>
			</div>
			<div className="flex items-center flex-shrink-0 text-white mr-6">
				<Link className="font-semibold text-xl tracking-tight" to="/">
					<img src="/static/assets/logo-wide.png" className="h-8" alt="Neurodex Logo"/>
				</Link>
			</div>
			<div className="block">
				{!isAuthenticated && (
					<Link
						className="flex items-center px-5 py-2 rounded text-white font-bold bg-blue-400 focus:outline-none hover:shadow-md"
						to="/login"
					>
						Login
					</Link>
				)}
				{isAuthenticated && user && (
					<button
						className="flex items-center px-5 py-2 rounded text-white font-bold bg-blue-400 focus:outline-none hover:shadow-md"
						onClick={handleLogout}
					>
						Logout {user.name}
					</button>
				)}
			</div>
		</nav>
	);
};

export default Navigation;
