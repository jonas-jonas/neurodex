import React from 'react';
import { AuthContext } from '../contexts/auth';
import { User } from '../data/models';

type AuthContextData = {
  user?: User;
  isAuthenticated?: boolean;
  authenticate?: (name: string, password: string) => Promise<Response>;
  deauthenticate?: () => Promise<boolean>;
  registerUser?: (username: string, password: string, repeatPassword: string) => Promise<Response>;
};

export const MockAuthContextProvider: React.FC<AuthContextData> = ({
  children,
  user,
  isAuthenticated,
  authenticate,
  deauthenticate,
  registerUser
}) => {
  return (
    <AuthContext.Provider
      value={{
        user: user,
        isAuthenticated: isAuthenticated || !!user,
        authenticate: authenticate || jest.fn(),
        deauthenticate: deauthenticate || jest.fn(),
        registerUser: registerUser || jest.fn()
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
