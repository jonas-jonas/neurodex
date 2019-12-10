import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../util/api';

type AuthContextData = {
	user?: User;
	isAuthenticated: boolean;
	authenticate: (name: string, password: string) => Promise<Response>;
	deauthenticate: () => Promise<boolean>;
};

/**
 * DB User object
 */
export type User = {
	id: string;
	name: string;
	admin: boolean;
};
/**
 * Data sent by the authentication endpoint
 */
type AuthenticationResponse = {
	user: User;
};

export const AuthContext = React.createContext<AuthContextData>({
	isAuthenticated: false,
	authenticate: () => Promise.reject(),
	deauthenticate: () => Promise.reject()
});

export const AuthContextProvider: React.FC = ({ children }) => {
	/** The current user */
	const [user, setUser] = useState<User>();

	/** indicates whether the user is currently logged in */
	const isAuthenticated = useMemo(() => user != null, [user]);

	useEffect(() => {
		/**
		 * Fetches the current user from the api.
		 */
		const fetchCurrentUser = async (): Promise<void> => {
			const data = await api.get('user');
			const authenticationResponse: AuthenticationResponse = await data.json();
			setUser(authenticationResponse.user);
		};
		fetchCurrentUser();
	}, []);

	/**
	 * Authenticates the user with the api
	 *
	 * The supplied name and password are sent to the API.
	 * If the API succesfully authenticates and returns the user object, the current user state is set to the returned object
	 *
	 * @param name The name of the user
	 * @param password The password of the user
	 */
	const authenticate = (name: string, password: string) => {
		const login = async (): Promise<Response> => {
			// TODO: Check if the user is already logged in
			const data = new FormData();
			data.append('username', name);
			data.append('password', password);
			const response = await api.post('login', {
				body: data
			});
			if (response.status === 200) {
				const authenticationResponse: AuthenticationResponse = await response.json();
				setUser(authenticationResponse.user);
			}
			// TODO: Handle errors?
			return response;
		};
		return login();
	};

	/**
	 * Logs the current user out
	 *
	 */
	const deauthenticate = () => {
		const logout = async (): Promise<boolean> => {
			const response = await api.get('logout');
			if (response.status === 200) {
				setUser(undefined);
				return true;
			}
			return false;
		};
		return logout();
	};

	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, authenticate, deauthenticate }}
		>
			{children}
		</AuthContext.Provider>
	);
};
