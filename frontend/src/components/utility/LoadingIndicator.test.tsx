import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import LoadingIndicator from './LoadingIndicator';

afterEach(cleanup);

describe('LoadingIndicator', () => {
  it('shows spinner and text', () => {
    render(<LoadingIndicator text="test-text" />);

    expect(screen.getByText('test-text')).toBeDefined();
  });
});
