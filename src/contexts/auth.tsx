import React, { useEffect, useMemo, useState } from 'react';
import { User } from '../data/models';
import { api } from '../util/api';

type AuthContextData = {
  user?: User;
  isAuthenticated: boolean;
  authenticate: (name: string, password: string) => Promise<Response>;
  deauthenticate: () => Promise<boolean>;
  registerUser: (username: string, password: string, repeatPassword: string) => Promise<Response>;
};

export const AuthContext = React.createContext<AuthContextData>({
  isAuthenticated: false,
  authenticate: () => Promise.reject(),
  deauthenticate: () => Promise.reject(),
  registerUser: () => Promise.reject()
});

export const AuthContextProvider: React.FC = ({ children }) => {
  /** The current user */
  const [user, setUser] = useState<User>();

  /** indicates whether the user is currently logged in */
  const isAuthenticated = useMemo(() => {
    return user != null;
  }, [user]);

  useEffect(() => {
    /**
     * Fetches the current user from the api.
     */
    const fetchCurrentUser = async (): Promise<void> => {
      try {
        const data = await api.get('users/current');
        const authenticationResponse = await data.json();
        setUser(authenticationResponse);
      } catch (error) {
        setUser(undefined);
      }
    };
    fetchCurrentUser();
  }, []);

  /**
   * Authenticates the user with the api
   *
   * The supplied email and password are sent to the API.
   * If the API succesfully authenticates and returns the user object, the current user state is set to the returned object
   *
   * @param email The email of the user
   * @param password The password of the user
   */
  const authenticate = (email: string, password: string) => {
    const login = async (): Promise<Response> => {
      // TODO: Check if the user is already logged in
      const data = new FormData();
      data.append('email', email);
      data.append('password', password);
      try {
        const response = await api.post('auth/login', {
          body: data
        });
        if (response.status === 200) {
          const authenticationResponse = await response.json();
          setUser(authenticationResponse);
        }
        return response;
      } catch (error) {
        return error.response;
      }
    };
    return login();
  };

  /**
   * Logs the current user out
   *
   */
  const deauthenticate = () => {
    const logout = async (): Promise<boolean> => {
      try {
        const response = await api.get('auth/logout');
        return response.status === 200;
      } finally {
        setUser(undefined);
        return true;
      }
    };
    return logout();
  };

  /**
   * Registers a new user with the API
   *
   * If the registeration is not successful validation messages are displayed.
   * @param values The register form values
   */
  const registerUser = async (email: string, password: string, repeatPassword: string) => {
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    data.append('repeatPassword', repeatPassword);

    return await api.post('users/user', { body: data });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authenticate, deauthenticate, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};
