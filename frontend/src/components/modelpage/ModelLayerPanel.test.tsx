import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import ModelLayerPanel from './ModelLayerPanel';
import MockModelContextProvider from '../../contexts/modelcontext.mock';
import { ModelLayer } from '../../data/models';
import generate from '../../util/generate';

afterEach(cleanup);

describe('ModeLayerPanel', () => {
  it('Renders panel with model layer cards', () => {
    const layers: ModelLayer[] = [
      generate.modelLayer({ displayName: 'some-layer' }),
      generate.modelLayer({ displayName: 'some-second-layer' }),
    ];

    render(
      <MockModelContextProvider layers={layers}>
        <ModelLayerPanel />
      </MockModelContextProvider>
    );

    expect(screen.getByText('some-layer')).toBeDefined();
    expect(screen.getByText('some-second-layer')).toBeDefined();
  });
});
