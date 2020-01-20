import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import { MockAuthContextProvider } from '../../__mocks__/authcontext.mock';

afterEach(cleanup);

it('Login form sign in trigger authenticate call', async () => {
  const authenticate = jest.fn(() => {
    return new Promise<Response>(() => {
      return {
        status: 200
      };
    });
  });
  render(
    <Router>
      <MockAuthContextProvider authenticate={authenticate}>
        <LoginForm />
      </MockAuthContextProvider>
    </Router>
  );

  const userNameField = screen.getByLabelText('Username');
  expect(userNameField).toBeDefined();

  const passwordField = screen.getByLabelText('Password');
  expect(passwordField).toBeDefined();

  await act(async () => {
    fireEvent.change(userNameField, { target: { value: 'some-username' } });
    fireEvent.change(passwordField, { target: { value: 'some-password' } });
  });

  await act(async () => {
    // fireEvent.click();
    const submitButton = (await screen.findByText('Login')) as HTMLButtonElement;
    if (submitButton.form) {
      fireEvent.submit(submitButton.form);
    }
  });
  expect(authenticate.mock.calls.length).toBe(1);
});
