import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import ModelLayerPanel from '../../../components/modelpage/ModelLayerPanel';
import MockModelContextProvider from '../../__mocks__/modelcontext.mock';
import { ModelLayer } from '../../../data/models';

afterEach(cleanup);

it('Renders panel with model layer cards', () => {
  const layers: ModelLayer[] = [
    {
      id: 1,
      layerName: 'some-layer',
      parameterData: {
        in_features: { value: '0' },
        bias: { value: 'true' }
      },
      layerType: {
        id: 'torch.nn.Linear',
        description: '',
        layerName: 'linear',
        parameters: [{ name: 'in_features', type: 'number', defaultValue: '3' }]
      }
    },
    {
      id: 2,
      layerName: 'some-second-layer',
      parameterData: {
        in_features: { value: '2' },
        bias: { value: 'false' }
      },
      layerType: {
        id: 'torch.nn.Linear',
        description: '',
        layerName: 'linear',
        parameters: [
          { name: 'in_features', type: 'number', defaultValue: '3' },
          { name: 'bias', type: 'boolean', defaultValue: 'true' }
        ]
      }
    }
  ];

  render(
    <MockModelContextProvider layers={layers}>
      <ModelLayerPanel />
    </MockModelContextProvider>
  );

  const layerNameInputs = screen.queryAllByPlaceholderText('Layername');
  expect(layerNameInputs.length).toEqual(2);
});
