import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserMenu from '../../../components/navigation/UserMenu';
import { User } from '../../../data/models';
afterEach(cleanup);

it('UserMenu section displays username', async () => {
  const user: User = {
    admin: false,
    id: '3',
    username: 'username'
  };
  render(
    <Router>
      <UserMenu onLogout={jest.fn()} user={user} />
    </Router>
  );

  expect(screen.getByText('username')).toBeDefined();
});

it('UserMenu expand triggers expand', async () => {
  const user: User = {
    admin: false,
    id: '3',
    username: 'username'
  };
  render(
    <Router>
      <UserMenu onLogout={jest.fn()} user={user} />
    </Router>
  );

  await act(async () => {
    fireEvent.click(screen.getByTitle('Usermenu'));
  });
  expect(screen.getByText('Einstellungen')).toBeDefined();
  expect(screen.getByText('Logout')).toBeDefined();
});