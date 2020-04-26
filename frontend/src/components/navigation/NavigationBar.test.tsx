import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './NavigationBar';
import { User } from '../../data/models';
import { MockAuthContextProvider } from '../../contexts/authcontext.mock';
import { MockPageContextProvider } from '../../contexts/pagecontext.mock';
afterEach(cleanup);

it('NavigationBar displays page title if set', async () => {
  render(
    <Router>
      <MockPageContextProvider pageTitle="Some page title">
        <MockAuthContextProvider isAuthenticated={false} user={undefined}>
          <Navigation />
        </MockAuthContextProvider>
      </MockPageContextProvider>
    </Router>
  );

  expect(screen.getByText('Some page title')).toBeDefined();
});

it('NavigationBar displays login button if user not logged in', async () => {
  render(
    <Router>
      <MockPageContextProvider pageTitle="Some page title">
        <MockAuthContextProvider isAuthenticated={false} user={undefined}>
          <Navigation />
        </MockAuthContextProvider>
      </MockPageContextProvider>
    </Router>
  );

  expect(screen.getByText('Login')).toBeDefined();
});

it('NavigationBar displays UserMenu if user is logged in', async () => {
  const user: User = {
    roles: [],
    id: '3',
    email: 'email@test.com',
    name: 'user-name',
  };
  render(
    <Router>
      <MockPageContextProvider pageTitle="Some page title">
        <MockAuthContextProvider isAuthenticated={true} user={user}>
          <Navigation />
        </MockAuthContextProvider>
      </MockPageContextProvider>
    </Router>
  );

  expect(screen.getByText('user-name')).toBeDefined();
});
