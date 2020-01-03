import { faChevronDown, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useRef, useState } from 'react';
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
		console.log('??');
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
						className="flex items-center px-5 py-1 rounded border border-blue-800 text-blue-800 font-bold focus:shadow-outline hover:bg-gray-100"
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

	const [expanded, setExpanded] = useState(false);

	const handleUserMenuClick = () => {
		setExpanded(!expanded);
	}

	return (
		<div className="relative">
			<button className="px-5 py-1 rounded border border-blue-800 text-blue-800 font-bold focus:shadow-outline hover:bg-gray-100 mb-2" onClick={handleUserMenuClick}>
				<span className="uppercase mr-3">
					{user.username}
				</span>
				<FontAwesomeIcon icon={faChevronDown} />
			</button>
			{expanded && <UserMenuPopup onLogout={onLogout} toggleMenu={setExpanded} />}
		</div>
	);
};

type UserMenuPopupProps = {
	onLogout: () => void;
	toggleMenu: (expanded: boolean) => void;
}

const UserMenuPopup: React.FC<UserMenuPopupProps> = ({ onLogout, toggleMenu }) => {

	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const closePopup = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (!menuRef.current?.contains(target)) {
				toggleMenu(false);
			}
		}
		document.body.addEventListener('click', closePopup);
		return () => {
			document.body.removeEventListener('click', closePopup);
		}
	}, [toggleMenu]);


	return <div className="absolute bg-white right-0 rounded shadow w-48" ref={menuRef}>
		<Link to="/account" className="block p-2 px-5 hover:bg-gray-200 w-full text-left">
			<FontAwesomeIcon icon={faCog} />
			<span className="pl-2">
				Einstellungen
			</span>
		</Link>
		<button onClick={onLogout} className="block p-2 px-5 hover:bg-gray-200 w-full text-left focus:outline-none">
			<FontAwesomeIcon icon={faSignOutAlt} />
			<span className="pl-2">
				Logout
			</span>
		</button>
	</div>
}

export default Navigation;
