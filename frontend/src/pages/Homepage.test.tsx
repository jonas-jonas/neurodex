import { act, cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Homepage from './Homepage';
import { api } from '../util/api';
import { MockAuthContextProvider } from '../contexts/authcontext.mock';
import { mockModel } from '../contexts/modelcontext.mock';
import { MockPageContextProvider } from '../contexts/pagecontext.mock';

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
            <MockPageContextProvider>
              <Homepage />
            </MockPageContextProvider>
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
