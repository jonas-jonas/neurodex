import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ModelpageWrapper from '../../pages/Modelpage';
import { MockPageContextProvider } from '../__mocks__/pagecontext.mock';

afterEach(cleanup);

describe('ModelpageWrapper', () => {
  it('shows loading indicator when loading model', () => {
    render(
      <Router>
        <MockPageContextProvider>
          <ModelpageWrapper />
        </MockPageContextProvider>
      </Router>
    );

    expect(screen.getByText('Loading model...')).toBeDefined();
  });
});
