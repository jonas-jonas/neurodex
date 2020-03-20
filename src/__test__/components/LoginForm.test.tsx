import { act, cleanup, fireEvent, render, screen, wait } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import { MockAuthContextProvider } from '../__mocks__/authcontext.mock';

afterEach(cleanup);

it('Login form sign in trigger authenticate call', async () => {
  const authenticateMock = jest.fn();
  authenticateMock.mockResolvedValue({
    status: 200
  });
  render(
    <Router>
      <MockAuthContextProvider authenticate={authenticateMock}>
        <LoginForm />
      </MockAuthContextProvider>
    </Router>
  );

  const emailField = screen.getByLabelText('Email');
  expect(emailField).toBeDefined();

  const passwordField = screen.getByLabelText('Passwort');
  expect(passwordField).toBeDefined();

  await act(async () => {
    fireEvent.change(emailField, { target: { value: 'some-email@test.invalid' } });
    fireEvent.change(passwordField, { target: { value: 'some-password' } });
  });

  await act(async () => {
    // fireEvent.click();
    const submitButton = (await screen.findByText('Login')) as HTMLButtonElement;
    if (submitButton.form) {
      fireEvent.submit(submitButton.form);
    }
  });
  expect(authenticateMock.mock.calls.length).toBe(1);
});

it('Login form sign in trigger authenticate call', async () => {
  const authenticateMock = jest.fn();
  authenticateMock.mockResolvedValue({
    status: 500,
    json: () => {
      return { message: 'Some error message' };
    }
  });
  render(
    <Router>
      <MockAuthContextProvider authenticate={authenticateMock}>
        <LoginForm />
      </MockAuthContextProvider>
    </Router>
  );

  const emailField = screen.getByLabelText('Email');
  const passwordField = screen.getByLabelText('Passwort');

  await act(async () => {
    fireEvent.change(emailField, { target: { value: 'some-email@email.invalid' } });
    fireEvent.change(passwordField, { target: { value: 'some-password' } });
  });

  await act(async () => {
    // fireEvent.click();
    const submitButton = (await screen.findByText('Login')) as HTMLButtonElement;
    if (submitButton.form) {
      fireEvent.submit(submitButton.form);
    }
  });
  await wait(() => screen.getByText('Some error message'));
  expect(screen.getByText('Some error message')).toBeDefined();

  expect(authenticateMock.mock.calls.length).toBe(1);
});
