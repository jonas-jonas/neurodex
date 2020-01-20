import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserMenuPopup from '../../../components/navigation/UserMenuPopup';
afterEach(cleanup);

it('Click on document.body closes UserMenuPopup', async () => {
  const toggleMenu = jest.fn();
  render(
    <Router>
      <UserMenuPopup onLogout={jest.fn()} toggleMenu={toggleMenu} />
    </Router>
  );

  await act(async () => {
    fireEvent.click(document.body);
  });

  expect(toggleMenu.mock.calls.length).toBe(1);
});

it('Click on logout triggers logout', async () => {
  const onLogout = jest.fn();
  render(
    <Router>
      <UserMenuPopup onLogout={onLogout} toggleMenu={jest.fn()} />
    </Router>
  );

  await act(async () => {
    fireEvent.click(screen.getByTitle('Logout'));
  });

  expect(onLogout.mock.calls.length).toBe(1);
});
