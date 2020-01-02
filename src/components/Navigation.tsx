import classNames from 'classnames';
import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';
import { PageContext } from '../contexts/pagecontext';
import { User } from '../data/models';

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
					<img
						src="/static/assets/logo-wide.png"
						className="h-8"
						alt="Neurodex Logo"
					/>
				</Link>
			</div>
			<div className="mr-6">
				<h2 className="font-bold uppercase">{pageTitle}</h2>
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
			<UserMenuEntry>{user.username}</UserMenuEntry>
			<UserMenuEntry onClick={onLogout} raised>
				Logout
			</UserMenuEntry>
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
	const classes = classNames('px-5 py-2 rounded ml-3 focus:outline-none', {
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
