import React, { useEffect, useReducer } from 'react';
import LoadingIndicator from '../components/utility/LoadingIndicator';
import { User } from '../data/models';
import { api } from '../util/api';

type AuthContextData = {
  user?: User;
  isAuthenticated: boolean;
  authenticate: (name: string, password: string) => Promise<Response>;
  deauthenticate: () => Promise<boolean>;
  registerUser: (name: string, email: string, password: string, repeatPassword: string) => Promise<Response>;
  isLoadingUser: boolean;
  updateData: (name: string, email: string) => Promise<Response | undefined>;
  updatePassword: (oldPassword: string, password: string, repeatPassword: string) => Promise<Response>;
};

export const AuthContext = React.createContext<AuthContextData | undefined>(undefined);

type UserReducerAction =
  | { type: 'LOADING_USER' }
  | { type: 'AUTHENTICATED'; user: User }
  | { type: 'NOT_AUTHENTICATED'; error?: string };

type UserReducerState = {
  loading: boolean;
  user?: User;
  error?: string;
  authenticated: boolean;
};

function userReducer(state: UserReducerState, action: UserReducerAction): UserReducerState {
  switch (action.type) {
    case 'LOADING_USER':
      return { loading: true, authenticated: false };
    case 'AUTHENTICATED':
      return { loading: false, user: action.user, authenticated: true };
    case 'NOT_AUTHENTICATED':
      return { loading: false, error: action.error, authenticated: false };
  }
}

type AuthContextProviderProps = {
  initialUser?: User;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children, initialUser }) => {
  /** The current user */
  const [userState, dispatch] = useReducer(userReducer, { loading: true, authenticated: false });

  /**
   * Initially tries to fetch the currently logged in user
   */
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const data = await api.get('users/current');
        const authenticationResponse = await data.json();
        dispatch({ type: 'AUTHENTICATED', user: authenticationResponse });
      } catch (error) {
        dispatch({ type: 'NOT_AUTHENTICATED', error: error });
      }
    }
    if (initialUser) {
      dispatch({ type: 'AUTHENTICATED', user: initialUser });
    } else {
      dispatch({ type: 'LOADING_USER' });
      fetchCurrentUser();
    }
  }, [initialUser]);

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
        password,
      };
      try {
        const response = await api.post('auth/login', {
          json: data,
        });
        if (response.status === 200) {
          const authenticationResponse = await response.json();
          dispatch({ type: 'AUTHENTICATED', user: authenticationResponse });
        }
        return response;
      } catch (error) {
        dispatch({ type: 'NOT_AUTHENTICATED', error: error.response });
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
        dispatch({ type: 'NOT_AUTHENTICATED' });
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
      repeatPassword,
    };

    return await api.post('users', { json: data });
  };

  const updateData = async (email: string, name: string): Promise<Response | undefined> => {
    const data = {
      email,
      name,
    };
    try {
      const response = await api.put('users/update/data', { json: data });
      const user = await response.json();
      dispatch({ type: 'AUTHENTICATED', user: user });
      return undefined;
    } catch (error) {
      return error.response;
    }
  };

  const updatePassword = async (oldPassword: string, password: string, repeatPassword: string): Promise<Response> => {
    const data = {
      oldPassword,
      password,
      repeatPassword,
    };
    try {
      return await api.put('users/update/password', { json: data });
    } catch (error) {
      return error.response;
    }
  };

  if (userState.loading) {
    return <LoadingIndicator text="Lädt..." />;
  }

  return (
    <AuthContext.Provider
      value={{
        user: userState.user,
        isAuthenticated: userState.authenticated,
        authenticate,
        deauthenticate,
        registerUser,
        isLoadingUser: userState.loading,
        updateData,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useUserContext must be used within a AuthContextProvider.');
  }
  return context;
};
