import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LayerType } from '../../data/models';
import ModelpageWrapper, { LayerCard, Modelpage } from '../../pages/Modelpage';
import MockModelContextProvider from '../../__mocks__/modelcontext.mock';
import { MockPageContextProvider } from '../../__mocks__/pagecontext.mock';

afterEach(cleanup);

const layerType: LayerType = {
  description: '',
  id: 'torch.nn.Linear',
  layerName: 'linear',
  parameters: []
};

describe('LayerCard', () => {
  it('renders layer information for set LayerType', async () => {
    const layerType: LayerType = {
      description: '',
      id: 'torch.nn.Linear',
      layerName: 'linear',
      parameters: []
    };
    const onAdd = jest.fn();
    render(<LayerCard layerType={layerType} onAdd={onAdd} />);

    expect(screen.getByText('torch.nn.Linear')).toBeDefined();
  });
  it('triggers onAdd for correct layer id', async () => {
    const layerType: LayerType = {
      description: '',
      id: 'torch.nn.Linear',
      layerName: 'linear',
      parameters: []
    };
    const onAdd = jest.fn();
    render(<LayerCard layerType={layerType} onAdd={onAdd} />);

    await act(async () => {
      fireEvent.click(screen.getByTitle('Zum Modell hinzufügen'));
    });

    expect(onAdd.mock.calls.length).toBe(1);
    expect(onAdd.mock.calls[0][0]).toBe('torch.nn.Linear');
  });
});

describe('Modelpage', () => {
  it('renders LayerCards for multiple available layers', () => {
    const layer2 = {
      ...layerType,
      id: 'torch.nn.Bilinear'
    };
    render(
      <MockModelContextProvider availableLayers={[layerType, layer2]}>
        <Modelpage />
      </MockModelContextProvider>
    );
    expect(screen.getByText('torch.nn.Linear')).toBeDefined();
    expect(screen.getByText('torch.nn.Bilinear')).toBeDefined();
  });

  it('triggers model update on layer add', async () => {
    const updateModel = jest.fn();

    render(
      <MockModelContextProvider availableLayers={[layerType]} updateModel={updateModel}>
        <Modelpage />
      </MockModelContextProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTitle('Zum Modell hinzufügen'));
    });

    expect(updateModel.mock.calls.length).toBe(1);
  });
});

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
