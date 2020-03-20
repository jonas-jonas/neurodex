import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserMenuPopup from '../../../components/navigation/UserMenuPopup';
import { MockAuthContextProvider } from '../../__mocks__/authcontext.mock';
afterEach(cleanup);

it('Click on document.body closes UserMenuPopup', async () => {
  const toggleMenu = jest.fn();
  render(
    <Router>
      <MockAuthContextProvider>
        <UserMenuPopup onLogout={jest.fn()} toggleMenu={toggleMenu} />
      </MockAuthContextProvider>
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
      <MockAuthContextProvider>
        <UserMenuPopup onLogout={onLogout} toggleMenu={jest.fn()} />
      </MockAuthContextProvider>
    </Router>
  );

  await act(async () => {
    fireEvent.click(screen.getByTitle('Logout'));
  });

  expect(onLogout.mock.calls.length).toBe(1);
});
