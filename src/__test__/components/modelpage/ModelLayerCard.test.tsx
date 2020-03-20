import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ModelLayerCard from '../../../components/modelpage/ModelLayerCard';
import MockModelContextProvider from '../../__mocks__/modelcontext.mock';
import { act } from 'react-dom/test-utils';
import { ModelLayer } from '../../../data/models';

afterEach(cleanup);

const modelLayer: ModelLayer = {
  id: 1,
  layerName: 'some-layer',
  parameterData: {
    in_features: { value: '128' },
    bias: { value: 'true' }
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
};

it('Renders ModelLayerCard with correct model layer', () => {
  render(
    <MockModelContextProvider>
      <ModelLayerCard modelLayer={modelLayer} index={0} />
    </MockModelContextProvider>
  );

  expect(screen.queryByDisplayValue('some-layer')).toBeDefined();
  expect(screen.queryByText('torch.nn.Linear')).toBeDefined();
  expect(screen.queryByLabelText('in_features')).toBeInstanceOf(HTMLInputElement);
  let inFeaturesInput = screen.getByLabelText('in_features') as HTMLInputElement;
  expect(inFeaturesInput.value).toBe('128');
  // 2 is the number of parameters in the layer
  expect(screen.queryAllByTestId('parameters-1').length).toBe(2);
});

it('Deleting a layer triggers delete call', async () => {
  const updateModel = jest.fn();

  render(
    <MockModelContextProvider updateModel={updateModel}>
      <ModelLayerCard modelLayer={modelLayer} index={0} />
    </MockModelContextProvider>
  );

  await act(async () => {
    const deleteButton = await screen.findByTitle('Layer some-layer löschen');
    fireEvent.click(deleteButton);
    expect(screen.getByText('Updating...')).toBeDefined();
  });

  expect(updateModel.mock.calls.length).toEqual(1);
  // The parameter with which the deleteLayer function was called should be
  // the id of the layer
  expect(updateModel.mock.calls[0][0]).toEqual({ type: 'DELETE_LAYER', modelLayerId: 1 });
});

it('Updating values triggers updateLayer call', async () => {
  const updateModel = jest.fn();

  render(
    <MockModelContextProvider updateModel={updateModel}>
      <ModelLayerCard modelLayer={modelLayer} index={0} />
    </MockModelContextProvider>
  );

  await act(async () => {
    const inFeaturesInput = await screen.findByLabelText('in_features');
    fireEvent.change(inFeaturesInput, { target: { value: '256' } });
    fireEvent.blur(inFeaturesInput);
    expect(screen.getByText('Updating...')).toBeDefined();
  });

  expect(updateModel.mock.calls.length).toEqual(1);
  // The parameter with which the deleteLayer function was called should be
  // the id of the layer
  expect(updateModel.mock.calls[0][0]).toEqual({
    type: 'UPDATE_LAYER',
    modelLayerId: 1,
    parameterName: 'in_features',
    newValue: '256'
  });
});
