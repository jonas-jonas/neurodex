import { act, cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Homepage from '../../pages/Homepage';
import { api } from '../../util/api';
import { MockAuthContextProvider } from '../__mocks__/authcontext.mock';
import { mockModel } from '../__mocks__/modelcontext.mock';

afterEach(cleanup);

describe('Homepage', () => {
  it('renders models if authenticated', async () => {
    const mockApi = jest.spyOn(api, 'get');
    const response = new Response(JSON.stringify([mockModel]), { status: 200 });
    mockApi.mockResolvedValue(response);

    await act(async () => {
      render(
        <Router>
          <MockAuthContextProvider isAuthenticated={true}>
            <Homepage />
          </MockAuthContextProvider>
        </Router>
      );
      expect(screen.getByText('Loading models...')).toBeDefined();
    });

    expect(mockApi.mock.calls.length).toBe(1);
    expect(screen.getByText('model-name')).toBeDefined();
    expect(screen.getByText('1 Modell')).toBeDefined();
    mockApi.mockRestore();
  });
});
