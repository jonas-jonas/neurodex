import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserMenu from './UserMenu';
import { User } from '../../data/models';
import { MockAuthContextProvider } from '../../contexts/authcontext.mock';
afterEach(cleanup);

it('UserMenu section displays username', async () => {
  const user: User = {
    roles: [],
    id: '3',
    email: 'email@test.com',
    name: 'user-name',
  };
  render(
    <Router>
      <UserMenu onLogout={jest.fn()} user={user} />
    </Router>
  );

  expect(screen.getByText('user-name')).toBeDefined();
});

it('UserMenu expand triggers expand', async () => {
  const user: User = {
    roles: [],
    id: '3',
    email: 'email@test.com',
    name: 'username',
  };
  render(
    <Router>
      <MockAuthContextProvider>
        <UserMenu onLogout={jest.fn()} user={user} />
      </MockAuthContextProvider>
    </Router>
  );

  await act(async () => {
    fireEvent.click(screen.getByTitle('Usermenu'));
  });
  expect(screen.getByText('Einstellungen')).toBeDefined();
  expect(screen.getByText('Logout')).toBeDefined();
});
