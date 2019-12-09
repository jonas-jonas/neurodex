import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, User } from '../contexts/auth';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

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
		<nav className="flex items-center justify-between flex-wrap bg-white py-2 px-5 border-blue-500 border-b-4 shadow">
			<div className="block">
				<button className="flex items-center px-3 py-2 rounded focus:outline-none">
					<i className="material-icons">menu</i>
				</button>
			</div>
			<div className="flex items-center flex-shrink-0 text-white mr-6">
				<Link className="font-semibold text-xl tracking-tight" to="/">
					<img
						src="/static/assets/logo-wide.png"
						className="h-8"
						alt="Neurodex Logo"
					/>
				</Link>
			</div>
			<div className="block">
				{!isAuthenticated && (
					<Link
						className="flex items-center px-5 py-2 rounded text-white font-bold bg-blue-400 focus:outline-none hover:shadow-md hover:bg-blue-300" 
						to="/login"
					>
						Login
					</Link>
				)}
				{isAuthenticated && user && (
					<UserMenu user={user} onLogout={handleLogout} />
				)}
			</div>
		</nav>
	);
};

type UserMenuProps = {
	user: User;
	onLogout: () => void;
};

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
	return (
		<div className="flex">
			<UserMenuEntry>{user.name}</UserMenuEntry>
			<UserMenuEntry onClick={onLogout} raised>Logout</UserMenuEntry>
		</div>
	);
};

type UserMenuEntryProps = {
	onClick?: () => void;
	raised?: boolean;
};

const UserMenuEntry: React.FC<UserMenuEntryProps> = ({
	onClick,
	children,
	raised
}) => {
	const classes = classNames('px-5 py-2 rounded ml-3', {
		'shadow text-white font-bold bg-blue-400 focus:outline-none hover:shadow-md hover:bg-blue-300': raised,
		'text-gray-700': !raised,
		'cursor-default': !onClick
	});
	return (
		<button className={classes} onClick={onClick}>
			{children}
		</button>
	);
};

export default Navigation;
