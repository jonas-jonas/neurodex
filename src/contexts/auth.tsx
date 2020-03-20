import React, { useEffect, useMemo, useState } from 'react';
import { User } from '../data/models';
import { api } from '../util/api';

type AuthContextData = {
  user?: User;
  isAuthenticated: boolean;
  authenticate: (name: string, password: string) => Promise<Response>;
  deauthenticate: () => Promise<boolean>;
  registerUser: (name: string, email: string, password: string, repeatPassword: string) => Promise<Response>;
  isLoadingUser: boolean;
  updateData: (name: string, email: string) => Promise<Record<string, any>>;
  updatePassword: (oldPassword: string, password: string, repeatPassword: string) => Promise<Response>;
};

export const AuthContext = React.createContext<AuthContextData | undefined>(undefined);

export const AuthContextProvider: React.FC = ({ children }) => {
  /** The current user */
  const [user, setUser] = useState<User>();
  const [isLoadingUser, setLoadingUser] = useState(true);

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
      } finally {
        setLoadingUser(false);
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
      const data = {
        email,
        password
      };
      try {
        const response = await api.post('auth/login', {
          json: data
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
  const registerUser = async (name: string, email: string, password: string, repeatPassword: string) => {
    const data = {
      name,
      email,
      password,
      repeatPassword
    };

    return await api.post('users', { json: data });
  };

  const updateData = async (email: string, name: string): Promise<Record<string, any>> => {
    const data = {
      email,
      name
    };
    const response = await api.put('users/update/data', { json: data });
    if (response.status !== 200) {
      return await response.json();
    } else {
      setUser(await response.json());
      return {};
    }
  };

  const updatePassword = async (oldPassword: string, password: string, repeatPassword: string): Promise<Response> => {
    const data = {
      oldPassword,
      password,
      repeatPassword
    };
    try {
      const response = await api.put('users/update/password', { json: data });
      return response;
    } catch (error) {
      return error.response;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authenticate,
        deauthenticate,
        registerUser,
        isLoadingUser,
        updateData,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useUserContext must be used within a AuthContextProvider.');
  }
  return context;
};
