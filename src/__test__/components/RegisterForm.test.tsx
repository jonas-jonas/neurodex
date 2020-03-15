import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterForm from '../../components/RegisterForm';
import { MockAuthContextProvider } from '../../__mocks__/authcontext.mock';
import { HTTPError } from 'ky';

afterEach(cleanup);

describe('RegisterForm', () => {
  it('submit button is disabled with invalid data ', async () => {
    const setLoginPageState = jest.fn();
    render(
      <Router>
        <MockAuthContextProvider>
          <RegisterForm setLoginPageState={setLoginPageState} />
        </MockAuthContextProvider>
      </Router>
    );

    const emailField = screen.getByLabelText('Email');
    expect(emailField).toBeDefined();

    const passwordField = screen.getByLabelText('Passwort');
    expect(passwordField).toBeDefined();

    const repeatPasswordField = screen.getByLabelText('Passwort wiederholen');
    expect(repeatPasswordField).toBeDefined();

    await act(async () => {
      fireEvent.input(emailField, { target: { value: '' } });
      fireEvent.input(passwordField, { target: { value: '' } });
      fireEvent.input(repeatPasswordField, { target: { value: '' } });
    });

    const submitButton = (await screen.findByText('Registrieren')) as HTMLButtonElement;
    expect(submitButton.disabled).toBeTruthy();
  });

  it('submit button is enabled and triggers register and authenticate with valid data', async () => {
    const setLoginPageState = jest.fn();
    const registerUser = jest.fn();
    registerUser.mockResolvedValue({
      status: 200
    });
    const authenticate = jest.fn();
    render(
      <Router>
        <MockAuthContextProvider registerUser={registerUser} authenticate={authenticate}>
          <RegisterForm setLoginPageState={setLoginPageState} />
        </MockAuthContextProvider>
      </Router>
    );

    const emailField = screen.getByLabelText('Email');
    const passwordField = screen.getByLabelText('Passwort');
    const repeatPasswordField = screen.getByLabelText('Passwort wiederholen');

    await act(async () => {
      fireEvent.input(emailField, { target: { value: 'some-email@test.invalid' } });
      fireEvent.input(passwordField, { target: { value: 'some-password' } });
      fireEvent.input(repeatPasswordField, { target: { value: 'some-password' } });
    });

    const submitButton = screen.getByText('Registrieren') as HTMLButtonElement;
    expect(submitButton.disabled).toBeFalsy();

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(registerUser.mock.calls.length).toBe(1);
    expect(registerUser.mock.calls[0][0]).toEqual('some-email@test.invalid');
    expect(registerUser.mock.calls[0][1]).toEqual('some-password');
    expect(registerUser.mock.calls[0][2]).toEqual('some-password');
    expect(authenticate.mock.calls.length).toBe(1);
  });

  it('error message is displayed, when registerUser fails', async () => {
    const setLoginPageState = jest.fn();
    const registerUser = jest.fn();
    const mockResponse = new Response(JSON.stringify({ field: 'password', message: 'some error message' }), {
      status: 500
    });
    registerUser.mockRejectedValue(new HTTPError(mockResponse));
    const authenticate = jest.fn();
    render(
      <Router>
        <MockAuthContextProvider registerUser={registerUser} authenticate={authenticate}>
          <RegisterForm setLoginPageState={setLoginPageState} />
        </MockAuthContextProvider>
      </Router>
    );

    const userNameField = screen.getByLabelText('Email');
    const passwordField = screen.getByLabelText('Passwort');
    const repeatPasswordField = screen.getByLabelText('Passwort wiederholen');

    await act(async () => {
      fireEvent.input(userNameField, { target: { value: 'some-email@test.invalid' } });
      fireEvent.input(passwordField, { target: { value: 'some-password' } });
      fireEvent.input(repeatPasswordField, { target: { value: 'some-password3' } });
    });

    const submitButton = screen.getByText('Registrieren') as HTMLButtonElement;
    expect(submitButton.disabled).toBeFalsy();

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(registerUser.mock.calls.length).toBe(1);
    expect(screen.getByText('some error message')).toBeDefined();
    expect(authenticate.mock.calls.length).toBe(0);
  });
});
