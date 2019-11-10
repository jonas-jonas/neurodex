import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
	return (
		<nav className="flex items-center justify-between flex-wrap bg-blue-500 p-3">
			<div className="flex items-center flex-shrink-0 text-white mr-6">
				<Link className="font-semibold text-xl tracking-tight" to="/">
					Neurodex
				</Link>
			</div>
			<div className="block lg:hidden">
				<button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
					<svg
						className="fill-current h-3 w-3"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Menu</title>
						<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
					</svg>
				</button>
			</div>
		</nav>
	);
};

export default Navigation;
