import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';
import { useHistory } from "react-router-dom";

const Navigation: React.FC = () => {
	const { isAuthenticated, user, deauthenticate } = useContext(AuthContext);
	const history = useHistory();

	const handleLogout = async () => {
		const loggedOut = await deauthenticate();
		if(loggedOut) {
			history.push('/login');
		}
	}

	return (
		<nav className="flex items-center justify-between flex-wrap bg-blue-500 p-3">
			<div className="flex items-center flex-shrink-0 text-white mr-6">
				<Link className="font-semibold text-xl tracking-tight" to="/">
					Neurodex
				</Link>
			</div>
			<div className="block">
				{!isAuthenticated && (
					<Link
						className="flex items-center px-5 py-2 rounded border-gray-300 text-white font-bold hover:bg-blue-400 focus:outline-none hover:shadow-md"
						to="/login"
					>
						Login
					</Link>
				)}
				{isAuthenticated && user && (
					<>
						<button
							className="flex items-center px-5 py-2 rounded border-gray-300 text-white font-bold hover:bg-blue-400 focus:outline-none hover:shadow-md"
							onClick={handleLogout}
						>
							Logout {user.name}
						</button>
					</>
				)}
			</div>
			<div className="block lg:hidden">
				<button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
					<i className="material-icons">menu</i>
				</button>
			</div>
		</nav>
	);
};

export default Navigation;
