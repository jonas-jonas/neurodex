import { cleanup, render, screen, act, fireEvent } from '@testing-library/react';
import React from 'react';
import MockModelContextProvider from '../../contexts/modelcontext.mock';
import generate from '../../util/generate';
import LayersModal from './LayersModal';
import { Modal } from '../utility/Modal';

afterEach(cleanup);

describe('LayersModal', () => {
  it('shows all available layers', () => {
    const layers = [
      generate.layerType(),
      generate.layerType(),
      generate.layerType(),
      generate.layerType(),
      generate.layerType(),
    ];

    render(
      <MockModelContextProvider availableLayers={layers}>
        <Modal component={<LayersModal />} />
      </MockModelContextProvider>
    );

    expect(screen.getAllByText('Verwenden').length).toBe(6);
  });

  it('adds layer with button click', async () => {
    const updateModel = jest.fn();
    const layer = generate.layerType();

    render(
      <MockModelContextProvider availableLayers={[layer]} updateModel={updateModel}>
        <Modal component={<LayersModal />} />
      </MockModelContextProvider>
    );

    const useButton = screen.getAllByText('Verwenden')[0];

    await act(async () => {
      fireEvent.click(useButton);
    });

    expect(updateModel).toBeCalledWith({ type: 'ADD_LAYER', layerTypeId: layer.layerTypeId });
  });
});
