import { act, cleanup, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './LoginPage';
import { MockAuthContextProvider } from '../../contexts/authcontext.mock';

afterEach(cleanup);

describe('LoginPage', () => {
  it('renders login form', async () => {
    render(
      <MockAuthContextProvider>
        <Router>
          <LoginPage pageState="LOGIN" />
        </Router>
      </MockAuthContextProvider>
    );

    expect(screen.queryByLabelText('Name')).toBeNull();
    expect(screen.queryByLabelText('Email')).toBeDefined();
    expect(screen.queryByLabelText('Passwort')).toBeDefined();
    expect(screen.queryByLabelText('Passwort wiederholen')).toBeNull();
    expect(screen.queryByText('Passwort vergessen?')).toBeDefined();
  });

  it('renders register form', async () => {
    render(
      <MockAuthContextProvider>
        <Router>
          <LoginPage pageState="REGISTER" />
        </Router>
      </MockAuthContextProvider>
    );

    expect(screen.queryByLabelText('Name')).toBeDefined();
    expect(screen.queryByLabelText('Email')).toBeDefined();
    expect(screen.queryByLabelText('Passwort')).toBeDefined();
    expect(screen.queryByLabelText('Passwort wiederholen')).toBeDefined();
    expect(screen.queryByText('Lieber einloggen?')).toBeDefined();
  });
});
